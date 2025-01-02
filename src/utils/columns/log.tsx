"use client";
import { ColumnDef } from "@tanstack/react-table";
import { LogTypes } from "../types";
import { DataTableColumnHeader } from "@/components/table/table-tools";

export const logColumns: ColumnDef<LogTypes>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Log Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const formattedString = type.split("_").join(" ");
      return <div className="capitalize">{formattedString}</div>;
    },
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return <div>{user?.name || "N/A"}</div>;
    },
  },
  {
    accessorKey: "product.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const product = row.original.product;
      return <div>{product?.name || "N/A"}</div>;
    },
  },
  {
    accessorKey: "supplier.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => {
      const supplier = row.original.supplier;
      return <div>{supplier?.name || "N/A"}</div>;
    },
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
];
