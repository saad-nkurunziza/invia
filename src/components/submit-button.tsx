"use client";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, FC } from "react";
import { Loader } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
}

const SubmitButton: FC<ButtonProps> = ({
  className,
  title = "Save",
  ...props
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      className={cn(className)}
      {...props}
    >
      <Loader
        className={`h-3.5 w-3.5 ${pending ? "animate-spin mr-2" : "hidden"}`}
      />
      {pending ? "Saving" : `${title}`}
    </Button>
  );
};

export default SubmitButton;
