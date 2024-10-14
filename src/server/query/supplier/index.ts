"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";

export async function fetchSuppliers() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const suppliers = await db.supplier.findMany({
      where: { business_id: user.businessId, deleted_at: null },
      orderBy: { created_at: "desc" },
    });

    return {
      status: "success",
      msg: "Suppliers fetched successfully",
      data: suppliers,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching suppliers: ${error.message}`,
      };
  }
}

export async function fetchSupplierById(supplierId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

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
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching supplier: ${error.message}`,
      };
  }
}

export async function fetchPopularSuppliers() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const suppliers = await db.supplier.findMany({
      where: { business_id: user.businessId, deleted_at: null },
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
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching and sorting suppliers: ${error.message}`,
      };
  }
}

export async function fetchLatestSuppliers() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const suppliers = await db.supplier.findMany({
      where: { business_id: user.businessId, deleted_at: null },
      orderBy: { updated_at: "desc" },
    });

    return {
      status: "success",
      msg: "Suppliers fetched successfully",
      data: suppliers,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching suppliers: ${error.message}`,
      };
  }
}
