import DataTable from "@/components/ui/data-table";
import { fetchLogs } from "@/server/query/logs";
import { logColumns } from "@/utils/columns/log";

import React from "react";

const AnalyticLogs = async ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  const date = new Date(year, month - 1, 1);
  const allLogs = await fetchLogs(date);
  if (!allLogs || allLogs.status === "error" || !allLogs.data) return null;

  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <DataTable
        columns={logColumns}
        data={allLogs.data}
        title="Logs"
        type="log"
        patch
      />
    </div>
  );
};

export default AnalyticLogs;
