import Crumbs from "@/components/crumbs";
import DataTable from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { fetchLogs, fetchLogsByType } from "@/server/query/logs/index";
import { logColumns } from "@/utils/columns/log";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const crumbsLinks = [{ label: "Dashboard", href: "/" }, { label: "Logs" }];
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
  const allLogs = await fetchLogs(date);
  const newProductLogs = await fetchLogsByType("NEW_PRODUCT", date);
  const newSupplierLogs = await fetchLogsByType("NEW_SUPPLIER", date);
  const supplierUpdateLogs = await fetchLogsByType("SUPPLIER_UPDATE", date);
  const productUpdateLogs = await fetchLogsByType("PRODUCT_UPDATE", date);

  if (
    !allLogs ||
    allLogs.status === "error" ||
    !allLogs.data ||
    !newProductLogs ||
    newProductLogs.status === "error" ||
    !newProductLogs.data ||
    !newSupplierLogs ||
    newSupplierLogs.status === "error" ||
    !newSupplierLogs.data ||
    !supplierUpdateLogs ||
    supplierUpdateLogs.status === "error" ||
    !supplierUpdateLogs.data ||
    !productUpdateLogs ||
    productUpdateLogs.status === "error" ||
    !productUpdateLogs.data
  )
    return null;

  return (
    <div className="space-y-8 mx-auto flex flex-col justify-center">
      <Crumbs crumbs={crumbsLinks} />
      <Tabs defaultValue="all">
        <div className="overflow-x-auto w-3/4 md:w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new_supplier">New Suppliers</TabsTrigger>
            <TabsTrigger value="new_product">New Products</TabsTrigger>
            <TabsTrigger value="product_update">Product Updates</TabsTrigger>
            <TabsTrigger value="supplier_update">Supplier Updates</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <div className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={logColumns}
              searchKey="product_name"
              data={allLogs.data}
              title="Logs"
              type="log"
            />
          </div>
        </TabsContent>

        <TabsContent value="new_supplier">
          <div className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={logColumns}
              searchKey="product_name"
              data={newSupplierLogs.data}
              title="New Supplier Logs"
              type="log"
            />
          </div>
        </TabsContent>

        <TabsContent value="new_product">
          <div className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={logColumns}
              searchKey="product_name"
              data={newProductLogs.data}
              title="New Product Logs"
              type="log"
            />
          </div>
        </TabsContent>

        <TabsContent value="product_update">
          <div className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={logColumns}
              searchKey="product_name"
              data={productUpdateLogs.data}
              title="Product Update Logs"
              type="log"
            />
          </div>
        </TabsContent>

        <TabsContent value="supplier_update">
          {" "}
          <div className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={logColumns}
              searchKey="product_name"
              data={supplierUpdateLogs.data}
              title="Supplier Update Logs"
              type="log"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
