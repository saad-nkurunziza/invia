"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { Log } from "@prisma/client";

export async function fetchLogs(limit: number = 50, offset: number = 0) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const logs = await db.log.findMany({
      where: { business_id: user.businessId },
      orderBy: { created_at: "desc" },
      take: limit,
      skip: offset,
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
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching logs: ${error.message}`,
      };
  }
}

export async function fetchLogsByType(type: Log["type"]) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const logs = await db.log.findMany({
      where: {
        type: type,
        business_id: user.businessId,
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
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error fetching logs: ${error.message}`,
      };
  }
}
