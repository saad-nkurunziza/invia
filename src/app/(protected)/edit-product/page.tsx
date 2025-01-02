import React from "react";
import { redirect } from "next/navigation";
import { fetchProductById } from "@/server/query/products";
import { fetchSuppliers } from "@/server/query/supplier";
import EditProductForm from "@/components/input/edit-product-form";

const page = async (
  props: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
  }
) => {
  const searchParams = await props.searchParams;
  const productId = searchParams.product as string;
  if (!productId) {
    redirect("/products");
  }

  const product = await fetchProductById(productId);
  const suppliers = await fetchSuppliers();

  if (!product || !suppliers || !product.data || !suppliers.data) return;

  return (
    <main className="p-2 md:p-4 sm:px-6 sm:py-0">
      <EditProductForm product={product.data} suppliers={suppliers.data} />
    </main>
  );
};

export default page;
