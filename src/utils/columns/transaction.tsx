"use client";
import { ColumnDef } from "@tanstack/react-table";
import { TransactionTypes } from "../types";
import { DataTableColumnHeader } from "@/components/table/table-tools";

export const transactionColumns: ColumnDef<TransactionTypes>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const transactionType = type === "IN" ? "Purchase" : "Sale";
      return <div>{transactionType}</div>;
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
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number;
      return <div>{quantity}</div>;
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
