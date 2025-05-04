import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Package, Users, ArrowLeftRight, Clock } from "lucide-react";

export default function QuickAccessBar() {
  const quickActions = [
    { icon: Plus, label: "New Entry" },
    { icon: Package, label: "Add Product" },
    { icon: Users, label: "Add Supplier" },
    { icon: ArrowLeftRight, label: "Transaction" },
    { icon: Clock, label: "Recent" },
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 border rounded-full shadow-lg px-2 py-1.5 flex items-center gap-1">
        {quickActions.map((action, index) => (
          <Tooltip key={index} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                // onClick={action.onClick}
              >
                <action.icon className="h-4 w-4" />
                <span className="sr-only">{action.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {action.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
