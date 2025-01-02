import { z } from "zod";
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const RegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
    name: z.string().min(3).max(15),
    confirmPassword: z.string().min(6).max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
export type AuthResponse = { success: string } | { error: string };
