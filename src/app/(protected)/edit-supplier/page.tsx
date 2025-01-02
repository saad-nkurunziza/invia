import React from "react";
import { fetchSupplierById } from "@/actions/query";
import EditSupplier from "./edit-supplier";
import { redirect } from "next/navigation";
const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const supplierId = searchParams.product as string;
  if (!supplierId) {
    redirect("/suppliers");
  }
  const supplier = await fetchSupplierById(supplierId);
  if (!supplier) return;
  return (
    <main className="p-2 md:p-4 sm:px-6 sm:py-0">
      <EditSupplier supplier={supplier} />
    </main>
  );
};

export default page;
