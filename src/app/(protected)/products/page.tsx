import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Crumbs from "@/components/crumbs";
import DataTable from "@/components/ui/data-table";
import { productColumns } from "@/utils/columns/product";
import {
  fetchInStockProducts,
  fetchOutStockProducts,
  fetchProducts,
} from "@/server/query/products";

const page = async (props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const crumbsLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Products" },
  ];
  const time_range = searchParams.t as string;
  let date: Date = new Date();

  if (time_range) {
    const timeRange = Number(time_range);
    const currentDate = new Date();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();

    month -= timeRange;

    if (month < 0) {
      year -= 1;
      month += 12;
    }

    month += 1;
    date = new Date(year, month - 1, 1);
  }
  const allProducts = await fetchProducts(date);
  // const belowThresholdProducts = await fetchLowStockProducts(date);
  const inStockProducts = await fetchInStockProducts(date);
  const outOfStockProducts = await fetchOutStockProducts(date);

  if (
    !allProducts ||
    allProducts.status === "error" ||
    !allProducts.data ||
    // !belowThresholdProducts ||
    // belowThresholdProducts.status === "error" ||
    // !belowThresholdProducts.data ||
    !inStockProducts ||
    inStockProducts.status === "error" ||
    !inStockProducts.data ||
    !outOfStockProducts ||
    outOfStockProducts.status === "error" ||
    !outOfStockProducts.data
  )
    return null;
  return (
    <div className="space-y-8 flex flex-col justify-center">
      <Crumbs crumbs={crumbsLinks} />
      <Tabs defaultValue="all">
        <div className="overflow-x-auto w-3/4 md:w-full">
          {" "}
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {/* <TabsTrigger value="below_threshold">Below threshold</TabsTrigger> */}
            <TabsTrigger value="in_stock">In Stock</TabsTrigger>
            <TabsTrigger value="out_of_stock">Out of Stock</TabsTrigger>
            {/* <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger> */}
          </TabsList>{" "}
        </div>
        <TabsContent value="all">
          <main className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={productColumns}
              data={allProducts.data}
              title="All Products"
              type="product"
            />
          </main>
        </TabsContent>
        {/* <TabsContent value="below_threshold">
          <main className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={productColumns}
              data={belowThresholdProducts.data}
              title="Products Below Threshold"
              type="product"
            />
          </main>
        </TabsContent> */}
        <TabsContent value="in_stock">
          <main className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={productColumns}
              data={inStockProducts.data}
              title="In-stock Products"
              type="product"
            />
          </main>
        </TabsContent>
        <TabsContent value="out_of_stock">
          <main className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={productColumns}
              data={outOfStockProducts.data}
              title="Out-of-stock Products"
              type="product"
            />
          </main>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
