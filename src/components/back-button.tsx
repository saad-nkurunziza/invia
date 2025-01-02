"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackButton = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <Button
      variant="outline"
      size="icon"
      type="button"
      className="h-7 w-7"
      onClick={handleBack}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </Button>
  );
};

export default BackButton;
