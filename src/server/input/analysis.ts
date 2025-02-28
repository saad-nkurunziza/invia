"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { ApiResponse } from "@/types/api";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/utils/api-response";
import { startOfMonth, endOfMonth } from "date-fns";

export async function integrateMonthlyStockValue(): Promise<ApiResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user?.businessId) {
      return createErrorResponse("User not authenticated");
    }

    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);

    return await db.$transaction(async (tx) => {
      const existingEntry = await tx.analysisStats.findFirst({
        where: {
          key: "monthly_stock_value",
          created_at: {
            gte: startDate,
            lt: endDate,
          },
          business_id: user.businessId,
        },
      });

      if (existingEntry) {
        return createErrorResponse(
          "Monthly stock value already integrated for this month"
        );
      }

      const stockValue = await tx.product.findMany({
        where: {
          business_id: user.businessId,
          deleted_at: null,
        },
        select: {
          current_version: {
            select: {
              stock: true,
              buying_price: true,
            },
          },
        },
      });

      const totalValue = stockValue.reduce((total, product) => {
        const version = product.current_version;
        if (!version?.stock || !version?.buying_price) return total;
        return total + version.stock * Number(version.buying_price);
      }, 0);

      const createdEntry = await tx.analysisStats.create({
        data: {
          key: "monthly_stock_value",
          value: totalValue,
          created_at: startDate,
          business: { connect: { id: user.businessId } },
        },
      });

      await tx.log.create({
        data: {
          type: "USER_ACTION",
          user_id: user.id!,
          business_id: user.businessId!,
        },
      });

      return createSuccessResponse(
        "Monthly stock value integrated successfully",
        createdEntry
      );
    });
  } catch (error) {
    console.error("Error integrating monthly stock value:", error);
    return createErrorResponse(
      error instanceof Error
        ? error.message
        : "Error integrating monthly stock value"
    );
  }
}

export async function getMonthlyStockValues(
  months: number
): Promise<ApiResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user?.businessId) {
      return createErrorResponse("User not authenticated");
    }

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - Math.abs(months));

    const stockValues = await db.analysisStats.findMany({
      where: {
        key: "monthly_stock_value",
        business_id: user.businessId,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return createSuccessResponse(
      "Monthly stock values retrieved successfully",
      stockValues
    );
  } catch (error) {
    console.error("Error retrieving monthly stock values:", error);
    return createErrorResponse(
      error instanceof Error
        ? error.message
        : "Error retrieving monthly stock values"
    );
  }
}

export async function getTopSellingProducts(
  limit: number,
  period: "week" | "month" | "year"
): Promise<ApiResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const endDate = new Date();
    const startDate = new Date(endDate);
    switch (period) {
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const topProducts = await db.stockMovement.groupBy({
      by: ["product_id"],
      where: {
        business_id: user.businessId,
        type: "OUT",
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });

    const productDetails = await db.product.findMany({
      where: {
        id: {
          in: topProducts.map((p) => p.product_id),
        },
      },
      include: {
        current_version: true,
      },
    });

    const result = topProducts.map((tp) => {
      const product = productDetails.find((p) => p.id === tp.product_id);
      return {
        id: tp.product_id,
        name: product?.name,
        quantity_sold: tp._sum.quantity,
        current_stock: product?.current_version?.stock,
      };
    });

    return createSuccessResponse(
      "Top selling products retrieved successfully",
      result
    );
  } catch (error) {
    console.error(error);
    return createErrorResponse(
      error instanceof Error
        ? error.message
        : "Error retrieving top selling products"
    );
  }
}
