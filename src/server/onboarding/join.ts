"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { OnboardingJoinSchema } from "@/components/onboarding/onboarding-join";
import { headers } from "next/headers";

export const join = async (
  values: z.infer<typeof OnboardingJoinSchema>
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user || !session.user.id) {
      return { error: "Unauthorized" };
    }

    const { businessId } = values;

    const existingBusiness = await db.business.findUnique({
      where: { id: businessId },
    });

    if (!existingBusiness) {
      return { error: "Business not found" };
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        businesses: {
          connect: {
            user_id_business_id: {
              user_id: session.user.id,
              business_id: businessId,
            },
          },
        },
      },
    });
    return { success: "Joined business successfully" };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { error: "Onboarding failed" };
  }
};
