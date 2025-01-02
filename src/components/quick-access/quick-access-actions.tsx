"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";
import QuickAccessBar from "./quick-bar";
import QuickAccessIconButton from "./icon-button";

const QuickAccess = () => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <QuickAccessBar />;
  } else {
    <QuickAccessIconButton />;
  }
};

export default QuickAccess;
