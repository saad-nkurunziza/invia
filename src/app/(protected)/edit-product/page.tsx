import React from "react";
import EditProduct from "./edit-product";
import { redirect } from "next/navigation";
import { fetchProductById } from "@/server/query/products";
import { fetchSuppliers } from "@/server/query/supplier";
const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const productId = searchParams.product as string;
  if (!productId) {
    redirect("/products");
  }
  const product = await fetchProductById(productId);
  const suppliers = await fetchSuppliers();
  if (!product || !suppliers) return;
  return (
    <main className="p-2 md:p-4 sm:px-6 sm:py-0">
      <EditProduct product={product} suppliers={suppliers} />
    </main>
  );
};

export default page;
