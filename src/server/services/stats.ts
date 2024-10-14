"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";

export async function productCount() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const count = await db.product.count({
      where: { business_id: user.businessId, deleted_at: null },
    });

    return {
      status: "success",
      msg: "Product count retrieved successfully",
      data: count,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error retrieving product count: ${error.message}`,
      };
  }
}

export async function totalStock() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const tStock = await db.productVersion.aggregate({
      _sum: { stock: true },
      where: { product: { business_id: user.businessId } },
    });

    return {
      status: "success",
      msg: "Total stock retrieved successfully",
      data: tStock._sum.stock || 0,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error retrieving total stock: ${error.message}`,
      };
  }
}

export async function supplierCount() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const count = await db.supplier.count({
      where: { business_id: user.businessId, deleted_at: null },
    });

    return {
      status: "success",
      msg: "Supplier count retrieved successfully",
      data: count,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error retrieving supplier count: ${error.message}`,
      };
  }
}

export async function transactionsCount() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const count = await db.stockMovement.count({
      where: { business_id: user.businessId },
    });

    return {
      status: "success",
      msg: "Transactions count retrieved successfully",
      data: count,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error retrieving transactions count: ${error.message}`,
      };
  }
}

export async function totalPurchase() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const total = await db.stockMovement.aggregate({
      _sum: { quantity: true },
      where: {
        type: "IN",
        business_id: user.businessId,
      },
    });

    return {
      status: "success",
      msg: "Total purchase retrieved successfully",
      data: total._sum.quantity || 0,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error retrieving total purchase: ${error.message}`,
      };
  }
}

export async function totalSale() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const total = await db.stockMovement.aggregate({
      _sum: { quantity: true },
      where: {
        type: "OUT",
        business_id: user.businessId,
      },
    });

    return {
      status: "success",
      msg: "Total sale retrieved successfully",
      data: total._sum.quantity || 0,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error retrieving total sale: ${error.message}`,
      };
  }
}
