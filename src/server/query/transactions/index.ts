"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";

export async function fetchTransactions() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const transactions = await db.stockMovement.findMany({
      where: { business_id: user.businessId },
      orderBy: { created_at: "desc" },
      include: {
        product: {
          include: { current_version: true },
        },
        user: {
          select: { name: true },
        },
      },
    });

    return {
      status: "success",
      msg: "Transactions fetched successfully",
      data: transactions,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching transactions: ${error.message}`,
      };
  }
}

export async function fetchTransactionsByProduct(productId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const transactions = await db.stockMovement.findMany({
      where: {
        product_id: productId,
        business_id: user.businessId,
      },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    return {
      status: "success",
      msg: "Transactions fetched successfully",
      data: transactions,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching transactions: ${error.message}`,
      };
  }
}
export async function fetchTransactionsByType(type: "sale" | "purchase") {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const transactions = await db.stockMovement.findMany({
      where: {
        type: type === "sale" ? "OUT" : "IN",
        business_id: user.businessId,
      },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    return {
      status: "success",
      msg: "Transactions fetched successfully",
      data: transactions,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching transactions: ${error.message}`,
      };
  }
}
