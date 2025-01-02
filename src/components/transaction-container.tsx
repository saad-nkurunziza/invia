import React from "react";
import {
  DrawerDialog,
  // DrawerDialogClose,
  DrawerDialogContent,
  DrawerDialogDescription,
  // DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogTrigger,
} from "@/components/ui/drawer-dialog";
// import { Button } from "@/components/ui/button";
import TransactionForm from "./input/transaction-form";
import { fetchProducts } from "@/server/query/products";

interface TransactionContainerProps {
  tag: "purchase" | "sale";
  children: React.ReactNode;
}

export default async function TransactionContainer({
  tag,
  children,
}: TransactionContainerProps) {
  const products = await fetchProducts();
  if (!products || !products.data) return null;

  return (
    <DrawerDialog>
      <DrawerDialogTrigger asChild>{children}</DrawerDialogTrigger>
      <DrawerDialogContent>
        <DrawerDialogHeader>
          <DrawerDialogTitle>
            {tag === "sale" ? "New Sale" : "New Purchase"}
          </DrawerDialogTitle>
          <DrawerDialogDescription>
            Enter transaction details
          </DrawerDialogDescription>
        </DrawerDialogHeader>

        <div className="px-4">
          <TransactionForm products={products.data} tag={tag} />
        </div>
      </DrawerDialogContent>
    </DrawerDialog>
  );
}
