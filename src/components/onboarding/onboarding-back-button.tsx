"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

const OnboardingBackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/onboarding");
  };

  return (
    <div className="mb-3">
      <Button onClick={handleBack} variant={"outline"} size={"icon"}>
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OnboardingBackButton;
