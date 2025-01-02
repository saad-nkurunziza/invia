import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { productId } = await req.json();

  try {
    const product = await db.product.findFirst({
      where: {
        id: productId,
      },
      include: {
        current_version: true,
        business: true,
        logs: true,
        supplier: true,
        transactions: true,
        versions: true,
      },
    });

    if (product) {
      return NextResponse.json(product);
    } else {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
