"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import ContinueButton from "@/components/auth/continue-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import FormDescriptionMessage from "@/components/auth/form-description-message";
import { useRouter } from "next/navigation";
import OnboardingBackButton from "./onboarding-back-button";
import { CardDescription, CardTitle } from "../ui/card";
import { create } from "@/server/onboarding/create";

export const OnboardingCreateSchema = z.object({
  businessName: z.string().min(1, { message: "Business name is required" }),
  businessEmail: z
    .string()
    .email({ message: "Invalid email address" })
    .optional(),
  businessPhone: z
    .string()
    .min(10, { message: "Business phone must be at least 10 characters long" })
    .optional(),
  registrationNumber: z.string().min(4, {
    message: "Registration number has to have a minimum of 4 characters",
  }),
  address: z
    .string()
    .min(4, { message: "Address has to have a minimum of 4 characters" }),
  isAdmin: z.boolean().optional(),
});

export type OnboardingCreateFormValues = z.infer<typeof OnboardingCreateSchema>;

const OnboardingCreateForm = () => {
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(
    null
  );
  const router = useRouter();

  const form = useForm<OnboardingCreateFormValues>({
    resolver: zodResolver(OnboardingCreateSchema),
    defaultValues: {
      businessName: "",
      businessEmail: "",
      businessPhone: "",
      registrationNumber: "",
      address: "",
      isAdmin: false,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: OnboardingCreateFormValues) => {
    try {
      const response = await create(values);

      if ("error" in response) {
        setFormMessage(response.error ?? "");
        setMessageType("error");
      } else {
        setFormMessage(response.success);
        setMessageType("success");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      setFormMessage("An unexpected error occurred. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <Form {...form}>
      <div className="p-6 space-y-6">
        <OnboardingBackButton />
        <div className="space-y-2">
          <CardTitle className="text-2xl font-semibold">
            Create Business
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your business details to get started.
          </CardDescription>
        </div>
        <FormDescriptionMessage type={messageType} message={formMessage} />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="businessName">Business Name</FormLabel>
                  <FormControl>
                    <Input
                      variant={"lg"}
                      type="text"
                      id="businessName"
                      placeholder="Enter your business name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="businessEmail">Business Email</FormLabel>
                  <FormControl>
                    <Input
                      variant={"lg"}
                      type="email"
                      id="businessEmail"
                      placeholder="Enter business email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="businessPhone">Business Phone</FormLabel>
                  <FormControl>
                    <Input
                      variant={"lg"}
                      type="tel"
                      id="businessPhone"
                      placeholder="Enter business phone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="registrationNumber">
                    Registration number
                  </FormLabel>
                  <FormControl>
                    <Input
                      variant={"lg"}
                      type="tel"
                      id="registrationNumber"
                      placeholder="Enter registration number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <FormControl>
                    <Input
                      variant={"lg"}
                      type="tel"
                      id="address"
                      placeholder="Enter address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAdmin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I am an admin of this business</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <ContinueButton
            isSubmitting={isSubmitting}
            title="Create Business"
            // className="w-full mt-6"
          />
        </form>
      </div>
    </Form>
  );
};

export default OnboardingCreateForm;
