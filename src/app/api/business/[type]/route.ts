import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";

// export const dynamic = "force-static";
// export const revalidate = 3600;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const type = (await params).type;
  if (type === "all") {
    try {
      const user = await getAuthenticatedUser();
      if (!user) return null;
      const businesses = await db.businessUser.findMany({
        where: {
          user_id: user.id,
          ...(user.businessId && {
            business_id: { not: user.businessId },
          }),
        },
        include: {
          business: true,
        },
      });
      return NextResponse.json(businesses, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  } else if (type === "active") {
    try {
      const user = await getAuthenticatedUser();
      if (!user) return NextResponse.json(null);
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
      return NextResponse.json(business, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Invalid type call" }, { status: 400 });
  }
}
