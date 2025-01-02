import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Package, Users, ClipboardList, Zap } from "lucide-react";
import Link from "next/link";

export default function QuickAccessIconButton() {
  const quickActions = [
    {
      icon: Package,
      label: "Add Product",
      isLink: true,
      href: "/add-product",
    },
    {
      icon: Users,
      label: "Add Supplier",
      isLink: true,
      href: "/add-supplier",
    },
    {
      icon: ClipboardList,
      label: "Stock Report",
      isLink: true,
      href: "/analytics",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative ml-auto">
          <Zap className="h-5 w-5" />
          <span className="sr-only">Quick Actions</span>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {quickActions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            className="flex items-center cursor-pointer transition-colors hover:bg-muted"
            asChild={action.isLink}
          >
            <Link href={action.href || ""}>
              <action.icon className="mr-2 h-4 w-4 text-primary" />
              <span>{action.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
