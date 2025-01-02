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
      <Button
        onClick={handleBack}
        variant="ghost"
        size="sm"
        className="gap-2 mb-2"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back
      </Button>
    </div>
  );
};

export default OnboardingBackButton;
