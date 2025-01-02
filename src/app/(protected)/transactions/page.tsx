import Crumbs from "@/components/crumbs";
import DataTable from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import {
  fetchTransactions,
  fetchTransactionsByType,
} from "@/server/query/transactions/index";
import { transactionColumns } from "@/utils/columns/transaction";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const crumbsLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Transactions" },
  ];
  const time_range = searchParams.t as string;
  let date: Date | undefined;

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

  const allTransactions = await fetchTransactions(date);
  const purchaseTransactions = await fetchTransactionsByType("purchase", date);
  const saleTransactions = await fetchTransactionsByType("sale", date);

  if (
    !allTransactions ||
    allTransactions.status === "error" ||
    !allTransactions.data ||
    !purchaseTransactions ||
    purchaseTransactions.status === "error" ||
    !purchaseTransactions.data ||
    !saleTransactions ||
    saleTransactions.status === "error" ||
    !saleTransactions.data
  )
    return null;

  return (
    <div className="space-y-8 flex flex-col justify-center">
      <Crumbs crumbs={crumbsLinks} />
      <Tabs defaultValue="all">
        <div className="overflow-x-auto w-3/4 md:w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sale">Sale</TabsTrigger>
            <TabsTrigger value="purchase">Purchase</TabsTrigger>
          </TabsList>{" "}
        </div>

        <TabsContent value="all">
          <div className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={transactionColumns}
              searchKey="product_name"
              data={allTransactions.data}
              title="Transactions"
              type="transaction"
            />
          </div>
        </TabsContent>

        <TabsContent value="purchase">
          <div className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={transactionColumns}
              searchKey="product_name"
              data={purchaseTransactions.data}
              title="Purchase Transactions"
              type="transaction"
            />
          </div>
        </TabsContent>

        <TabsContent value="sale">
          <div className="grid flex-1 items-start gap-4 md:gap-8">
            <DataTable
              columns={transactionColumns}
              searchKey="product_name"
              data={saleTransactions.data}
              title="Sale Transactions"
              type="transaction"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
