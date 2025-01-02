"use client";

import Link from "next/link";
import { CircleIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignupForm() {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full lg:w-1/2 flex-col px-8 sm:px-16 py-8">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <CircleIcon className="h-8 w-8 fill-blue-600 text-white" />
          TaxPal
        </div>

        <div className="mt-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Get started for free
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Already registered?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>{" "}
            to your account.
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" className="h-11" placeholder="" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" className="h-11" placeholder="" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" className="h-11" placeholder="" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="h-11"
              placeholder=""
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">How did you hear about us?</Label>
            <Select>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-400" />
    </div>
  );
}
