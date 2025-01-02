import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import type { Preference } from "@prisma/client";
export async function fetchPreferences(): Promise<{
  status: string;
  msg: string;
  data?: Preference[];
}> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    const preferences = await db.preference.findMany({
      where: { business_id: user.businessId },
    });

    return {
      status: "success",
      msg: "Preferences fetched successfully",
      data: preferences,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching preferences `,
    };
  }
}
