"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function fetchProducts(date?: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const whereClause: Prisma.ProductWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const products = await db.product.findMany({
      where: {
        business_id: user.businessId,
        deleted_at: null,
        ...whereClause,
      },
      orderBy: { updated_at: "desc" },
      include: { current_version: true, versions: true },
    });

    return {
      status: "success",
      msg: "Products fetched successfully",
      data: products,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching products `,
    };
  }
}

export const fetchProductsSWR = async (date?: Date) => {
  const response = await fetchProducts(date);

  if (response.status !== "success") {
    throw new Error(response.msg || "Failed to fetch products");
  }

  return response.data;
};

export async function fetchProductById(productId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const product = await db.product.findUnique({
      where: {
        id: productId,
        business_id: user.businessId,
        deleted_at: null,
      },
      include: { current_version: true, versions: true },
    });

    if (!product) {
      return {
        status: "error",
        msg: "Product not found",
      };
    }

    return {
      status: "success",
      msg: "Product fetched successfully",
      data: product,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching product `,
    };
  }
}

export async function fetchProductsExtended(date?: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const whereClause: Prisma.ProductWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const products = await db.product.findMany({
      where: {
        business_id: user.businessId,
        deleted_at: null,
        ...whereClause,
      },
      include: {
        current_version: true,
        supplier: true,
        versions: true,
        transactions: {
          orderBy: { created_at: "desc" },
          take: 5,
        },
        logs: {
          orderBy: { created_at: "desc" },
          take: 5,
        },
      },
      orderBy: { created_at: "desc" },
    });

    return {
      status: "success",
      msg: "Extended products fetched successfully",
      data: products,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching extended products `,
    };
  }
}

export async function fetchProductCategories(category: string, date?: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const whereClause: Prisma.ProductWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const categories = await db.product.findMany({
      where: {
        business_id: user.businessId,
        deleted_at: null,
        current_version: { category },
        ...whereClause,
      },
      include: { current_version: true },
    });

    return {
      status: "success",
      msg: "Product categories fetched successfully",
      data: categories,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching product categories `,
    };
  }
}

export async function fetchLowStockProducts(date?: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };
    const margin_value_const = await db.preference.findFirst({
      where: {
        key: "threshold_margin",
      },
    });

    const margin_value = Number(margin_value_const?.value) || 3;
    const whereClause: Prisma.ProductWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const lowStockProducts = await db.product.findMany({
      where: {
        business_id: user.businessId,
        deleted_at: null,
        current_version: {
          stock: { lte: margin_value },
        },
        ...whereClause,
      },
      include: { current_version: true, versions: true },
      orderBy: {
        current_version: {
          stock: "asc",
        },
      },
    });

    return {
      status: "success",
      msg: "Low stock products fetched successfully",
      data: lowStockProducts,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching low stock products `,
    };
  }
}

export async function fetchInStockProducts(date?: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };
    const whereClause: Prisma.ProductWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const lowStockProducts = await db.product.findMany({
      where: {
        business_id: user.businessId,
        deleted_at: null,
        current_version: {
          stock: { gt: 0 },
        },
        ...whereClause,
      },
      include: { current_version: true, versions: true },
      orderBy: {
        current_version: {
          stock: "asc",
        },
      },
    });

    return {
      status: "success",
      msg: "Low stock products fetched successfully",
      data: lowStockProducts,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching low stock products `,
    };
  }
}

export async function fetchOutStockProducts(date?: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };
    const whereClause: Prisma.ProductWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const lowStockProducts = await db.product.findMany({
      where: {
        business_id: user.businessId,
        deleted_at: null,
        current_version: {
          stock: { lte: 0 },
        },
        ...whereClause,
      },
      include: { current_version: true, versions: true },
      orderBy: {
        current_version: {
          stock: "asc",
        },
      },
    });

    return {
      status: "success",
      msg: "Low stock products fetched successfully",
      data: lowStockProducts,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching low stock products `,
    };
  }
}

export async function fetchProductStockHistory(productId: string, date?: Date) {
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

    const stockHistory = await db.stockMovement.findMany({
      where: {
        product_id: productId,
        business_id: user.businessId,
        ...whereClause,
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
      msg: "Product stock history fetched successfully",
      data: stockHistory,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching product stock history `,
    };
  }
}

export async function fetchProductLogHistory(productId: string, date?: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const whereClause: Prisma.LogWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const logHistory = await db.log.findMany({
      where: {
        product_id: productId,
        business_id: user.businessId,
        ...whereClause,
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
      msg: "Product log history fetched successfully",
      data: logHistory,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching product log history `,
    };
  }
}

export async function fetchProductsNearingExpiry(
  daysThreshold: number,
  date?: Date
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    const whereClause: Prisma.ProductWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const productsNearingExpiry = await db.product.findMany({
      where: {
        business_id: user.businessId,
        deleted_at: null,
        versions: {
          some: {
            expiry_date: {
              lte: thresholdDate,
              gt: new Date(),
            },
          },
        },
        ...whereClause,
      },
      include: { versions: true },
      orderBy: {
        updated_at: "desc",
      },
    });

    return {
      status: "success",
      msg: "Products nearing expiry fetched successfully",
      data: productsNearingExpiry,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching products nearing expiry `,
    };
  }
}

export async function fetchProductPerformanceComparison(productId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);

    const [currentMonthSales, lastMonthSales] = await Promise.all([
      db.stockMovement.aggregate({
        _sum: { quantity: true },
        where: {
          product_id: productId,
          business_id: user.businessId,
          type: "OUT",
          created_at: {
            gte: startOfMonth(currentMonth),
            lte: endOfMonth(currentMonth),
          },
        },
      }),
      db.stockMovement.aggregate({
        _sum: { quantity: true },
        where: {
          product_id: productId,
          business_id: user.businessId,
          type: "OUT",
          created_at: {
            gte: startOfMonth(lastMonth),
            lte: endOfMonth(lastMonth),
          },
        },
      }),
    ]);

    const product = await db.product.findUnique({
      where: { id: productId, deleted_at: null },
      include: { current_version: true },
    });

    return {
      status: "success",
      msg: "Product performance comparison fetched successfully",
      data: {
        product: product,
        currentMonthSales: currentMonthSales._sum.quantity || 0,
        lastMonthSales: lastMonthSales._sum.quantity || 0,
        percentageChange:
          (((currentMonthSales._sum.quantity || 0) -
            (lastMonthSales._sum.quantity || 0)) /
            (lastMonthSales._sum.quantity || 1)) *
          100,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching product performance comparison `,
    };
  }
}
