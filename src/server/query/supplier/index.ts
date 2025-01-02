"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth } from "date-fns";

export async function fetchSuppliers(date?: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const whereClause: Prisma.SupplierWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const suppliers = await db.supplier.findMany({
      where: {
        business_id: user.businessId,
        deleted_at: null,
        ...whereClause,
      },
      orderBy: { updated_at: "desc" },
    });

    return {
      status: "success",
      msg: "Suppliers fetched successfully",
      data: suppliers,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching suppliers`,
    };
  }
}

export async function fetchSupplierById(supplierId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const supplier = await db.supplier.findUnique({
      where: {
        id: supplierId,
        business_id: user.businessId,
        deleted_at: null,
      },
      include: { products: true },
    });

    if (!supplier) {
      return {
        status: "error",
        msg: "Supplier not found",
      };
    }

    return {
      status: "success",
      msg: "Supplier fetched successfully",
      data: supplier,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching supplier`,
    };
  }
}

export async function fetchPopularSuppliers(date?: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const whereClause: Prisma.SupplierWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const suppliers = await db.supplier.findMany({
      where: {
        business_id: user.businessId,
        deleted_at: null,
        ...whereClause,
      },
      include: {
        products: {
          include: {
            versions: {
              select: {
                stock: true,
              },
            },
          },
        },
      },
    });

    suppliers.sort((a, b) => {
      const totalStockA = a.products.reduce(
        (sum, product) =>
          sum +
          product.versions.reduce((vSum, version) => vSum + version.stock, 0),
        0
      );
      const totalStockB = b.products.reduce(
        (sum, product) =>
          sum +
          product.versions.reduce((vSum, version) => vSum + version.stock, 0),
        0
      );
      return totalStockB - totalStockA;
    });

    return {
      status: "success",
      msg: "Suppliers fetched and sorted successfully",
      data: suppliers,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching and sorting suppliers`,
    };
  }
}

export async function fetchLatestSuppliers(date?: Date) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const whereClause: Prisma.SupplierWhereInput = date
      ? {
          created_at: {
            gte: startOfMonth(date),
            lt: endOfMonth(date),
          },
        }
      : {};

    const suppliers = await db.supplier.findMany({
      where: {
        business_id: user.businessId,
        deleted_at: null,
        ...whereClause,
      },
      orderBy: { updated_at: "desc" },
    });

    return {
      status: "success",
      msg: "Suppliers fetched successfully",
      data: suppliers,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching suppliers`,
    };
  }
}
