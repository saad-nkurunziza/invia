"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";

export async function integrateMonthlyStockValue() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const result = await db.$transaction(async (tx) => {
      const existingEntry = await tx.analysisStats.findFirst({
        where: {
          key: "monthly_stock_value",
          created_at: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1),
          },
          business_id: user.businessId,
        },
      });

      if (existingEntry) {
        return {
          status: "error",
          msg: "Monthly stock value already integrated for this month",
        };
      }

      const stockValue = await tx.product.findMany({
        where: {
          business_id: user.businessId,
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
        if (product.current_version) {
          return (
            total +
            product.current_version.stock *
              Number(product.current_version.buying_price)
          );
        }
        return total;
      }, 0);

      const createdEntry = await tx.analysisStats.create({
        data: {
          key: "monthly_stock_value",
          value: totalValue,
          created_at: new Date(year, month - 1, 1),
          business: { connect: { id: user.businessId } },
        },
      });

      await tx.log.create({
        data: {
          type: "USER_ACTION",
          user_id: user.id,
          business_id: user.businessId ?? "",
        },
      });
      return {
        status: "success",
        msg: "Monthly stock value integrated successfully",
        data: createdEntry,
      };
    });

    return result;
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error integrating monthly stock value `,
    };
  }
}

export async function getMonthlyStockValues(months: number) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - months);

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

    return {
      status: "success",
      msg: "Monthly stock values retrieved successfully",
      data: stockValues,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error retrieving monthly stock values `,
    };
  }
}

export async function getTopSellingProducts(
  limit: number,
  period: "week" | "month" | "year"
) {
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

    return {
      status: "success",
      msg: "Top selling products retrieved successfully",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error retrieving top selling products `,
    };
  }
}
