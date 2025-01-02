import { DataTableSkeleton, StatSkeleton } from "@/components/SkeletonLoaders";
import React from "react";

const loading = () => {
  return (
    <div className="flex flex-col space-y-8">
      <StatSkeleton />
      <DataTableSkeleton />
    </div>
  );
};

export default loading;
