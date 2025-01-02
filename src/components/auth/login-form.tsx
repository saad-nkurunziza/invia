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
import { LoginSchema } from "@/auth-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "@/server/auth/login";
import FormDescriptionMessage from "./form-description-message";

const LoginForm = () => {
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(
    null
  );

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      const response = await login(values);
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
      <FormDescriptionMessage type={messageType} message={formMessage} />
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
        <ContinueButton isSubmitting={isSubmitting} title="Sign in" />
      </form>
    </Form>
  );
};

export default LoginForm;
