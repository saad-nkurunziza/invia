"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import type { Product } from "@prisma/client";
import {
  incrementProductQuantity,
  deductProductQuantity,
} from "@/server/input/transacton";

const TransactionAcivitiesFormSchema = z.object({
  productId: z.string({
    required_error: "Please select a product.",
  }),
  qty: z.coerce.number().positive(),
});

interface TransactionFormProps {
  products: Product[];
  tag: "purchase" | "sale";
}

const TransactionForm: React.FC<TransactionFormProps> = ({ products, tag }) => {
  const form = useForm<z.infer<typeof TransactionAcivitiesFormSchema>>({
    resolver: zodResolver(TransactionAcivitiesFormSchema),
    defaultValues: {
      productId: "",
      qty: 1,
    },
  });

  const handleSubmit = async (
    data: z.infer<typeof TransactionAcivitiesFormSchema>
  ) => {
    const res =
      tag === "purchase"
        ? await incrementProductQuantity(data.productId, data.qty)
        : await deductProductQuantity(data.productId, data.qty);

    if (res.status === "error") {
      toast.error(res.msg);
    } else {
      form.reset();
      toast.success(res.msg);
    }
  };
  const { isSubmitting, isDirty } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="">
          <CardHeader className="px-0">
            <CardTitle>
              {tag === "purchase" ? "Purchase Transaction" : "Sale Transaction"}
            </CardTitle>
            <CardDescription>
              Please complete the details below to proceed with the {tag}.
            </CardDescription>
          </CardHeader>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>Product</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="justify-between"
                        >
                          {field.value ? (
                            products.find(
                              (product) => product.id === field.value
                            )?.name
                          ) : (
                            <span className="text-muted-foreground">
                              Select product
                            </span>
                          )}
                          <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Command>
                        <CommandInput placeholder="Search product..." />
                        <CommandList>
                          <CommandEmpty>No products found.</CommandEmpty>
                          <CommandGroup>
                            {products.map((product) => (
                              <CommandItem
                                key={product.id}
                                onSelect={() =>
                                  form.setValue("productId", product.id)
                                }
                              >
                                {product.name}
                                <CheckIcon
                                  className={
                                    product.id === field.value
                                      ? "ml-auto h-4 w-4"
                                      : "opacity-0"
                                  }
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

            <FormField
              control={form.control}
              name="qty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tag === "purchase"
                      ? "Quantity Purchased"
                      : "Quantity Sold"}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end mt-5 sm:space-x-2">
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
              className={`transition-transform ${isDirty ? "scale-105" : ""}`}
            >
              <Loader
                className={`h-3.5 w-3.5 ${
                  isSubmitting ? "animate-spin mr-2" : "hidden"
                }`}
              />
              {isSubmitting ? "Processing" : "Confirm Transaction"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TransactionForm;
