"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
// Adjust the import based on your icon library

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button onClick={handleBack} variant={"outline"} size={"icon"}>
      <ChevronLeftIcon className="h-3 w-3 mr-2" />
    </Button>
  );
};

export default BackButton;
