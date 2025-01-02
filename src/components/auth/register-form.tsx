"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import ContinueButton from "@/components/auth/continue-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/auth-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { register } from "@/server/auth/register";
import FormDescriptionMessage from "./form-description-message";

const RegisterForm = () => {
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(
    null
  );
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });
  const { isSubmitting } = form.formState;
  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    try {
      const response = await register(values);
      if ("error" in response) {
        setFormMessage(response.error);
        setMessageType("error");
      } else {
        setFormMessage(response.success);
        setMessageType("success");
      }
    } catch (error) {
      console.error("Login error:", error);
      setFormMessage("An unexpected error occurred. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <Form {...form}>
      <FormDescription>
        Please enter your details to create a new account.
      </FormDescription>
      <FormDescriptionMessage type={messageType} message={formMessage} />
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="name"
                  placeholder="Full Name"
                  className=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  id="password"
                  placeholder="*******"
                  className=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="*******"
                  className=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ContinueButton isSubmitting={isSubmitting} title="Create account" />
      </form>
    </Form>
  );
};

export default RegisterForm;
