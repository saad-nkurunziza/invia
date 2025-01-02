import CreateProduct from "@/components/input/create-product-form";
import { fetchPreferences } from "@/server/query/preference";
import { fetchSuppliers } from "@/server/query/supplier";
import React from "react";

const page = async () => {
  const suppliers = await fetchSuppliers();
  const preferences = await fetchPreferences();

  if (
    !suppliers ||
    suppliers.status === "error" ||
    !preferences ||
    preferences.status === "error" ||
    !preferences.data ||
    !suppliers.data
  )
    return null;

  const initial_threshold_margin = preferences.data.find(
    (p) => p.key === "threshold_margin"
  )?.value;

  const threshold_margin = Number(initial_threshold_margin) || 3;
  return (
    <main className="p-2 md:p-4 sm:px-6 sm:py-0">
      <CreateProduct
        suppliers={suppliers.data}
        initial_threshold_margin={threshold_margin}
      />
    </main>
  );
};

export default page;
