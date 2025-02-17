"use server";

import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";

export async function addTask(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) return { status: "error", msg: "User not authenticated" };
  const text = formData.get("text") as string;
  const date = new Date(formData.get("date") as string);
  const category = formData.get("category") as string;
  const priority = formData.get("priority") as string;

  await db.task.create({
    data: {
      text,
      date,
      category,
      priority,
      businessUserBusiness_id: user.businessId!,
      businessUserUser_id: user.id!,
    },
  });
}
