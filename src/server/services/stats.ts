"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";

export async function productCount() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const count = await db.product.count({
      where: { business_id: user.businessId, deleted_at: null },
    });

    return {
      status: "success",
      msg: "Product count retrieved successfully",
      data: count,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error retrieving product count `,
    };
  }
}

export async function totalStock() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const tStock = await db.productVersion.aggregate({
      _sum: { stock: true },
      where: { product: { business_id: user.businessId } },
    });

    return {
      status: "success",
      msg: "Total stock retrieved successfully",
      data: tStock._sum.stock || 0,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error retrieving total stock `,
    };
  }
}
export async function lowStockCount() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const tStock = await db.productVersion.findMany({
      where: { product: { business_id: user.businessId }, stock: { lte: 0 } },
      select: { id: true },
    });

    return {
      status: "success",
      msg: "Total stock retrieved successfully",
      data: tStock.length || 0,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error retrieving total stock `,
    };
  }
}

export async function supplierCount() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const count = await db.supplier.count({
      where: { business_id: user.businessId, deleted_at: null },
    });

    return {
      status: "success",
      msg: "Supplier count retrieved successfully",
      data: count,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error retrieving supplier count `,
    };
  }
}

export async function transactionsCount() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const count = await db.stockMovement.count({
      where: { business_id: user.businessId },
    });

    return {
      status: "success",
      msg: "Transactions count retrieved successfully",
      data: count,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error retrieving transactions count `,
    };
  }
}

export async function totalPurchase() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const total = await db.stockMovement.aggregate({
      _sum: { quantity: true },
      where: {
        type: "IN",
        business_id: user.businessId,
      },
    });

    return {
      status: "success",
      msg: "Total purchase retrieved successfully",
      data: total._sum.quantity || 0,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error retrieving total purchase `,
    };
  }
}

export async function totalSale() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const total = await db.stockMovement.aggregate({
      _sum: { quantity: true },
      where: {
        type: "OUT",
        business_id: user.businessId,
      },
    });

    return {
      status: "success",
      msg: "Total sale retrieved successfully",
      data: total._sum.quantity || 0,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error retrieving total sale `,
    };
  }
}

export const marketCap = async () => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const products = await db.product.findMany({
      where: { business_id: user.businessId },
      select: {
        current_version: {
          select: {
            stock: true,
            selling_price: true,
          },
        },
      },
    });

    const marketCapValue = products.reduce((total, product) => {
      const stock = product.current_version?.stock || 0;
      const selling_price = product.current_version?.selling_price || 0;
      return total + stock * +selling_price;
    }, 0);

    return {
      status: "success",
      msg: "Market cap retrieved successfully",
      data: marketCapValue,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error retrieving total sale `,
    };
  }
};
