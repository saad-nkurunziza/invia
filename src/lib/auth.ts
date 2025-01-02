import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import { getUserById } from "@/server/user";

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
    // async signIn({ user }) {
    //   const existingUser = await getUserById(user.id ?? "");
    //   if (!existingUser || !existingUser.emailVerified) {
    //     return false;
    //   }
    //   return true;
    // },
    async session({ session, token }) {
      "Session callback:", { session, token };
      if (token.sub && session.user) {
        const existingUser = await getUserById(token.sub);
        ({ existingUser });
        session.user.id = token.sub;
        session.user.businessId =
          existingUser?.businesses?.[0]?.business_id ?? undefined;
        session.user.role = existingUser?.role;
      }
      "Updated session:", session;
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
