"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { revalidatePath } from "next/cache";

export async function deductProductQuantity(
  productId: string,
  quantity: number
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const result = await db.$transaction(async (tx) => {
      const existingProduct = await tx.product.findFirst({
        where: { id: productId, business_id: user?.businessId },
        include: { current_version: true },
      });

      if (!existingProduct || !existingProduct.current_version) {
        return {
          status: "error",
          msg: `No product found with ID: ${productId}`,
        };
      }

      if (existingProduct.current_version.stock < quantity) {
        return {
          status: "error",
          msg: `Insufficient stock for product with ID: ${productId}`,
        };
      }

      if (existingProduct.current_version.status === "OUT_OF_STOCK") {
        return {
          status: "error",
          msg: `Product with ID: ${productId} is out of stock`,
        };
      }

      const updatedProduct = await tx.productVersion.update({
        where: { id: existingProduct.current_version.id },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });

      if (!updatedProduct) {
        return {
          status: "error",
          msg: `Error updating product stock`,
        };
      }

      const stockMovement = await tx.stockMovement.create({
        data: {
          product_id: productId,
          quantity: quantity,
          type: "OUT",
          user_id: user.id!,
          business_id: user.businessId ?? "",
        },
      });

      await tx.log.create({
        data: {
          product_id: productId,
          type: "STOCK_MOVEMENT",
          user_id: user.id,
          business_id: user.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
      return {
        status: "success",
        msg: `Stock deducted successfully`,
        data: { updatedProduct, stockMovement },
      };
    });

    return result;
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error deducting stock `,
    };
  }
}

// Make a purchase
export async function incrementProductQuantity(
  productId: string,
  quantity: number
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const result = await db.$transaction(async (tx) => {
      const existingProduct = await tx.product.findFirst({
        where: { id: productId, business_id: user?.businessId },
        include: { current_version: true },
      });

      if (!existingProduct || !existingProduct.current_version) {
        return {
          status: "error",
          msg: `No product found with ID: ${productId}`,
        };
      }

      const updatedProduct = await tx.productVersion.update({
        where: { id: existingProduct.current_version.id },
        data: {
          stock: {
            increment: quantity,
          },
          status: "ACTIVE",
        },
      });

      if (!updatedProduct) {
        return {
          status: "error",
          msg: `Error updating product stock`,
        };
      }

      const stockMovement = await tx.stockMovement.create({
        data: {
          product_id: productId,
          quantity: quantity,
          type: "IN",
          user_id: user.id!,
          business_id: user.businessId ?? "",
        },
      });

      await tx.log.create({
        data: {
          product_id: productId,
          type: "STOCK_MOVEMENT",
          user_id: user.id,
          business_id: user.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
      return {
        status: "success",
        msg: `Stock incremented successfully`,
        data: { updatedProduct, stockMovement },
      };
    });

    return result;
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error incrementing stock `,
    };
  }
}
