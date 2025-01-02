import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";

export default function OnboardingTab() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">
            Welcome to Invia
          </CardTitle>
          <CardDescription className="text-center">
            Select an option to begin your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button className="w-full relative" variant="default">
            <Link
              className="absolute inset-0"
              href={"/onboarding?onboard=create"}
            ></Link>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create a new business
          </Button>
          <Button className="w-full relative" variant="outline">
            <Link
              className="absolute inset-0"
              href={"/onboarding?onboard=join"}
            ></Link>
            <Users className="mr-2 h-4 w-4" />
            Join an existing business
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
