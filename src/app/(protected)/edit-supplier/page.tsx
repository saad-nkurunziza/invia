import React from "react";
import { redirect } from "next/navigation";
import { fetchSupplierById } from "@/server/query/supplier";
import EditSupplierForm from "@/components/input/edit-supplier-form";
const page = async (
  props: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
  }
) => {
  const searchParams = await props.searchParams;
  const supplierId = searchParams.product as string;
  if (!supplierId) {
    redirect("/suppliers");
  }
  const supplier = await fetchSupplierById(supplierId);
  if (!supplier || !supplier.data) return;
  return (
    <main className="p-2 md:p-4 sm:px-6 sm:py-0">
      <EditSupplierForm supplier={supplier.data} />
    </main>
  );
};

export default page;
