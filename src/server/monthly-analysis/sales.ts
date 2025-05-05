import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { startOfMonth, endOfMonth } from "date-fns";
import { unstable_cache } from "next/cache";

export const calculateMonthSalesValue = unstable_cache(
  async (date: Date) => {
    const startOfThisMonth = startOfMonth(date);
    const endOfThisMonth = endOfMonth(date);
    try {
      const user = await getAuthenticatedUser();
      if (!user) return { status: "error", msg: "User not authenticated" };

      const products = await db.stockMovement.findMany({
        where: {
          business_id: user.businessId,
          type: "OUT",
          created_at: {
            gte: startOfThisMonth,
            lt: endOfThisMonth,
          },
        },
        select: {
          quantity: true,
          product: {
            include: { versions: { select: { selling_price: true } } },
          },
        },
      });

      const salesValue = products.reduce((total, product) => {
        const sellingPrice = product.product.versions[0]?.selling_price;
        if (!sellingPrice) return total;
        return total + product.quantity * +sellingPrice;
      }, 0);

      return {
        status: "success",
        msg: "Purchase stock value calculated successfully",
        data: salesValue,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        msg: `Error calculating purchase stock value `,
      };
    }
  },
  ["calculate-month-sale-value"],
  { revalidate: 3600, tags: ["sale-values"] }
);

export const getSaleCount = unstable_cache(
  async (date: Date) => {
    const startOfThisMonth = startOfMonth(date);
    const endOfThisMonth = endOfMonth(date);

    try {
      const user = await getAuthenticatedUser();
      if (!user) return { status: "error", msg: "User not authenticated" };

      const purchaseCount = await db.stockMovement.count({
        where: {
          business_id: user.businessId,
          type: "OUT",
          created_at: {
            gte: startOfThisMonth,
            lt: endOfThisMonth,
          },
        },
      });

      return {
        status: "success",
        msg: "Purchase stock value calculated successfully",
        data: purchaseCount,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        msg: `Error calculating purchase stock value `,
      };
    }
  },
  ["get-sale-count"],
  { revalidate: 3600, tags: ["sale-counts"] }
);
