"use server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { revalidatePath } from "next/cache";

export async function saveStockName(stockName: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const result = await db.$transaction(async (tx) => {
      const updatedSetting = await tx.preferences.upsert({
        where: {
          key_business_id: {
            key: "stock_name",
            business_id: user.businessId ?? "",
          },
        },
        update: {
          value: stockName,
        },
        create: {
          key: "stock_name",
          value: stockName,
          business: { connect: { id: user.businessId ?? "" } },
        },
      });

      if (!updatedSetting) {
        return {
          status: "error",
          msg: "Error saving stock name",
        };
      }

      await tx.log.create({
        data: {
          type: "USER_ACTION",
          user_id: user.id,
          business_id: user.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
      return {
        status: "success",
        msg: "Stock name saved successfully",
        data: updatedSetting,
      };
    });

    return result;
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error saving stock name: ${error.message}`,
      };
  }
}

export async function saveThresholdMargin(thresholdMargin: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const result = await db.$transaction(async (tx) => {
      const updatedSetting = await tx.preferences.upsert({
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

      if (!updatedSetting) {
        return {
          status: "error",
          msg: "Error saving threshold margin",
        };
      }

      await tx.log.create({
        data: {
          type: "USER_ACTION",
          user_id: user.id,
          business_id: user.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
      return {
        status: "success",
        msg: "Threshold margin saved successfully",
        data: updatedSetting,
      };
    });

    return result;
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error saving threshold margin: ${error.message}`,
      };
  }
}

export async function getPreferences() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { error: "User not authenticated" };

    const preferences = await db.preferences.findMany({
      where: {
        business_id: user.businessId,
      },
    });

    return {
      status: "success",
      msg: "Preferences retrieved successfully",
      data: preferences,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        status: "error",
        msg: `Error retrieving preferences: ${error.message}`,
      };
  }
}
