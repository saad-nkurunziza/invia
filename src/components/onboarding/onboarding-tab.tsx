"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CardDescription, CardTitle } from "@/components/ui/card";

const OnboardingTab = () => {
  const router = useRouter();
  const handleTabChange = (tab: "create" | "join") => {
    router.push(`/onboarding?onboard=${tab}`);
  };
  return (
    <div className="min-h-screen bg-background flex flex-col items-start justify-center py-4">
      <div className="p-2 space-y-3">
        <CardTitle>Onboarding</CardTitle>
        <CardDescription>
          Welcome to the onboarding process! Please choose one of the options
          below to either create a new business or join an existing one. We are
          here to guide you every step of the way.
        </CardDescription>
      </div>
      <div className="flex mt-2 justify-center space-x-4 p-2">
        <Button onClick={() => handleTabChange("create")} className="w-1/2">
          Create Business
        </Button>
        <Button
          variant={"outline"}
          onClick={() => handleTabChange("join")}
          className="w-1/2"
        >
          Join Business
        </Button>
      </div>
    </div>
  );
};

export default OnboardingTab;
