"use client";
import { useState, useEffect, useCallback } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  InformationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { deleteProduct } from "@/server/input/product";

async function fetchProductInfo(
  productId: string
): Promise<any | undefined> {
  const response = await fetch(`/api/productInfo/${productId}`);
  if (!response.ok) {
    console.error("Failed to fetch product info");
    return undefined;
  }
  return response.json();
}
export default function ProductActions({ productId }: { productId: string }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [productInfo, setProductInfo] = useState<any | null>(null);
  const [isProductInfoLoading, setIsProductInfoLoading] = useState(false);
  const [returnMsg, setReturnMsg] = useState("");
  const [title, setTitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDelete = async () => {
    const { status, msg } = await deleteProduct(productId);

    if (status === "success") {
      setTitle("Success");
      setReturnMsg(msg);
      setIsSuccess(true);
    } else {
      setTitle("Error");
      setReturnMsg(msg);
    }
  };

  const getProductInfo = useCallback(async (id: string, isOpen: boolean) => {
    if (!isOpen) return;

    setIsProductInfoLoading(true);
    try {
      const data = await fetchProductInfo(id);
      setProductInfo(data || null);
    } catch (error) {
      console.error("Error fetching product info:", error);
      setProductInfo(null);
    } finally {
      setIsProductInfoLoading(false);
    }
  }, []);

  useEffect(() => {
    getProductInfo(productId, infoOpen);
  }, [productId, infoOpen, getProductInfo]);

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
            <Link href={`/edit-product?productId=${productId}`}>
              <PencilSquareIcon className="h-3.5 w-3.5 mr-2" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className=" flex items-center"
            onClick={() => setInfoOpen(true)}
          >
            <InformationCircleIcon className="h-3.5 w-3.5 mr-2" />
            Info
          </DropdownMenuItem>
          <DropdownMenuItem
            className=" flex items-center"
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
            <DialogTitle>Product Information</DialogTitle>
            <DialogDescription>More info</DialogDescription>
          </DialogHeader>
          {isProductInfoLoading ? <p>Loading...</p> : null}

          {productInfo ? (
            <div className="p-6 bg-muted rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-foreground/80">
                  {productInfo.name}
                </h2>
                <p className="text-muted-foreground">
                  {productInfo.description}
                </p>
                <p className="text-foreground/80 font-medium">
                  Stock:{" "}
                  <span className="text-muted-foreground">
                    {productInfo.stock}
                  </span>
                </p>
                <p className="text-foreground/80 font-medium">
                  Buying price:{" "}
                  <span className="text-muted-foreground">
                    {productInfo.buying_price} RWF
                  </span>
                </p>
                <p className="text-foreground/80 font-medium">
                  Selling price:{" "}
                  <span className="text-muted-foreground">
                    {productInfo.selling_price} RWF
                  </span>
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground/80">
                  Supplier Info
                </h3>
                <p className="text-foreground/80">
                  Name:{" "}
                  <span className="text-muted-foreground">
                    {productInfo.Supplier.name}
                  </span>
                </p>
                <p className="text-foreground/80">
                  Email:{" "}
                  <span className="text-muted-foreground">
                    {productInfo.Supplier.email}
                  </span>
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground/80">
                  Transactions
                </h3>
                <ul className="list-disc list-inside text-foreground/80">
                  {productInfo.Activity.map((activity) => (
                    <li key={activity.id} className="text-muted-foreground">
                      <span className="capitalize">{activity.type}</span> -{" "}
                      {activity.qty}
                      <span className="block text-xs text-muted-foreground/80">
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground/80">
                  Logs
                </h3>
                <ul className="list-disc list-inside text-foreground/80">
                  {productInfo.Log.map((log) => (
                    <li key={log.id} className="text-muted-foreground">
                      <span className="capitalize">
                        {log.type.split("_").join(" ")}
                      </span>
                      <span className="block text-xs text-muted-foreground/80">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </li>
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
                "This action cannot be undone. Do you really want to delete this item?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpenDeleteDialog(false);
                setReturnMsg("");
                setIsSuccess(false);
              }}
            >
              {isSuccess ? "Ok" : "Cancel"}
            </AlertDialogCancel>
            {!(isSuccess || title === "Error") && (
              <Button onClick={handleDelete}>Delete</Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
