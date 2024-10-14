"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import type { Supplier } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addSupplier(supplier: Supplier) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const existingSupplier = await db.supplier.findFirst({
      where: {
        email: supplier.email,
        business_id: user?.businessId,
      },
    });
    if (existingSupplier) {
      return {
        status: "error",
        msg: "Supplier with this email already exists",
      };
    }

    const newSupplier = await db.$transaction(async (tx) => {
      const createdSupplier = await tx.supplier.create({
        data: {
          ...supplier,
          //   business: { connect: { id: user?.businessId } },
        },
      });

      if (!createdSupplier) {
        return {
          status: "error",
          msg: "Error creating supplier",
        };
      }

      await tx.log.create({
        data: {
          supplier_id: createdSupplier.id,
          type: "NEW_SUPPLIER",
          user_id: user.id,
          business_id: user?.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
      return {
        status: "success",
        msg: "Supplier added successfully",
        data: createdSupplier,
      };
    });

    return newSupplier;
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error adding supplier: ${error.message}`,
      };
  }
}

export async function editSupplier(
  supplierId: string,
  supplier: Partial<Supplier>
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const updatedSupplier = await db.$transaction(async (tx) => {
      const existingSupplier = await tx.supplier.findUnique({
        where: {
          id: supplierId,
          business_id: user?.businessId,
        },
      });

      if (!existingSupplier) {
        return {
          status: "error",
          msg: "No supplier found",
        };
      }

      const updatedSupplier = await tx.supplier.update({
        where: {
          id: supplierId,
        },
        data: supplier,
      });

      if (!updatedSupplier) {
        return {
          status: "error",
          msg: "Failed to update supplier",
        };
      }

      await tx.log.create({
        data: {
          supplier_id: supplierId,
          type: "SUPPLIER_UPDATE",
          user_id: user.id,
          business_id: user?.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
      return {
        status: "success",
        msg: "Supplier updated successfully",
        data: updatedSupplier,
      };
    });

    return updatedSupplier;
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error updating supplier: ${error.message}`,
      };
  }
}

export async function deleteSupplier(supplierId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const result = await db.$transaction(async (tx) => {
      const supplier = await tx.supplier.findUnique({
        where: { id: supplierId, business_id: user?.businessId },
        include: { products: true },
      });

      if (!supplier) {
        return {
          status: "error",
          msg: `No supplier found with ID: ${supplierId}`,
        };
      }

      if (supplier.products.length > 0) {
        return {
          status: "error",
          msg: `Supplier with ID: ${supplierId} has associated products and cannot be deleted.`,
        };
      }

      await tx.supplier.delete({
        where: { id: supplierId },
      });

      await tx.log.create({
        data: {
          supplier_id: supplierId,
          type: "SUPPLIER_DELETE",
          user_id: user.id,
          business_id: user?.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");

      return {
        status: "success",
        msg: "Supplier deleted successfully!",
      };
    });

    return result;
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Failed to delete supplier: ${error.message}`,
      };
  }
}
