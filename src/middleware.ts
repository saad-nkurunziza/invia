import * as routes from "@/routes";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);
  const isLoggedIn = !!sessionCookie;
  const { nextUrl } = req;

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
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
