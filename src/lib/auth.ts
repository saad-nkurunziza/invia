import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
import { getUserById } from "@/server/user";

export const auth = betterAuth({
  appName: "Invia",
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  plugins: [
    nextCookies(),
    customSession(async ({ user, session }) => {
      const fetchedUser = await getUserById(session.userId);
      return {
        user: {
          ...user,
          businessId: fetchedUser?.businesses?.[0]?.business_id,
          role: fetchedUser?.role,
        },
        session,
      };
    }),
  ],
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  usePlural: true,
  user: {
    modelName: "User",
    fields: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
});
