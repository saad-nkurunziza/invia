import { UserRole } from "@prisma/client";

export declare module "next-auth" {
  interface User {
    businessId?: string;
    role?: UserRole;
  }
  interface Session {
    user: User;
  }
}
