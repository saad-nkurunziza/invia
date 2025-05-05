import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/server/auth";
import {
  fetchActiveBusiness,
  fetchBusinesses,
} from "@/server/query/businesses/index";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const type = (await params).type;

  if (type === "active") {
    try {
      const user = await getAuthenticatedUser();
      if (!user || !user.businessId)
        return NextResponse.json(null, { status: 401 });

      const businesses = await fetchActiveBusiness(user.id, user.businessId);
      console.log({ businesses });
      return NextResponse.json(businesses, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  } else if (type === "all") {
    try {
      const user = await getAuthenticatedUser();
      if (!user || !user.businessId)
        return NextResponse.json(null, { status: 401 });

      const business = await fetchBusinesses(user.id, user.businessId);
      return NextResponse.json(business, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Invalid type call" }, { status: 400 });
  }
}
