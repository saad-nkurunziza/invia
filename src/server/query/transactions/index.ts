"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth } from "date-fns";

export async function fetchTransactions(date?: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const whereClause: Prisma.StockMovementWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const transactions = await db.stockMovement.findMany({
      where: {
        business_id: user.businessId,
        ...whereClause,
      },
      orderBy: { created_at: "desc" },
      include: {
        product: {
          include: { current_version: true },
        },
        user: true,
      },
    });

    return {
      status: "success",
      msg: "Transactions fetched successfully",
      data: transactions,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching transactions `,
    };
  }
}

export async function fetchTransactionsByProduct(
  productId: string,
  date?: Date
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const whereClause: Prisma.StockMovementWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const transactions = await db.stockMovement.findMany({
      where: {
        product_id: productId,
        business_id: user.businessId,
        ...whereClause,
      },
      orderBy: { created_at: "desc" },
      include: {
        user: true,
      },
    });

    return {
      status: "success",
      msg: "Transactions fetched successfully",
      data: transactions,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching transactions `,
    };
  }
}
export async function fetchTransactionsByType(
  type: "sale" | "purchase",
  date?: Date
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const whereClause: Prisma.StockMovementWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const transactions = await db.stockMovement.findMany({
      where: {
        type: type === "sale" ? "OUT" : "IN",
        business_id: user.businessId,
        ...whereClause,
      },
      orderBy: { created_at: "desc" },
      include: {
        user: true,
      },
    });

    return {
      status: "success",
      msg: "Transactions fetched successfully",
      data: transactions,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching transactions `,
    };
  }
}
