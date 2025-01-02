import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";

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

export const getAllUserInfo = async () => {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return null;
    return await db.user.findUnique({
      where: {
        id: user.id,
        deleted_at: null,
      },
      include: {
        businesses: {
          include: {
            business: true,
          },
        },
        transactions: {
          take: 5,
          orderBy: {
            created_at: "desc",
          },
        },
        logs: {
          take: 5,
          orderBy: {
            created_at: "desc",
          },
        },
        accounts: true,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};
