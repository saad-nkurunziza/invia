import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { startOfMonth, endOfMonth } from "date-fns";
export async function calculateMonthPurchaseValue(date: Date) {
  const startOfThisMonth = startOfMonth(date);
  const endOfThisMonth = endOfMonth(date);
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const products = await db.stockMovement.findMany({
      where: {
        business_id: user.businessId,
        type: "IN",
        created_at: {
          gte: startOfThisMonth,
          lt: endOfThisMonth,
        },
      },
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
    console.error(error);
    return {
      status: "error",
      msg: `Error calculating purchase stock value `,
    };
  }
}

export async function getPurchaseCount(date: Date) {
  const startOfThisMonth = startOfMonth(date);
  const endOfThisMonth = endOfMonth(date);

  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const purchaseCount = await db.stockMovement.count({
      where: {
        business_id: user.businessId,
        type: "IN",
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
}
