"use client";
import Link from "next/link";
import React, { ReactNode } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { VercelLogoIcon } from "@radix-ui/react-icons";
import ContinueWithGithub from "./continue-with-github";

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isSignUp = pathname.includes("register");
  function handlePath() {
    if (isSignUp) {
      router.push("/login");
    } else {
      router.push("/register");
    }
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2 text-primary">
        {isSignUp ? "Start managing inventory" : "Welcome back"}
      </h1>
      <h2 className="text-xl mb-8 text-muted-foreground">
        {isSignUp
          ? "Create an account to get started."
          : "Sign in to your account."}
      </h2>
      <div className="space-y-4">
        <ContinueWithGithub />
        <Button variant="outline" className="w-full">
          <VercelLogoIcon className="mr-2 h-4 w-4" />
          {isSignUp ? "Sign up" : "Sign in"} with Apple
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted-foreground" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>
        {children}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        By {isSignUp ? "signing up" : "signing in"}, you agree to the{" "}
        <Link href="#" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        , including Cookie Use.
      </p>
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
        </p>
        <Button variant="link" className="" onClick={handlePath}>
          {isSignUp ? "Sign in" : "Sign up"}
        </Button>
      </div>
    </div>
  );
};

export default AuthWrapper;
