"use client";
import { DataTableColumnHeader } from "@/components/table/table-tools";
import { ProductVersion } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ProductTypes } from "../types";
import { format } from "date-fns";

export const productColumns: ColumnDef<ProductTypes>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
  },
  {
    accessorKey: "current_version.buying_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Buying price" />
    ),
  },
  {
    accessorKey: "current_version.selling_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Selling price" />
    ),
  },
  {
    accessorKey: "current_version.stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;
      return <div>{format(date, "d MMM")}</div>;
    },
  },
  {
    accessorKey: "versions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Versions" />
    ),
    cell: ({ row }) => {
      const versions = row.getValue("versions") as ProductVersion[];
      return <div>{versions.length}</div>;
    },
  },
];
