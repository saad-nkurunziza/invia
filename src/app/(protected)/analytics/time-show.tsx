import React from "react";
import { TimeRange } from "@/components/time-range";

const TimeShow = ({ month, year }: { month: number; year: number }) => {
  const monthName = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
  });
  return (
    <div className="flex items-center gap-4 space-y-0 py-5 flex-row">
      <h3 className="text-sm text-muted-foreground font-semibold">
        {`${monthName} - ${year}`} Report
      </h3>
      <TimeRange />
    </div>
  );
};

export default TimeShow;
