import React from "react";
import Link from "next/link";
import {
  UserPlusIcon,
  FolderPlusIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import MakeSaleTransaction from "@/components/MakeSaleTransaction";
import MakePurchaseTransaction from "@/components/MakePurchaseTransaction";
import type { Product } from "@prisma/client";
const NewCircleArea = ({ products }: { products: Product[] }) => {
  return (
    <div className="sm:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <PlusCircleIcon className="h-5 w-5" />
            <span className="sr-only">Create new</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-2">
          {/* <DrawerHeader>
              <DrawerTitle>Sili Stock</DrawerTitle>
              <DrawerDescription>My Stock</DrawerDescription>
            </DrawerHeader> */}
          <div className="flex flex-col p-6 gap-4">
            <h4 className="mb-2 border-b py-2">Entry</h4>
            <Link className="flex items-center gap-5" href="/add-product">
              <FolderPlusIcon className="h-5 w-5" />
              Product
            </Link>
            <Link className="flex items-center gap-5" href="/add-supplier">
              <UserPlusIcon className="h-5 w-5" />
              Supplier
            </Link>
            <MakeSaleTransaction
              products={products}
              className={`flex items-center gap-5`}
            />

            <MakePurchaseTransaction
              products={products}
              className={`flex items-center gap-5`}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default NewCircleArea;
