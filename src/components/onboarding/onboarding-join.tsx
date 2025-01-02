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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormDescriptionMessage from "@/components/auth/form-description-message";
import { useRouter } from "next/navigation";
import OnboardingBackButton from "./onboarding-back-button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { join } from "@/server/onboarding/join";

export const OnboardingJoinSchema = z.object({
  businessId: z
    .string()
    .min(5, { message: "Business ID must be at least 5 characters long" }),
});

export type OnboardingJoinFormValues = z.infer<typeof OnboardingJoinSchema>;

const OnboardingJoinForm = () => {
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(
    null
  );
  const router = useRouter();

  const form = useForm<OnboardingJoinFormValues>({
    resolver: zodResolver(OnboardingJoinSchema),
    defaultValues: {
      businessId: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: OnboardingJoinFormValues) => {
    try {
      const response = await join(values);

      if ("error" in response) {
        setFormMessage(response.error);
        setMessageType("error");
        router.push("/dashboard");
      } else {
        setFormMessage(response.success);
        setMessageType("success");
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
            Join Business
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter the business ID to connect.
          </CardDescription>
        </div>
        <FormDescriptionMessage type={messageType} message={formMessage} />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="businessId"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="businessId">Business ID</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="businessId"
                    variant={"lg"}
                    placeholder="Enter the business ID"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ContinueButton
            isSubmitting={isSubmitting}
            title="Join Business"
            // className="w-full mt-6"
          />
        </form>
      </div>
    </Form>
  );
};

export default OnboardingJoinForm;
