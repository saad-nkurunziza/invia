"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AuthResponse } from "@/types";
import { z } from "zod";
import { OnboardingCreateSchema } from "@/components/onboarding/onboarding-create";

export const create = async (
  values: z.infer<typeof OnboardingCreateSchema>
): Promise<AuthResponse> => {
  try {
    const session = await auth();
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
    const newBusiness = await db.business.create({
      data: {
        name: businessName,
        email: businessEmail,
        registration_number: registrationNumber,
        address: address,
        tel: businessPhone,
        workers: {
          connect: { id: session.user.id },
        },
      },
    });

    await db.user.update({
      where: { id: session.user.id },
      data: {
        businesses: { connect: { id: newBusiness.id } },
        role: isAdmin ? "ADMIN" : "WORKER",
      },
    });

    return { success: "Business created successfully" };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { error: "Onboarding failed" };
  }
};
