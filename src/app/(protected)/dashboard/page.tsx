import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";

const page = async () => {
  const user = await auth();
  const ext = await db.user.findFirst({
    where: {
      id: user?.user.id,
    },
  });
  return <div>User: {JSON.stringify(ext)}</div>;
};

export default page;
