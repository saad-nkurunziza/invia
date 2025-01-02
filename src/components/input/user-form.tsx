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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader } from "lucide-react";
import { editUser } from "@/server/input/user";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";

type UserFormSchema = Prisma.UserGetPayload<{
  include: {
    businesses: true;
    transactions: true;
    logs: true;
    accounts: true;
  };
}>;

export const UserFormSchemaZod = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["WORKER", "ADMIN"]),
});

const EditUserForm = ({ user }: { user: UserFormSchema }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof UserFormSchemaZod>>({
    resolver: zodResolver(UserFormSchemaZod),
    defaultValues: {
      name: user.name || "",
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    },
  });

  const { isSubmitting, isDirty } = form.formState;

  async function onSubmit(data: z.infer<typeof UserFormSchemaZod>) {
    const res = await editUser(user.id, data);
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
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
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
              {isSubmitting ? "Saving" : "Save User"}
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Provide the user&apos;s personal details.
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
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="phone">Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                id="phone"
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
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="role">Role</FormLabel>
                            <FormControl>
                              <Input
                                id="role"
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
              {isSubmitting ? "Saving" : "Save User"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default EditUserForm;
