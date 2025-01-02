"use server";
import { UserFormSchemaZod } from "@/components/input/user-form";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";
import type { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addUser(user: User, businessId: string) {
  try {
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser) return { error: "User not authenticated" };
    if (authenticatedUser.role !== "ADMIN") return { error: "Unauthorized" };

    const existingUser = await db.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return {
        status: "error",
        msg: "User with this email already exists",
      };
    }

    const newUser = await db.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          ...user,
          businesses: {
            create: {
              business: { connect: { id: businessId } },
            },
          },
        },
        include: {
          businesses: true,
        },
      });

      if (!createdUser) {
        return {
          status: "error",
          msg: "Error creating user",
        };
      }

      await tx.log.create({
        data: {
          type: "USER_ACTION",
          user_id: authenticatedUser.id,
          business_id: businessId,
        },
      });

      revalidatePath("/", "layout");
      return {
        status: "success",
        msg: "User added successfully",
        data: createdUser,
      };
    });

    return newUser;
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error adding user `,
    };
  }
}

export async function editUser(
  userId: string,
  userData: z.infer<typeof UserFormSchemaZod>
) {
  try {
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser)
      return { status: "error", msg: "User not authenticated" };
    // if (authenticatedUser.role !== "ADMIN" && authenticatedUser.id !== userId)
    //   return { error: "Unauthorized" };

    const updatedUser = await db.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return {
          status: "error",
          msg: "No user found",
        };
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: userData,
      });

      if (!updatedUser) {
        return {
          status: "error",
          msg: "Failed to update user",
        };
      }

      await tx.log.create({
        data: {
          type: "USER_ACTION",
          user_id: authenticatedUser.id,
          business_id: authenticatedUser.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
      return {
        status: "success",
        msg: "User updated successfully",
        data: updatedUser,
      };
    });

    return updatedUser;
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Error updating user `,
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser)
      return { status: "error", msg: "User not authenticated" };
    if (authenticatedUser.role !== "ADMIN")
      return { status: "error", msg: "Unauthorized" };

    const result = await db.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { id: userId },
        include: { businesses: true },
      });

      if (!existingUser) {
        return {
          status: "error",
          msg: "No user found",
        };
      }

      const deletedUser = await tx.user.update({
        where: { id: userId },
        data: { deleted_at: new Date() },
      });

      await tx.businessUser.deleteMany({
        where: { user_id: userId },
      });

      await tx.log.create({
        data: {
          type: "USER_ACTION",
          user_id: authenticatedUser.id,
          business_id: authenticatedUser.businessId ?? "",
        },
      });

      revalidatePath("/", "layout");
      return {
        status: "success",
        msg: "User deleted successfully",
        data: deletedUser,
      };
    });

    return result;
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      msg: `Failed to delete user `,
    };
  }
}
