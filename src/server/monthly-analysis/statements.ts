import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { startOfMonth, endOfMonth, addMonths } from "date-fns";

export async function getMostSoldProducts(date: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const startOfThisMonth = startOfMonth(date);
    const endOfThisMonth = endOfMonth(date);

    const mostSoldProducts = await db.stockMovement.groupBy({
      by: ["product_id"],
      where: {
        business_id: user.businessId,
        type: "OUT",
        created_at: {
          gte: startOfThisMonth,
          lt: endOfThisMonth,
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
      take: 4,
    });

    if (!mostSoldProducts.length || !mostSoldProducts[0].product_id) {
      return {
        status: "success",
        msg: "No product data available",
        data: {
          mostSoldProducts: [
            {
              productName: "No Product Data Available",
              quantity: 0,
            },
          ],
        },
      };
    }

    const products = await Promise.all(
      mostSoldProducts.map(async (product) => {
        const productDetails = await db.product.findUnique({
          where: { id: product.product_id },
          select: { name: true },
        });
        return {
          productName: productDetails?.name || "Unknown Product",
          quantity: product._sum.quantity || 0,
        };
      })
    );

    return {
      status: "success",
      msg: "Most sold products retrieved successfully",
      data: products,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: "Error calculating most sold products",
    };
  }
}

export async function getLeastSoldProduct(date: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const startOfThisMonth = startOfMonth(date);
    const endOfThisMonth = endOfMonth(date);

    const leastSoldProduct = await db.stockMovement.groupBy({
      by: ["product_id"],
      where: {
        business_id: user.businessId,
        type: "OUT",
        created_at: {
          gte: startOfThisMonth,
          lt: endOfThisMonth,
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "asc",
        },
      },
      take: 1,
    });
    if (leastSoldProduct.length === 0 || !leastSoldProduct[0].product_id) {
      return {
        productName: "No Product Data Available",
        quantity: 0,
      };
    }
    const product = await db.product.findUnique({
      where: {
        id: leastSoldProduct[0].product_id,
      },
      select: {
        name: true,
      },
    });

    return {
      status: "success",
      msg: "Purchase stock value calculated successfully",
      data: {
        leastSoldProduct: {
          productName: product?.name || "Unknown Product",
          qty: leastSoldProduct[0]._sum.quantity || 0,
        },
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error calculating purchase stock value `,
    };
  }
}

export async function getOpeningClosingStockValues(date: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const startOfThisMonth = startOfMonth(date);
    const endOfNextMonth = startOfMonth(addMonths(date, 1));

    const openingValue = await db.analysisStats.findUnique({
      where: {
        key_business_id_created_at: {
          key: "monthly_stock_value",
          business_id: user.businessId!,
          created_at: startOfThisMonth,
        },
      },
      select: {
        value: true,
      },
    });
    const closingValue = await db.analysisStats.findUnique({
      where: {
        key_business_id_created_at: {
          key: "monthly_stock_value",
          business_id: user.businessId!,
          created_at: endOfNextMonth,
        },
      },
      select: {
        value: true,
      },
    });

    return {
      status: "success",
      msg: "Purchase stock value calculated successfully",
      data: {
        openingValue: openingValue?.value ? openingValue?.value : 0,
        closingValue: closingValue?.value ? closingValue?.value : 0,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error calculating purchase stock value `,
    };
  }
}
export async function fetchMostSoldProductsThisMonth() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

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
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching most sold products `,
    };
  }
}

export async function fetchLeastSoldProductsThisMonth() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

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
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching least sold products `,
    };
  }
}
