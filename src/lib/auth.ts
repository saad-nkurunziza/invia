import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "Invia",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    nextCookies(),
    customSession(async ({ user, session }) => {
      // const roles = findUserRoles(session.session.userId);
      return {
        // roles,
        user: {
          ...user,
          businessId: "newField",
          role: "newField",
        },
        session,
      };
    }),
  ],
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
});
