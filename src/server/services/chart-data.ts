import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";

export const getSalesStatistics = async () => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const recentSales = await db.stockMovement.findMany({
      where: {
        type: "OUT",
        business_id: user.businessId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 30,
      select: {
        created_at: true,
        quantity: true,
        product: {
          select: {
            versions: {
              select: {
                selling_price: true,
                name: true,
              },
            },
          },
        },
      },
    });
    const result = recentSales.map((sale) => ({
      date: sale.created_at.toISOString().split("T")[0],
      value: sale.quantity * +sale.product.versions[0].selling_price,
      name: sale.product.versions[0].name,
    }));
    return {
      status: "success",
      msg: "Supplier added successfully",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error comparing stock `,
    };
  }
};

export const getPurchaseStatistics = async () => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const recentPurchases = await db.stockMovement.findMany({
      where: {
        type: "IN",
        business_id: user.businessId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 30,
      select: {
        created_at: true,
        quantity: true,
        product: {
          select: {
            versions: {
              select: {
                buying_price: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const result = recentPurchases.map((purchase) => ({
      date: purchase.created_at.toISOString().split("T")[0],
      value: purchase.quantity * +purchase.product.versions[0].buying_price,
      name: purchase.product.versions[0].name,
    }));
    return {
      status: "success",
      msg: "Supplier added successfully",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error comparing stock `,
    };
  }
};
