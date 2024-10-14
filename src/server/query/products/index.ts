"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function fetchProducts() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const products = await db.product.findMany({
      where: { business_id: user.businessId, deleted_at: null },
      orderBy: { updated_at: "desc" },
      include: { current_version: true, versions: true },
    });

    return {
      status: "success",
      msg: "Products fetched successfully",
      data: products,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching products: ${error.message}`,
      };
  }
}

export async function fetchProductById(productId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

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
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching product: ${error.message}`,
      };
  }
}

export async function fetchProductsExtended() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const products = await db.product.findMany({
      where: { business_id: user.businessId, deleted_at: null },
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
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching extended products: ${error.message}`,
      };
  }
}

export async function fetchProductCategories(category: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const categories = await db.product.findMany({
      where: {
        business_id: user.businessId,
        deleted_at: null,
        current_version: { category },
      },
      include: { current_version: true },
    });

    return {
      status: "success",
      msg: "Product categories fetched successfully",
      data: categories,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching product categories: ${error.message}`,
      };
  }
}

export async function fetchLowStockProducts(threshold: number) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const lowStockProducts = await db.product.findMany({
      where: {
        business_id: user.businessId,
        deleted_at: null,
        current_version: {
          stock: { lte: threshold },
        },
      },
      include: { current_version: true },
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
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching low stock products: ${error.message}`,
      };
  }
}

export async function fetchProductStockHistory(productId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const stockHistory = await db.stockMovement.findMany({
      where: {
        product_id: productId,
        business_id: user.businessId,
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
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching product stock history: ${error.message}`,
      };
  }
}

export async function fetchProductLogHistory(productId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const logHistory = await db.log.findMany({
      where: {
        product_id: productId,
        business_id: user.businessId,
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
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching product log history: ${error.message}`,
      };
  }
}

export async function fetchMostSoldThisMonth() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());

    const mostSoldProducts = await db.stockMovement.groupBy({
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
      take: 5,
    });

    const productDetails = await db.product.findMany({
      where: {
        id: {
          in: mostSoldProducts.map((p) => p.product_id),
        },
        deleted_at: null,
      },
      include: {
        current_version: true,
      },
    });

    const result = mostSoldProducts.map((mp) => {
      const product = productDetails.find((p) => p.id === mp.product_id);
      return {
        id: mp.product_id,
        name: product?.name,
        quantity_sold: mp._sum.quantity,
        current_stock: product?.current_version?.stock,
      };
    });

    return {
      status: "success",
      msg: "Most sold products this month fetched successfully",
      data: result,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching most sold products: ${error.message}`,
      };
  }
}

export async function fetchLeastSoldThisMonth() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());

    const allProducts = await db.product.findMany({
      where: { business_id: user.businessId, deleted_at: null },
      include: { current_version: true },
    });

    const salesData = await db.stockMovement.groupBy({
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
    });

    const result = allProducts.map((product) => {
      const sales = salesData.find((sd) => sd.product_id === product.id);
      return {
        id: product.id,
        name: product.name,
        quantity_sold: sales ? sales._sum.quantity : 0,
        current_stock: product.current_version?.stock,
      };
    });

    result.sort((a, b) => (a.quantity_sold ?? 0) - (b.quantity_sold ?? 0));
    const leastSold = result.slice(0, 5);

    return {
      status: "success",
      msg: "Least sold products this month fetched successfully",
      data: leastSold,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching least sold products: ${error.message}`,
      };
  }
}

export async function fetchProductsNearingExpiry(daysThreshold: number) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

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
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching products nearing expiry: ${error.message}`,
      };
  }
}

export async function fetchProductPerformanceComparison(productId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

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
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching product performance comparison: ${error.message}`,
      };
  }
}
