"use client";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/table/table-tools";
import { Supplier } from "@prisma/client";

export const supplierColumns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "tel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tel" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("tel")}</div>;
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("address") || "N/A"}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("email")}</div>;
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
