"use client";
import { DataTableColumnHeader } from "@/components/table/table-tools";
import { ProductVersion } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ProductTypes } from "../types";

export const productColumns: ColumnDef<ProductTypes>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
  },
  {
    accessorKey: "current_version.price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("current_version.price") as number;
      return <div>${price.toFixed(2)}</div>;
    },
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
      return <div>{date.toLocaleDateString()}</div>;
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
