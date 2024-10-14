import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  return await db.user.findUnique({
    where: {
      email,
      deleted_at: null,
    },
    include: {
      businesses: true,
    },
  });
};
export const getUserById = async (id: string) => {
  return await db.user.findUnique({
    where: {
      id,
      deleted_at: null,
    },
    include: {
      businesses: true,
    },
  });
};
