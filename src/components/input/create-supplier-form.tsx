"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import BackButton from "@/components/back-button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader } from "lucide-react";
import { addSupplier } from "@/server/input/supplier";

export const EntrySupplierFormSchema = z.object({
  name: z.string(),
  address: z.string(),
  tel: z.string(),
  email: z.string(),
});

const CreateSupplier = () => {
  const form = useForm<z.infer<typeof EntrySupplierFormSchema>>({
    resolver: zodResolver(EntrySupplierFormSchema),
    defaultValues: {
      name: "",
      address: "",
      tel: "",
      email: "",
    },
  });
  const { isSubmitting, isDirty } = form.formState;

  async function onSubmit(data: z.infer<typeof EntrySupplierFormSchema>) {
    const res = await addSupplier(data);
    if (res.status === "error") {
      toast.error(res.msg);
    } else {
      form.reset();
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
              Add Supplier
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
                {isSubmitting ? "Saving" : "Save Supplier"}
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Please provide the supplier&apos;s personal details.
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
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="address">Address</FormLabel>
                            <FormControl>
                              <Textarea
                                id="address"
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
            </div>
            <div className="grid auto-rows-max gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="tel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="tel">Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                id="tel"
                                type="tel"
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
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="email">Email Address</FormLabel>
                            <FormControl>
                              <Input
                                id="email"
                                type="email"
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
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
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
              {isSubmitting ? "Saving" : "Save Supplier"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreateSupplier;
