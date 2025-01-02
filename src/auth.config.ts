import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "@/auth-types";
import { getUserByEmail } from "@/server/user";

export const authConfig: NextAuthConfig = {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedValues = LoginSchema.safeParse(credentials);
        if (validatedValues.success) {
          const { email, password } = validatedValues.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            const businessId =
              user.businesses && user.businesses.length > 0
                ? user.businesses[0].business_id
                : undefined;
            return {
              ...user,
              businessId,
            };
          }
        }
        return null;
      },
    }),
  ],
};
