import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Crumbs from "@/components/crumbs";
import DataTable from "@/components/ui/data-table";
import { fetchSuppliers } from "@/server/query/supplier";
import { supplierColumns } from "@/utils/columns/supplier";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const crumbsLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Suppliers" },
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
  const allSuppliers = await fetchSuppliers(date);
  if (!allSuppliers || allSuppliers.status === "error" || !allSuppliers.data)
    return null;
  return (
    <div className="space-y-8 flex flex-col justify-center">
      <Crumbs crumbs={crumbsLinks} />
      <Tabs defaultValue="all">
        <div className="overflow-x-auto w-3/4 md:w-full">
          {" "}
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>{" "}
        </div>
        <TabsContent value="all">
          <main className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={supplierColumns}
              data={allSuppliers.data}
              title="Suppliers"
              type="supplier"
            />
          </main>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
