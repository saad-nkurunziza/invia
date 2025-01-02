import DataTable from "@/components/ui/data-table";
import { fetchTransactions } from "@/server/query/transactions";
import { transactionColumns } from "@/utils/columns/transaction";
import React from "react";

const AnalyticTransactions = async ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  const date = new Date(year, month - 1, 1);
  const allTransactions = await fetchTransactions(date);
  if (
    !allTransactions ||
    allTransactions.status === "error" ||
    !allTransactions.data
  )
    return null;
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <DataTable
        columns={transactionColumns}
        data={allTransactions.data}
        title="Transactions"
        type="transaction"
        patch
      />
    </div>
  );
};

export default AnalyticTransactions;
