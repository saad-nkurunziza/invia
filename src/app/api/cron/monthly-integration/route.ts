import { integrateMonthlyStockValue } from "@/server/input/analysis";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const preferredRegion = "auto";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const result = await integrateMonthlyStockValue();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cron job error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
