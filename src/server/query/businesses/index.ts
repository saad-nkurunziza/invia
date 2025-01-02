"use server";

import { UserBusinessPayload } from "@/components/navigation/business-switcher";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";

export const fetchActiveBusiness =
  async (): Promise<UserBusinessPayload | null> => {
    const user = await getAuthenticatedUser();
    if (!user) return null;
    const business = await db.businessUser.findUnique({
      where: {
        user_id_business_id: {
          user_id: user.id!,
          business_id: user.businessId!,
        },
      },
      include: {
        business: true,
      },
    });
    return business;
  };

export const fetchBusinesses = async (): Promise<
  UserBusinessPayload[] | null
> => {
  const user = await getAuthenticatedUser();
  if (!user) return null;
  const businesses = await db.businessUser.findMany({
    where: {
      user_id: user.id,
      business_id: { not: user.businessId },
    },
    include: {
      business: true,
    },
  });
  return businesses;
};

export const getBusinessDetails = async () => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return null;
    return await db.business.findUnique({
      where: {
        id: user.businessId,
        deleted_at: null,
      },
      include: {
        products: {
          where: { deleted_at: null },
          include: { current_version: true },
          take: 5,
        },
        suppliers: {
          where: { deleted_at: null },
          take: 5,
        },
        workers: {
          include: { user: true },
        },
        transactions: {
          take: 5,
          orderBy: { created_at: 'desc' },
        },
        logs: {
          take: 5,
          orderBy: { created_at: 'desc' },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};