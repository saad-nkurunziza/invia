"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AuthResponse } from "@/auth-types";
import { z } from "zod";
import { OnboardingCreateSchema } from "@/components/onboarding/onboarding-create";
import { headers } from "next/headers";

export const create = async (
  values: z.infer<typeof OnboardingCreateSchema>
): Promise<AuthResponse> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  const {
    businessName,
    registrationNumber,
    address,
    businessEmail,
    businessPhone,
    isAdmin,
  } = values;

  try {
    await db.$transaction(async (tx) => {
      const newBusiness = await tx.business.create({
        data: {
          name: businessName,
          email: businessEmail,
          registration_number: registrationNumber,
          address: address,
          tel: businessPhone,
        },
      });

      await tx.businessUser.create({
        data: {
          business_id: newBusiness.id,
          user_id: session.user.id!,
        },
      });

      await tx.user.update({
        where: { id: session.user.id },
        data: {
          role: isAdmin ? "ADMIN" : "WORKER",
        },
      });
    });

    return { success: "Business created successfully" };
  } catch (error) {
    console.error("Error during business creation:", error);
    return { error: "Onboarding failed" };
  }
};
