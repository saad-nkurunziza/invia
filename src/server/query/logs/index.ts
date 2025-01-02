"use server";

import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import type { Log } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth } from "date-fns";

export async function fetchLogs(date?: Date) {
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

    const logs = await db.log.findMany({
      where: {
        business_id: user.businessId,
        ...whereClause,
      },
      orderBy: { created_at: "desc" },
      include: {
        user: true,
        product: true,
        supplier: true,
      },
    });

    return {
      status: "success",
      msg: "Logs fetched successfully",
      data: logs,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching logs `,
    };
  }
}

export async function fetchLogsByType(type: Log["type"], date?: Date) {
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
    const logs = await db.log.findMany({
      where: {
        type: type,
        business_id: user.businessId,
        ...whereClause,
      },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { name: true },
        },
        product: {
          select: { name: true },
        },
        supplier: {
          select: { name: true },
        },
      },
    });

    return {
      status: "success",
      msg: "Logs fetched successfully",
      data: logs,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching logs `,
    };
  }
}
