"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import type { ProductVersion } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addProduct(product: ProductVersion) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const existingProduct = await db.product.findFirst({
      where: {
        versions: { some: { version_id: product.version_id } },
        supplier_id: product.supplier_id || undefined,
        business_id: user?.businessId,
      },
    });
    if (existingProduct) {
      return {
        status: "error",
        msg: "Product exists already",
      };
    }

    const newProduct = await db.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          name: product.name,
          description: product.description,
          business: { connect: { id: user?.businessId } },
          versions: {
            create: {
              ...product,
              version_id: product.version_id || "1",
              status: product.status,
            },
          },
          current_version: {
            create: {
              ...product,
              version_id: product.version_id || "1",
              status: product.status || "ACTIVE",
            },
          },
        },
        include: {
          current_version: true,
          versions: true,
        },
      });

      if (!createdProduct) {
        return {
          status: "error",
          msg: "Error creating product",
        };
      }

      await tx.log.create({
        data: {
          supplier_id: createdProduct.supplier_id,
          product_id: createdProduct.id,
          type: "NEW_PRODUCT",
          user_id: user.id,
          business_id: createdProduct.business_id ?? "",
        },
      });

      revalidatePath("/", "layout");
      return {
        status: "success",
        msg: "Product added successfully",
        data: createdProduct,
      };
    });

    return newProduct;
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error adding product: ${error.message}`,
      };
  }
}

export async function createProductVersion(input: ProductVersion) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const product = await db.product.findUnique({
      where: { id: input.product_id },
      include: { versions: { orderBy: { created_at: "desc" }, take: 1 } },
    });

    if (!product) {
      return {
        status: "error",
        msg: "Product not found",
      };
    }

    const latestVersion = product.versions[0];
    const newVersionId = latestVersion
      ? String(Number(latestVersion.version_id) + 1)
      : "1";

    const newVersion = await db.$transaction(async (tx) => {
      const createdVersion = await tx.productVersion.create({
        data: {
          ...input,
          version_id: newVersionId,
          supplier_id: input.supplier_id || undefined,
        },
      });

      await tx.product.update({
        where: { id: input.product_id },
        data: { current_version: { connect: { id: createdVersion.id } } },
      });

      await tx.log.create({
        data: {
          supplier_id: createdVersion.supplier_id,
          product_id: createdVersion.product_id,
          type: "NEW_PRODUCT_VERSION",
          user_id: user.id,
          business_id: product.business_id ?? "",
        },
      });

      revalidatePath("/", "layout");
      return {
        status: "success",
        msg: "Product version added successfully",
        data: createdVersion,
      };
    });

    return newVersion;
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error adding product version: ${error.message}`,
      };
  }
}

export async function editProduct(
  productId: string,
  product: Partial<ProductVersion>
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const updatedProduct = await db.$transaction(async (tx) => {
      const existingProduct = await tx.product.findUnique({
        where: {
          id: productId,
          business_id: user?.businessId,
        },
      });

      if (!existingProduct) {
        return {
          status: "error",
          msg: "No product found",
        };
      }

      const updatedProduct = await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          name: product.name,
          description: product.description,
          current_version: {
            update: product,
          },
        },
        include: {
          current_version: true,
        },
      });

      if (!updatedProduct) {
        return {
          status: "error",
          msg: "Failed to update product",
        };
      }

      await tx.log.create({
        data: {
          product_id: productId,
          supplier_id: updatedProduct.supplier_id,
          type: "PRODUCT_UPDATE",
          user_id: user.id,
          business_id: user?.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
      return {
        status: "success",
        msg: "Product updated successfully",
        data: updatedProduct,
      };
    });

    return updatedProduct;
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error updating product: ${error.message}`,
      };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const result = await db.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId, business_id: user.businessId },
        include: { transactions: true },
      });

      if (!product) {
        return {
          status: "error",
          msg: `No product found with ID: ${productId}`,
        };
      }

      const hasSales = product.transactions.some(
        (transaction) => transaction.type === "OUT"
      );
      if (hasSales) {
        return {
          status: "error",
          msg: `Product with ID: ${productId} has sales transactions and cannot be deleted.`,
        };
      }

      await tx.product.delete({
        where: { id: productId },
      });

      await tx.log.create({
        data: {
          product_id: productId,
          supplier_id: product.supplier_id,
          type: "PRODUCT_DELETE",
          user_id: user.id,
          business_id: user.businessId!,
        },
      });

      revalidatePath("/", "layout");

      return {
        status: "success",
        msg: "Product deleted successfully!",
      };
    });

    return result;
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Failed to delete product: ${error.message}`,
      };
  }
}
