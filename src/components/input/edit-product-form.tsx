"use client";
import React from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import BackButton from "@/components/back-button";
// import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Supplier } from "@prisma/client";

import { Prisma } from "@prisma/client";
import { toast } from "sonner";
import { CreateProductFormSchema } from "@/components/input/create-product-form";
import { editProduct } from "@/server/input/product";
import { useRouter } from "next/navigation";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    current_version: true;
    versions: true;
  };
}>;

const EditProductForm = ({
  product,
  suppliers,
}: {
  product: ProductWithRelations;
  suppliers: Supplier[];
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof CreateProductFormSchema>>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      stock: product.current_version?.stock,
      buying_price: product.current_version?.buying_price,
      selling_price: product.current_version?.selling_price,
      threshold: product.current_version?.threshold,
      status: product.current_version?.status || "ACTIVE",
      supplier_id: product.current_version?.supplier_id || "",
      category: product.current_version?.category || "",
      sku: product.current_version?.sku || "",
      version_id: product.current_version?.version_id || "",
      expiry_date: product.current_version?.expiry_date || new Date(),
    },
  });
  const { isSubmitting, isDirty } = form.formState;
  async function onSubmit(data: z.infer<typeof CreateProductFormSchema>) {
    const res = await editProduct(product.id, data);
    if (res.status === "error") {
      toast.error(res.msg);
    } else {
      form.reset();
      router.back();
      toast.success(res.msg);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto grid flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Edit Product
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => form.reset()}
                disabled={isSubmitting}
                className={`transition-transform ${isDirty ? "scale-105" : ""}`}
              >
                Discard
              </Button>
              <Button
                size="sm"
                type="submit"
                disabled={isSubmitting}
                className={`transition-transform ${isDirty ? "scale-105" : ""}`}
              >
                <Loader
                  className={`h-3.5 w-3.5 ${
                    isSubmitting ? "animate-spin mr-2" : "hidden"
                  }`}
                />
                {isSubmitting ? "Saving" : "Save Product"}
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Please provide detailed information about the product.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <FormControl>
                              <Input
                                id="name"
                                type="text"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="description">
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                id="description"
                                {...field}
                                className="min-h-32"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Stock & Price</CardTitle>
                  <CardDescription>
                    Enter the stock quantity, price, and minimum threshold.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Stock</TableHead>
                        <TableHead>Buying price</TableHead>
                        <TableHead>Selling price</TableHead>
                        <TableHead>Threshold</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-transparent">
                        <TableCell>
                          <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel htmlFor="stock" className="sr-only">
                                  Stock
                                </FormLabel>
                                <FormControl>
                                  <Input id="stock" {...field} type="number" />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name="buying_price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="buying_price"
                                  className="sr-only"
                                >
                                  Buying price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="buying_price"
                                    {...field}
                                    type="number"
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name="selling_price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="selling_price"
                                  className="sr-only"
                                >
                                  Selling price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="selling_price"
                                    {...field}
                                    type="number"
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name="threshold"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  htmlFor="threshold"
                                  className="sr-only"
                                >
                                  Threshold
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="threshold"
                                    {...field}
                                    type="number"
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Supplier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="supplier_id"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Supplier</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? suppliers.find(
                                          (supplier) =>
                                            supplier.id === field.value
                                        )?.name
                                      : "Select supplier"}
                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search supplier..."
                                    className="h-9 bg-transparent"
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      No supplier found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {suppliers.map((supplier) => (
                                        <CommandItem
                                          value={supplier.name}
                                          key={supplier.id}
                                          onSelect={() => {
                                            form.setValue(
                                              "supplier_id",
                                              supplier.id!
                                            );
                                          }}
                                        >
                                          {supplier.name}
                                          <CheckIcon
                                            className={cn(
                                              "ml-auto h-4 w-4",
                                              supplier.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="status">Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger id="status">
                                  <SelectValue placeholder="Select a product status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="archive">
                                  Archived
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Version</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="version_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="version_id">
                              Version Identification
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="version_id"
                                type="text"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="category">Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger id="category">
                                  <SelectValue placeholder="Select a product category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="smartphone">
                                  Smartphone
                                </SelectItem>
                                <SelectItem value="accessory">
                                  Accessory
                                </SelectItem>
                                <SelectItem value="gadget">Gadget</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="sticky bottom-0 mt-4 flex items-center gap-2 border-t bg-background pt-4 md:hidden">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => form.reset()}
              disabled={isSubmitting}
              className={`transition-transform ${isDirty ? "scale-105" : ""}`}
            >
              Discard
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={isSubmitting}
              className={`transition-transform ${isDirty ? "scale-105" : ""}`}
            >
              <Loader
                className={`h-3.5 w-3.5 ${
                  isSubmitting ? "animate-spin mr-2" : "hidden"
                }`}
              />
              {isSubmitting ? "Saving" : "Save Product"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default EditProductForm;
