"use server";
import { EntrySupplierFormSchema } from "@/components/input/create-supplier-form";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import type { Supplier } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ApiResponse } from "@/types/api";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/utils/api-response";
export async function addSupplier(
  supplier: z.infer<typeof EntrySupplierFormSchema>
): Promise<ApiResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return createErrorResponse("User not authenticated");

    const existingSupplier = await db.supplier.findFirst({
      where: {
        email: supplier.email,
        business_id: user?.businessId,
      },
    });
    if (existingSupplier) {
      return createErrorResponse("Supplier with this email already exists");
    }

    const newSupplier = await db.$transaction(async (tx) => {
      const createdSupplier = await tx.supplier.create({
        data: {
          ...supplier,
          business_id: user.businessId ?? "",
        },
      });

      if (!createdSupplier) {
        return createErrorResponse("Error creating supplier");
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
      return createSuccessResponse(
        "Supplier added successfully",
        createdSupplier
      );
    });

    return newSupplier;
  } catch (error) {
    console.error(error);
    return createErrorResponse(`Error adding supplier`);
  }
}

export async function editSupplier(
  supplierId: string,
  supplier: Partial<Supplier>
): Promise<ApiResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return createErrorResponse("User not authenticated");

    const updatedSupplier = await db.$transaction(async (tx) => {
      const existingSupplier = await tx.supplier.findUnique({
        where: {
          id: supplierId,
          business_id: user?.businessId,
        },
      });

      if (!existingSupplier) {
        return createErrorResponse("No supplier found");
      }

      const updatedSupplier = await tx.supplier.update({
        where: {
          id: supplierId,
        },
        data: supplier,
      });

      if (!updatedSupplier) {
        return createErrorResponse("Failed to update supplier");
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
      return createSuccessResponse(
        "Supplier updated successfully",
        updatedSupplier
      );
    });

    return updatedSupplier;
  } catch (error) {
    console.error(error);
    return createErrorResponse(`Error updating supplier`);
  }
}

export async function deleteSupplier(supplierId: string): Promise<ApiResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return createErrorResponse("User not authenticated");

    const result = await db.$transaction(async (tx) => {
      const supplier = await tx.supplier.findUnique({
        where: { id: supplierId, business_id: user?.businessId },
        include: { products: true },
      });

      if (!supplier) {
        return createErrorResponse(`No supplier found with ID: ${supplierId}`);
      }

      if (supplier.products.length > 0) {
        return createErrorResponse(
          `Supplier with ID: ${supplierId} has associated products and cannot be deleted.`
        );
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

      return createSuccessResponse("Supplier deleted successfully!");
    });

    return result;
  } catch (error) {
    console.error(error);
    return createErrorResponse(`Failed to delete supplier`);
  }
}
