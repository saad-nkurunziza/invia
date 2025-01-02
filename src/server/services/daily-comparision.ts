import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { startOfDay, subDays, endOfDay } from "date-fns";

export const stockComparedToLastDay = async (date: Date = new Date()) => {
  const startOfToday = startOfDay(date);
  const startOfYesterday = startOfDay(subDays(date, 1));
  const endOfYesterday = endOfDay(subDays(date, 1));

  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const [yesterdayPurchases, todayPurchases] = await Promise.all([
      db.stockMovement.findMany({
        select: {
          quantity: true,
          product: {
            include: { versions: { select: { buying_price: true } } },
          },
        },
        where: {
          type: "IN",
          created_at: { gte: startOfYesterday, lte: endOfYesterday },
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
          created_at: { gte: startOfToday },
          business_id: user.businessId,
        },
      }),
    ]);

    const totalPurchaseYesterday = yesterdayPurchases.reduce(
      (total, p) => total + p.quantity * +p.product.versions[0].buying_price,
      0
    );
    const totalPurchaseToday = todayPurchases.reduce(
      (total, p) => total + p.quantity * +p.product.versions[0].buying_price,
      0
    );

    return {
      currentDayStock: totalPurchaseToday,
      lastDayStock: totalPurchaseYesterday,
      difference: totalPurchaseToday - totalPurchaseYesterday,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error comparing stock `,
    };
  }
};

export const revenueComparedToLastDay = async (date: Date = new Date()) => {
  const startOfToday = startOfDay(date);
  const startOfYesterday = startOfDay(subDays(date, 1));
  const endOfYesterday = endOfDay(subDays(date, 1));

  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const [yesterdaySales, todaySales] = await Promise.all([
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
            gte: startOfYesterday,
            lte: endOfYesterday,
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
            gte: startOfToday,
          },
          business_id: user?.businessId,
        },
      }),
    ]);

    const totalSalesYesterday = yesterdaySales.reduce((total, sale) => {
      return total + sale.quantity * +sale.product.versions[0].selling_price;
    }, 0);
    const totalSalesToday = todaySales.reduce((total, sale) => {
      return total + sale.quantity * +sale.product.versions[0].selling_price;
    }, 0);
    return {
      currentDayRevenue: totalSalesToday,
      lastDayRevenue: totalSalesYesterday,
      difference: totalSalesToday - totalSalesYesterday,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error comparing stock `,
    };
  }
};

export const salesComparedToLastDay = async (date: Date = new Date()) => {
  const startOfToday = startOfDay(date);
  const startOfYesterday = startOfDay(subDays(date, 1));
  const endOfYesterday = endOfDay(subDays(date, 1));

  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const [currentDaySales, lastDaySales] = await Promise.all([
      db.stockMovement.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          type: "OUT",
          created_at: {
            gte: startOfToday,
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
            gte: startOfYesterday,
            lte: endOfYesterday,
          },
          business_id: user?.businessId,
        },
      }),
    ]);

    const currentDaySalesQty = currentDaySales._sum.quantity ?? 0;
    const lastDaySalesQty = lastDaySales._sum.quantity ?? 0;

    return {
      currentDaySales: currentDaySalesQty,
      lastDaySales: lastDaySalesQty,
      difference: currentDaySalesQty - lastDaySalesQty,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error comparing stock `,
    };
  }
};

export const profitsComparedToLastDay = async (date: Date = new Date()) => {
  const startOfToday = startOfDay(date);
  const startOfYesterday = startOfDay(subDays(date, 1));
  const endOfYesterday = endOfDay(subDays(date, 1));

  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const [yesterdaySales, yesterdayPurchases] = await Promise.all([
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
            gte: startOfYesterday,
            lte: endOfYesterday,
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
            gte: startOfYesterday,
            lte: endOfYesterday,
          },
          business_id: user?.businessId,
        },
      }),
    ]);

    const [todaySales, todayPurchases] = await Promise.all([
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
            gte: startOfToday,
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
            gte: startOfToday,
          },
          business_id: user?.businessId,
        },
      }),
    ]);

    const totalSalesYesterday = yesterdaySales.reduce((total, sale) => {
      return total + sale.quantity * +sale.product.versions[0].selling_price;
    }, 0);
    const totalPurchaseYesterday = yesterdayPurchases.reduce(
      (total, purchase) => {
        return (
          total + purchase.quantity * +purchase.product.versions[0].buying_price
        );
      },
      0
    );
    const totalSalesToday = todaySales.reduce((total, sale) => {
      return total + sale.quantity * +sale.product.versions[0].selling_price;
    }, 0);
    const totalPurchaseToday = todayPurchases.reduce((total, purchase) => {
      return (
        total + purchase.quantity * +purchase.product.versions[0].buying_price
      );
    }, 0);

    const profitYesterday = totalSalesYesterday - totalPurchaseYesterday;
    const profitToday = totalSalesToday - totalPurchaseToday;
    return {
      currentDayProfit: profitToday,
      lastDayProfit: profitYesterday,
      difference: profitToday - profitYesterday,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error comparing stock `,
    };
  }
};
