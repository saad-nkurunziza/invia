"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  PencilSquareIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Prisma } from "@prisma/client";
import { deleteSupplier } from "@/server/input/supplier";
import { formatPrice } from "@/utils/index";

type SupplierPayload = Prisma.SupplierGetPayload<{
  include: {
    business: true;
    logs: true;
    products: {
      include: {
        current_version: true;
      };
    };
    product_versions: true;
  };
}>;

async function fetchSupplierInfo(
  supplierId: string
): Promise<SupplierPayload | null> {
  const response = await fetch(`/api/supplierInfo/${supplierId}`);
  if (!response.ok) {
    console.error("Failed to fetch supplier info");
    return null;
  }
  return response.json();
}

export default function SupplierActions({
  supplierId,
}: {
  supplierId: string;
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [returnMsg, setReturnMsg] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [supplierInfo, setSupplierInfo] = useState<SupplierPayload | null>(
    null
  );
  const [isSupplierInfoLoading, setIsSupplierInfoLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const getSupplierInfo = useCallback(async (id: string, isOpen: boolean) => {
    if (!isOpen) return;

    setIsSupplierInfoLoading(true);
    try {
      const data = await fetchSupplierInfo(id);
      if (!data || data === null) {
        setSupplierInfo(null);
      }
      setSupplierInfo(data);
    } catch (error) {
      console.error("Error fetching supplier info:", error);
      setSupplierInfo(null);
    } finally {
      setIsSupplierInfoLoading(false);
    }
  }, []);

  useEffect(() => {
    getSupplierInfo(supplierId, infoOpen);
  }, [supplierId, infoOpen, getSupplierInfo]);

  const handleDelete = async () => {
    const { status, msg } = await deleteSupplier(supplierId);
    if (status === "success") {
      setTitle("Success");
      setReturnMsg(msg);
      setIsSuccess(true);
    } else {
      setTitle("Error");
      setReturnMsg(msg);
    }
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setReturnMsg("");
    setIsSuccess(false);
    setTitle("");
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-7 w-7 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild className="flex items-center">
            <Link href={`/edit-supplier?supplierId=${supplierId}`}>
              <PencilSquareIcon className="h-3.5 w-3.5 mr-2" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center"
            onClick={() => setInfoOpen(true)}
          >
            <InformationCircleIcon className="h-3.5 w-3.5 mr-2" />
            Info
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <TrashIcon className="h-3.5 w-3.5 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="min-w-80 min-h-36">
          <DialogHeader>
            <DialogTitle>Supplier Information</DialogTitle>
            <DialogDescription>More info</DialogDescription>
          </DialogHeader>
          {isSupplierInfoLoading ? <p>Loading...</p> : null}

          {supplierInfo ? (
            <div className="p-6 bg-muted rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-foreground/80">
                  {supplierInfo.name}
                </h2>
                <p className="text-muted-foreground">
                  Address: {supplierInfo.address || "N/A"}
                </p>
                <p className="text-foreground/80 font-medium">
                  Telephone:{" "}
                  <span className="text-muted-foreground">
                    {supplierInfo.tel}
                  </span>
                </p>
                <p className="text-foreground/80 font-medium">
                  Email:{" "}
                  <span className="text-muted-foreground">
                    {supplierInfo.email}
                  </span>
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground/80">
                  Products Supplied
                </h3>
                <ul className="list-disc list-inside text-foreground/80">
                  {supplierInfo.products.map((product) => (
                    <div
                      key={product.id}
                      className="text-muted-foreground flex flex-col gap-1"
                    >
                      {product.name}
                      <span>
                        Selling price:{" "}
                        {product.current_version
                          ? formatPrice(product.current_version.selling_price)
                          : null}{" "}
                        RWF
                      </span>
                      <span>
                        Buying price:{" "}
                        {product.current_version
                          ? formatPrice(product.current_version.buying_price)
                          : null}{" "}
                        RWF
                      </span>
                    </div>
                  ))}
                </ul>
              </div>

              {/* <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground/80">
                  Activity Log
                </h3>
                <ul className="list-disc list-inside text-foreground/80">
                  {supplierInfo..map((activity) => (
                    <div key={activity.id} className="text-muted-foreground">
                      <span className="capitalize">{activity.type}</span> -{" "}
                      {activity.quantity}
                      <span className="block text-sm text-gray-500">
                        {new Date(activity.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </ul>
              </div> */}

              <div>
                <h3 className="text-lg font-semibold text-foreground/80">
                  Change Log
                </h3>
                <ul className="list-disc list-inside text-foreground/80">
                  {supplierInfo.logs.map((log) => (
                    <div key={log.id} className="text-muted-foreground">
                      <span className="capitalize">
                        {log.type.split("_").join(" ")}
                      </span>
                      <span className="block text-sm text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title || "Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {returnMsg ||
                "This action cannot be undone. Do you really want to delete this supplier?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDialog}>
              {isSuccess ? "Ok" : "Cancel"}
            </AlertDialogCancel>
            {!isSuccess && <Button onClick={handleDelete}>Delete</Button>}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
