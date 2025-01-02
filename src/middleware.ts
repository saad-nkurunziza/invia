import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import * as routes from "@/routes";
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(routes.apiAuthPrefix);
  const isPublicRoute = routes.publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = routes.authRoutes.includes(nextUrl.pathname);
  // const isOnboardingRoute = nextUrl.pathname === "/onboarding";

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(routes.DEFAULT_AUTH_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(routes.authRoutes[0], nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
