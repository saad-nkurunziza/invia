"use server";
import { signIn } from "@/lib/auth";
import { DEFAULT_AUTH_REDIRECT } from "@/routes";
import { RegisterSchema, AuthResponse } from "@/auth-types";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const register = async (
  values: z.infer<typeof RegisterSchema>
): Promise<AuthResponse> => {
  const { email, password, name } = values;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    if (!newUser) {
      return { error: "Error adding a new user" };
    }
    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_AUTH_REDIRECT,
    });
    if (!result) {
      return { error: "Error signing in. Try again later" };
    }
    return { success: "Sign i success" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error:
              "The credentials provided are incorrect. Please verify your email and password.",
          };
        case "AccessDenied":
          return {
            error:
              "You do not have permission to access this account. Please reach out to support for assistance.",
          };
        case "AccountNotLinked":
          return {
            error:
              "This account is not linked. Please contact support for help.",
          };
        case "EmailSignInError":
          return {
            error:
              "There was an issue signing in with your email. Please contact support.",
          };
        case "OAuthSignInError":
          return {
            error:
              "There was an error during the OAuth sign-in process. Please try another sign-in method.",
          };
        default:
          return {
            error: "An unexpected error has occurred. Please try again later.",
          };
      }
    }
    throw error;
  }
};
