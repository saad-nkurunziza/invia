import { auth } from "@/lib/auth";

export const getAuthenticatedUser = async () => {
  const session = await auth();
  return session?.user;
};
