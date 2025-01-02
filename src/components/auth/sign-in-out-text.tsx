"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SignInOutText: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        {pathname === "/login"
          ? "Get started for free"
          : pathname === "/register"
          ? "Create your account"
          : "Welcome back"}
      </h1>
      <p className="text-sm text-muted-foreground mt-2">
        {pathname === "/login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>{" "}
            now.
          </>
        ) : pathname === "/register" ? (
          <>
            Already registered?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>{" "}
            to your account.
          </>
        ) : (
          <>
            Already registered?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>{" "}
            to your account.
          </>
        )}
      </p>
    </div>
  );
};

export default SignInOutText;
