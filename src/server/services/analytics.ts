"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { startOfDay } from "date-fns";

export async function calculatePurchaseStockValue() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const products = await db.stockMovement.findMany({
      where: { business_id: user.businessId },
      select: {
        quantity: true,
        product: { include: { versions: { select: { buying_price: true } } } },
      },
    });

    const marketCapValue = products.reduce((total, product) => {
      return (
        total + product.quantity * +product.product.versions[0].buying_price
      );
    }, 0);

    return {
      status: "success",
      msg: "Purchase stock value calculated successfully",
      data: marketCapValue,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error calculating purchase stock value: ${error.message}`,
      };
  }
}

export async function calculateSaleStockValue() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const products = await db.stockMovement.findMany({
      where: { business_id: user.businessId, type: "OUT" },
      select: {
        quantity: true,
        product: { include: { versions: { select: { selling_price: true } } } },
      },
    });

    const saleValue = products.reduce((total, product) => {
      return (
        total + product.quantity * +product.product.versions[0].selling_price
      );
    }, 0);

    return {
      status: "success",
      msg: "Sale stock value calculated successfully",
      data: saleValue,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error calculating sale stock value: ${error.message}`,
      };
  }
}

export async function calculateExpectedStockProfit() {
  try {
    const purchaseValue = await calculatePurchaseStockValue();
    const saleValue = await calculateSaleStockValue();

    if (
      !purchaseValue ||
      !saleValue ||
      purchaseValue.status === "error" ||
      saleValue.status === "error"
    ) {
      return {
        status: "error",
        msg: "Error calculating expected stock profit",
      };
    }

    const profit = saleValue.data! - purchaseValue.data!;

    return {
      status: "success",
      msg: "Expected stock profit calculated successfully",
      data: profit,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error calculating expected stock profit: ${error.message}`,
      };
  }
}

export async function productWithMaxStock() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const product = await db.product.findFirst({
      where: { business_id: user.businessId },
      orderBy: {
        current_version: {
          stock: "desc",
        },
      },
      include: {
        current_version: true,
      },
    });

    return {
      status: "success",
      msg: "Product with max stock retrieved successfully",
      data: product,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error retrieving product with max stock: ${error.message}`,
      };
  }
}

export async function productWithMinStock() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const product = await db.product.findFirst({
      where: { business_id: user.businessId },
      orderBy: {
        current_version: {
          stock: "asc",
        },
      },
      include: {
        current_version: true,
      },
    });

    return {
      status: "success",
      msg: "Product with min stock retrieved successfully",
      data: product,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error retrieving product with min stock: ${error.message}`,
      };
  }
}

export async function profitPerDay(date: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const sales = await db.stockMovement.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        type: "OUT",
        created_at: {
          gte: startOfDay(date),
        },
        business_id: user.businessId,
      },
    });

    const purchases = await db.stockMovement.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        type: "IN",
        created_at: {
          gte: startOfDay(date),
        },
        business_id: user.businessId,
      },
    });

    const profit = (sales._sum.quantity || 0) - (purchases._sum.quantity || 0);

    return {
      status: "success",
      msg: "Profit per day calculated successfully",
      data: profit,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error calculating profit per day: ${error.message}`,
      };
  }
}
