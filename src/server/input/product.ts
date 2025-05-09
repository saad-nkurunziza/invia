"use server";
import { CreateProductFormSchema } from "@/components/input/create-product-form";
import { CreateProductVersionFormSchema } from "@/components/input/create-product-version";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/utils/api-response";
import { ApiResponse } from "@/types/api";
export async function addProduct(
  product: z.infer<typeof CreateProductFormSchema>
): Promise<ApiResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return createErrorResponse("User not authenticated");

    const existingProduct = await db.product.findFirst({
      where: {
        OR: [
          {
            supplier_id: product.supplier_id || undefined,
            business_id: user.businessId,
            name: product.name,
          },
          {
            supplier_id: product.supplier_id || undefined,
            business_id: user.businessId,
            versions: { some: { sku: product.sku } },
          },
          {
            versions: { some: { version_id: product.version_id } },
            supplier_id: product.supplier_id || undefined,
            business_id: user.businessId,
          },
        ],
      },
    });

    if (existingProduct) {
      return createErrorResponse("Product exists already");
    }

    const newProduct = await db.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          name: product.name,
          description: product.description,
          business_id: user.businessId!,
          supplier_id: product.supplier_id,
        },
        include: {
          current_version: true,
          versions: true,
        },
      });
      const createdVersion = await tx.productVersion.create({
        data: {
          name: product.name,
          description: product.description,
          stock: product.stock,
          buying_price: product.buying_price,
          selling_price: product.selling_price,
          threshold: product.threshold,
          status: product.status,
          category: product.category,
          supplier_id: product.supplier_id || undefined,
          sku: product.sku || undefined,
          version_id: product.version_id || "1",
          product_id: createdProduct.id,
        },
      });
      await tx.product.update({
        where: {
          id: createdProduct.id,
        },
        data: {
          current_version_id: createdVersion.id,
        },
      });
      if (!createdProduct) {
        return createErrorResponse("Error creating product");
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
      return createSuccessResponse(
        "Product added successfully",
        createdProduct
      );
    });

    return newProduct;
  } catch (error) {
    console.error(error);
    return createErrorResponse(`Error adding supplier`);
  }
}

export async function createProductVersion(
  input: z.infer<typeof CreateProductVersionFormSchema>
): Promise<ApiResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return createErrorResponse("User not authenticated");

    const existingProduct = await db.product.findFirst({
      where: {
        id: input.productId,
        supplier_id: input.supplier_id || undefined,
        business_id: user.businessId,
      },
      include: {
        versions: true,
      },
    });
    if (!existingProduct) {
      return createErrorResponse("Product missing");
    }
    const existingVersion = await db.product.findFirst({
      where: {
        OR: [
          {
            supplier_id: input.supplier_id || undefined,
            business_id: user.businessId,
            name: input.name,
          },
          {
            supplier_id: input.supplier_id || undefined,
            business_id: user.businessId,
            versions: { some: { sku: input.sku } },
          },
          {
            versions: { some: { version_id: input.version_id } },
            supplier_id: input.supplier_id || undefined,
            business_id: user.businessId,
          },
        ],
      },
    });

    if (existingVersion) {
      return createErrorResponse("Product version exists already");
    }

    const latestVersion = existingProduct.versions[0];
    const newVersionId = latestVersion
      ? String(Number(latestVersion.version_id) + 1)
      : "1";

    const newVersion = await db.$transaction(async (tx) => {
      const createdVersion = await tx.productVersion.create({
        data: {
          ...input,
          supplier_id: input.supplier_id || undefined,
          version_id: newVersionId,
          product_id: input.productId,
        },
      });

      await tx.product.update({
        where: { id: input.productId },
        data: { current_version: { connect: { id: createdVersion.id } } },
      });

      await tx.log.create({
        data: {
          supplier_id: createdVersion.supplier_id,
          product_id: createdVersion.product_id,
          type: "NEW_PRODUCT_VERSION",
          user_id: user.id,
          business_id: user.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
      return createSuccessResponse(
        "Product version added successfully",
        createdVersion
      );
    });

    return newVersion;
  } catch (error) {
    console.error(error);
    return createErrorResponse(`Error adding product version`);
  }
}

export async function editProduct(
  productId: string,
  product: z.infer<typeof CreateProductFormSchema>
): Promise<ApiResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return createErrorResponse("User not authenticated");

    const updatedProduct = await db.$transaction(async (tx) => {
      const existingProduct = await tx.product.findUnique({
        where: {
          id: productId,
          business_id: user.businessId,
        },
      });

      if (!existingProduct) {
        return createErrorResponse("No product found");
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
        return createErrorResponse("Failed to update product");
      }

      await tx.log.create({
        data: {
          product_id: productId,
          supplier_id: updatedProduct.supplier_id,
          type: "PRODUCT_UPDATE",
          user_id: user.id,
          business_id: user.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
      return createSuccessResponse(
        "Product updated successfully",
        updatedProduct
      );
    });

    return updatedProduct;
  } catch (error) {
    console.error(error);
    return createErrorResponse(`Error updating product`);
  }
}

export async function deleteProduct(productId: string): Promise<ApiResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return createErrorResponse("User not authenticated");

    const result = await db.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId, business_id: user.businessId },
        include: { transactions: true },
      });

      if (!product) {
        return createErrorResponse(`No product found with ID: ${productId}`);
      }

      const hasSales = product.transactions.some(
        (transaction) => transaction.type === "OUT"
      );
      if (hasSales) {
        return createErrorResponse(
          `Product with ID: ${productId} has sales transactions and cannot be deleted.`
        );
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

      return createSuccessResponse("Product deleted successfully!");
    });

    return result;
  } catch (error) {
    console.error(error);
    return createErrorResponse(`Failed to delete product`);
  }
}
