import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

export default function MoreInfo({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={"icon"}
            className=" outline-none focus:outline-none focus-within:outline-none"
          >
            <InformationCircleIcon className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
