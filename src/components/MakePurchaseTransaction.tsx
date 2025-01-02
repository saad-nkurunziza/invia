"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Loader } from "lucide-react";
import { incrementProductQuantity } from "@/server/input/transacton";
import type { Product } from "@prisma/client";

const FormSchema = z.object({
  productId: z.string({
    required_error: "Please select a product.",
  }),

  qty: z.coerce.number().positive(),
});

export default function MakePurchaseTransaction({
  isLink = false,
  className = "",
  products,
}: {
  isLink?: boolean;
  className?: string;
  products: Product[];
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      productId: "",
      qty: 1,
    },
  });
  const { isSubmitting, isDirty } = form.formState;
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await incrementProductQuantity(data.productId, data.qty);
    if (res.status === "error") {
      toast.error(res.msg);
    } else {
      form.reset();
      toast.success(res.msg);
    }
  }
  if (!products || products.length === 0) return null;
  return (
    <Drawer>
      <DrawerTrigger asChild>
        {isLink ? (
          <div className={`${className} cursor-pointer`}>
            <ArrowRightIcon className="h-4 w-4" />
            Make Purchase Transaction
          </div>
        ) : (
          <Button
            variant="ghost"
            className={`${className} p-0 m-0 w-fit hover:bg-transparent`}
          >
            <ArrowRightIcon className="h-5 w-5" />
            Make Purchase Transaction
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="overflow-hidden rounded-t-[10px] border-b-0 mx-auto md:max-w-[400px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-5">
              <CardHeader className="px-0">
                <CardTitle>Purchase Transaction</CardTitle>
                <CardDescription>
                  Please complete the details below to proceed with the
                  transaction.
                </CardDescription>
              </CardHeader>
              <div>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="productId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Product</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? products.find(
                                        (product) => product.id === field.value
                                      )?.name
                                    : "Select product"}
                                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search product..."
                                  className="h-9 bg-transparent"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    No products found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {products.map((product) => (
                                      <CommandItem
                                        value={product.name}
                                        key={product.id}
                                        onSelect={() => {
                                          form.setValue(
                                            "productId",
                                            product.id
                                          );
                                        }}
                                      >
                                        {product.name}
                                        <CheckIcon
                                          className={cn(
                                            "ml-auto h-4 w-4",
                                            product.id === field.value
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
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="qty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="qty">Quantity</FormLabel>
                          <FormControl>
                            <Input id="qty" {...field} type="number" />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <div className="items-center gap-2 md:ml-auto flex">
                <Button
                  variant="outline"
                  type="button"
                  size="sm"
                  onClick={() => form.reset()}
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  disabled={isSubmitting}
                  className={`transition-transform ${
                    isDirty ? "scale-105" : ""
                  }`}
                >
                  <Loader
                    className={`h-3.5 w-3.5 ${
                      isSubmitting ? "animate-spin mr-2" : "hidden"
                    }`}
                  />
                  {isSubmitting ? "Processing" : "Confirm Transaction"}
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
