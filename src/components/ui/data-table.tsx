"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DataTablePagination,
  DataTableSearchOptions,
  DataTableViewOptions,
} from "@/components/table/table-tools";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CardFooter,
  CardContent,
  Card,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { DataTableExportOptions } from "@/components/table/export-data";
import { TableTimeRange } from "@/components/table/time-range";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  type: string;
  patch?: boolean;
  searchKey?: string;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  title,
  type,
  patch = false,
  searchKey = "name",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Card className="w-full overflow-auto">
      <CardHeader className="flex flex-col gap-4 md:gap-6">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          <DataTableSearchOptions table={table} searchKey={searchKey} />
          {type !== "stock_alert" && !patch && (
            <TableTimeRange path={`${type}s`} />
          )}

          <div className="ml-auto flex gap-2">
            <DataTableViewOptions table={table} />
            <DataTableExportOptions table={table} title={title} />
            {(type === "product" || type === "supplier") && (
              <Button size="sm" className="h-7 gap-1" asChild>
                <Link href={`/add-${type}`}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only capitalize sm:whitespace-nowrap">
                    Add {type}
                  </span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <DataTablePagination table={table} />
      </CardFooter>
    </Card>
  );
}
