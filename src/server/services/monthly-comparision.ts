import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { startOfMonth, subMonths, endOfMonth } from "date-fns";

export const stockComparedToLastMonth = async (date: Date = new Date()) => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const startOfThisMonth = startOfMonth(date);
    const startOfLastMonth = startOfMonth(subMonths(date, 1));
    const endOfLastMonth = endOfMonth(subMonths(date, 1));

    const [lastMonthPurchases, thisMonthPurchases] = await Promise.all([
      db.stockMovement.findMany({
        select: {
          quantity: true,
          product: {
            include: { versions: { select: { buying_price: true } } },
          },
        },
        where: {
          type: "IN",
          created_at: { gte: startOfLastMonth, lte: endOfLastMonth },
          business_id: user.businessId,
        },
      }),
      db.stockMovement.findMany({
        select: {
          quantity: true,
          product: {
            include: { versions: { select: { buying_price: true } } },
          },
        },
        where: {
          type: "IN",
          created_at: { gte: startOfThisMonth },
          business_id: user.businessId,
        },
      }),
    ]);

    const totalPurchaseLastMonth = lastMonthPurchases.reduce(
      (total, p) => total + p.quantity * +p.product.versions[0].buying_price,
      0
    );
    const totalPurchaseThisMonth = thisMonthPurchases.reduce(
      (total, p) => total + p.quantity * +p.product.versions[0].buying_price,
      0
    );

    return {
      currentMonthStock: totalPurchaseThisMonth,
      lastMonthStock: totalPurchaseLastMonth,
      difference: totalPurchaseThisMonth - totalPurchaseLastMonth,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error comparing stock `,
    };
  }
};

export const revenueComparedToLastMonth = async (date = new Date()) => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const startOfThisMonth = startOfMonth(date);
    const startOfLastMonth = startOfMonth(subMonths(date, 1));
    const endOfLastMonth = endOfMonth(subMonths(date, 1));

    const [lastMonthSales, thisMonthSales] = await Promise.all([
      db.stockMovement.findMany({
        select: {
          quantity: true,
          product: {
            include: { versions: { select: { selling_price: true } } },
          },
        },
        where: {
          type: "OUT",
          created_at: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
          business_id: user?.businessId,
        },
      }),
      db.stockMovement.findMany({
        select: {
          quantity: true,
          product: {
            include: { versions: { select: { selling_price: true } } },
          },
        },
        where: {
          type: "OUT",
          created_at: {
            gte: startOfThisMonth,
          },
          business_id: user?.businessId,
        },
      }),
    ]);

    const totalSalesLastMonth = lastMonthSales.reduce((total, sale) => {
      return total + sale.quantity * +sale.product.versions[0].selling_price;
    }, 0);
    const totalSalesThisMonth = thisMonthSales.reduce((total, sale) => {
      return total + sale.quantity * +sale.product.versions[0].selling_price;
    }, 0);
    return {
      currentMonthRevenue: totalSalesThisMonth,
      lastMonthRevenue: totalSalesLastMonth,
      difference: totalSalesThisMonth - totalSalesLastMonth,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error comparing stock `,
    };
  }
};

export const salesComparedToLastMonth = async (date = new Date()) => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const startOfThisMonth = startOfMonth(date);
    const startOfLastMonth = startOfMonth(subMonths(date, 1));
    const endOfLastMonth = endOfMonth(subMonths(date, 1));

    const [currentMonthSales, lastMonthSales] = await Promise.all([
      db.stockMovement.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          type: "OUT",
          created_at: {
            gte: startOfThisMonth,
          },
          business_id: user?.businessId,
        },
      }),
      db.stockMovement.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          type: "OUT",
          created_at: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
          business_id: user?.businessId,
        },
      }),
    ]);

    const currentMonthSalesQty = currentMonthSales._sum.quantity ?? 0;
    const lastMonthSalesQty = lastMonthSales._sum.quantity ?? 0;

    return {
      currentMonthSales: currentMonthSalesQty,
      lastMonthSales: lastMonthSalesQty,
      difference: currentMonthSalesQty - lastMonthSalesQty,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error comparing stock `,
    };
  }
};

export const profitsComparedToLastMonth = async (date = new Date()) => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const startOfThisMonth = startOfMonth(date);
    const startOfLastMonth = startOfMonth(subMonths(date, 1));
    const endOfLastMonth = endOfMonth(subMonths(date, 1));

    const [lastMonthSales, lastMonthPurchases] = await Promise.all([
      db.stockMovement.findMany({
        select: {
          quantity: true,
          product: {
            include: { versions: { select: { selling_price: true } } },
          },
        },
        where: {
          type: "OUT",
          created_at: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
          business_id: user?.businessId,
        },
      }),
      db.stockMovement.findMany({
        select: {
          quantity: true,
          product: {
            include: { versions: { select: { buying_price: true } } },
          },
        },
        where: {
          type: "IN",
          created_at: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
          business_id: user?.businessId,
        },
      }),
    ]);

    const [thisMonthSales, thisMonthPurchases] = await Promise.all([
      db.stockMovement.findMany({
        select: {
          quantity: true,
          product: {
            include: { versions: { select: { selling_price: true } } },
          },
        },
        where: {
          type: "OUT",
          created_at: {
            gte: startOfThisMonth,
          },
          business_id: user?.businessId,
        },
      }),
      db.stockMovement.findMany({
        select: {
          quantity: true,
          product: {
            include: { versions: { select: { buying_price: true } } },
          },
        },
        where: {
          type: "IN",
          created_at: {
            gte: startOfThisMonth,
          },
          business_id: user?.businessId,
        },
      }),
    ]);

    const totalSalesLastMonth = lastMonthSales.reduce((total, sale) => {
      return total + sale.quantity * +sale.product.versions[0].selling_price;
    }, 0);
    const totalPurchaseLastMonth = lastMonthPurchases.reduce(
      (total, purchase) => {
        return (
          total + purchase.quantity * +purchase.product.versions[0].buying_price
        );
      },
      0
    );
    const totalSalesThisMonth = thisMonthSales.reduce((total, sale) => {
      return total + sale.quantity * +sale.product.versions[0].selling_price;
    }, 0);
    const totalPurchaseThisMonth = thisMonthPurchases.reduce(
      (total, purchase) => {
        return (
          total + purchase.quantity * +purchase.product.versions[0].buying_price
        );
      },
      0
    );

    const profitLastMonth = totalSalesLastMonth - totalPurchaseLastMonth;
    const profitThisMonth = totalSalesThisMonth - totalPurchaseThisMonth;
    return {
      currentMonthProfit: profitThisMonth,
      lastMonthProfit: profitLastMonth,
      difference: profitThisMonth - profitLastMonth,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error comparing stock `,
    };
  }
};
