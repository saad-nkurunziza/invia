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
    values;
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
      <OnboardingBackButton />
      <div className="py-3 space-y-3">
        <CardTitle>Join an Existing Business</CardTitle>
        <CardDescription>
          Please provide the Business ID to join an existing business. This
          information will help us link your account to the correct business.
        </CardDescription>
      </div>
      <FormDescriptionMessage type={messageType} message={formMessage} />
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
          title="Complete Onboarding"
        />
      </form>
    </Form>
  );
};

export default OnboardingJoinForm;
