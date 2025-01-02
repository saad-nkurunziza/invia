import React from "react";
import { Button } from "@/components/ui/button";

const ContinueButton = ({
  isSubmitting = false,
  title,
}: {
  isSubmitting?: boolean;
  title: string;
}) => {
  return (
    <Button className="w-full" type="submit">
      {isSubmitting ? "Initializing ..." : title}
    </Button>
  );
};

export default ContinueButton;
