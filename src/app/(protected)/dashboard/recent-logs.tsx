import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchSliceLogs } from "@/server/query/logs";
import type { LogType } from "@prisma/client";
import { format } from "date-fns";

const getLogTypes = (type: LogType) => {
  switch (type) {
    case "NEW_SUPPLIER":
      return {
        color: "bg-green-50 text-green-800 ring-1 ring-inset ring-green-600/20",
        title: "New supplier",
      };
    case "NEW_PRODUCT":
      return {
        color: "bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-600/20",
        title: "New product",
      };
    case "NEW_PRODUCT_VERSION":
      return {
        color: "bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-600/20",
        title: "New product version",
      };
    case "SUPPLIER_UPDATE":
      return {
        color:
          "bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20",
        title: "Supplier update",
      };
    case "PRODUCT_UPDATE":
      return {
        color:
          "bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-600/20",
        title: "Product update",
      };
    case "PRODUCT_VERSION_UPDATE":
      return {
        color:
          "bg-purple-50 text-purple-800 ring-1 ring-inset ring-purple-600/20",
        title: "Product version update",
      };
    case "PRODUCT_DELETE":
      return {
        color: "bg-red-50 text-red-800 ring-1 ring-inset ring-red-600/20",
        title: "Product deleted",
      };
    case "PRODUCT_VERSION_DELETE":
      return {
        color: "bg-red-50 text-red-900 ring-1 ring-inset ring-red-600/20",
        title: "Product version deleted",
      };
    case "SUPPLIER_DELETE":
      return {
        color: "bg-pink-50 text-pink-800 ring-1 ring-inset ring-pink-600/20",
        title: "Supplier deleted",
      };
    case "STOCK_MOVEMENT":
      return {
        color:
          "bg-indigo-50 text-indigo-800 ring-1 ring-inset ring-indigo-600/20",
        title: "Stock movement",
      };
    case "USER_ACTION":
      return {
        color: "bg-gray-50 text-gray-800 ring-1 ring-inset ring-gray-600/20",
        title: "User action",
      };
    default:
      return {
        color: "bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20",
        title: "Unknown action",
      };
  }
};

const RecentLogs = async () => {
  const recent_logs = await fetchSliceLogs();
  if (!recent_logs || !recent_logs.data || recent_logs.data.length === 0)
    return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Logs</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Done at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent_logs.data.map((item) => {
              const { color, title } = getLogTypes(item.type);
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${color}`}
                      >
                        {title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {item.user?.name || "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {format(item.created_at, "d MMM")}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentLogs;
