import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import { getUserById } from "@/server/user";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/auth-types";
import { getUserByEmail } from "@/server/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { email_verified: new Date() },
      });
    },
  },
  trustHost: true,
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        const existingUser = await getUserById(token.sub);
        session.user.id = token.sub;
        session.user.businessId =
          existingUser?.businesses?.[0]?.business_id ?? undefined;
        session.user.role = existingUser?.role;
      }

      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
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
});
