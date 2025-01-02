import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";

import { Prisma } from "@prisma/client";

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    accounts: true;
    transactions: true;
    logs: true;
  };
}>;
export async function fetchEmployees(): Promise<{
  status: string;
  msg: string;
  data?: UserWithRelations[];
}> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { status: "error", msg: "User not authenticated" };

    if (user.role !== "ADMIN") {
      return { status: "error", msg: "Access denied. Admin role required." };
    }

    const employees = await db.user.findMany({
      where: {
        businesses: {
          some: {
            business_id: user.businessId,
          },
        },
      },
      include: {
        accounts: true,
        transactions: true,
        logs: true,
      },
    });

    return {
      status: "success",
      msg: "Employees fetched successfully",
      data: employees,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error fetching employees`,
    };
  }
}
