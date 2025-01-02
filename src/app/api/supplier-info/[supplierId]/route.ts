import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { supplierId } = await req.json();

  try {
    const supplier = await db.supplier.findFirst({
      where: {
        id: supplierId,
      },
      include: {
        business: true,
        logs: true,
        products: {
          include: {
            current_version: true,
          },
        },
        product_versions: true,
      },
    });

    if (supplier) {
      return NextResponse.json(supplier);
    } else {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
