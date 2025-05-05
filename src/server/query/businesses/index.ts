"use server";

import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import { unstable_cache } from "next/cache";

import { Prisma } from "@prisma/client";

export type UserBusinessPayload = Prisma.BusinessUserGetPayload<{
  include: {
    business: true;
  };
}>;

export const fetchBusinesses = unstable_cache(
  async (userId: string, currentBusinessId?: string) => {
    return db.businessUser.findMany({
      where: {
        user_id: userId,
        ...(currentBusinessId && {
          business_id: { not: currentBusinessId },
        }),
      },
      include: {
        business: true,
      },
    });
  },
  ["active-businesses"],
  { revalidate: 3600, tags: ["businesses"] }
);

export const fetchActiveBusiness = unstable_cache(
  async (userId: string, businessId: string) => {
    return db.businessUser.findUnique({
      where: {
        user_id_business_id: {
          user_id: userId,
          business_id: businessId,
        },
      },
      include: {
        business: true,
      },
    });
  },
  ["current-business"],
  { revalidate: 3600, tags: ["businesses"] }
);

export const getBusinessDetails = unstable_cache(
  async () => {
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
            orderBy: { created_at: "desc" },
          },
          logs: {
            take: 5,
            orderBy: { created_at: "desc" },
          },
        },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  ["business-details"],
  { revalidate: 3600, tags: ["businesses"] }
);
