import Crumbs from "@/components/crumbs";
import DataTable from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchLowStockProducts,
  fetchOutStockProducts,
} from "@/server/query/products";
import React from "react";
import { productColumns } from "@/utils/columns/alert";

const page = async () => {
  const crumbsLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Stock Alerts" },
  ];

  const lowStockProducts = await fetchLowStockProducts();
  const outOfStockProducts = await fetchOutStockProducts();
  if (
    !lowStockProducts ||
    lowStockProducts.status === "error" ||
    !lowStockProducts.data ||
    !outOfStockProducts ||
    outOfStockProducts.status === "error" ||
    !outOfStockProducts.data
  )
    return null;
  return (
    <div className="space-y-8 flex flex-col justify-center">
      <Crumbs crumbs={crumbsLinks} />

      <Tabs defaultValue="lowStock">
        <div className="overflow-x-auto w-3/4 md:w-full">
          {" "}
          <TabsList>
            <TabsTrigger value="lowStock">Low Stock Items</TabsTrigger>
            <TabsTrigger value="outOfStock">Out of Stock</TabsTrigger>
          </TabsList>{" "}
        </div>

        <TabsContent value="lowStock">
          <div className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={productColumns}
              data={lowStockProducts.data}
              title="Low Stock Items"
              type="stock_alert"
            />
          </div>
        </TabsContent>

        <TabsContent value="outOfStock">
          <div className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={productColumns}
              data={outOfStockProducts.data}
              title="Out of Stock Items"
              type="stock_alert"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
