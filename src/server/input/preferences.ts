"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/utils/api-response";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/types/api";

export async function saveStockName(
  formData: FormData
): Promise<ApiResponse | undefined> {
  const stockName = formData.get("stock_name") as string;

  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      console.error("User not authenticated");
      return createErrorResponse("User not authenticated");
    }
    await db.$transaction(async (tx) => {
      await tx.preference.upsert({
        where: {
          key_business_id: {
            key: "stock_name",
            business_id: user.businessId ?? "",
          },
        },
        update: { value: stockName },
        create: {
          key: "stock_name",
          value: stockName,
          business: { connect: { id: user.businessId ?? "" } },
        },
      });

      // Log user action
      await tx.log.create({
        data: {
          type: "USER_ACTION",
          user_id: user.id,
          business_id: user.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
    });
  } catch (error) {
    console.error("Error saving stock name:", error);
    return createErrorResponse("Error saving stock name");
  }
}

export async function saveThresholdMargin(
  formData: FormData
): Promise<ApiResponse | undefined> {
  const thresholdMargin = formData.get("stock_name") as string;
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      console.error("User not authenticated");
      return createErrorResponse("User not authenticated");
    }

    await db.$transaction(async (tx) => {
      await tx.preference.upsert({
        where: {
          key_business_id: {
            key: "threshold_margin",
            business_id: user.businessId ?? "",
          },
        },
        update: {
          value: thresholdMargin,
        },
        create: {
          key: "threshold_margin",
          value: thresholdMargin,
          business: { connect: { id: user.businessId ?? "" } },
        },
      });

      await tx.log.create({
        data: {
          type: "USER_ACTION",
          user_id: user.id,
          business_id: user.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
    });
  } catch (error) {
    console.error(error);
    return createErrorResponse("Error saving threshold margin");
  }
}

export async function getPreferences(): Promise<ApiResponse | undefined> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return createErrorResponse("User not authenticated");

    const preferences = await db.preference.findMany({
      where: {
        business_id: user.businessId,
      },
    });

    return createSuccessResponse(
      "Preferences retrieved successfully",
      preferences
    );
  } catch (error) {
    console.error(error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Error retrieving preferences"
    );
  }
}
