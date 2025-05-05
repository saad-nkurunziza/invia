"use client";

import * as React from "react";
import {
  Building,
  Ghost,
  Zap,
  Shield,
  // Loader2,
  BarChart3,
  ClipboardList,
  Briefcase,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BusinessSwitcherSkeleton } from "@/components/skeleton-loaders";
import { useBusinessData } from "@/hooks/use-business";

const logos = [
  Briefcase,
  BarChart3,
  ClipboardList,
  Building,
  Ghost,
  Zap,
  Shield,
];

export function BusinessSwitcher() {
  const { activeBusiness, isLoading, error } = useBusinessData();

  if (error) return <div>error</div>;
  if (isLoading || !activeBusiness) return <BusinessSwitcherSkeleton />;

  const ActiveLogo = logos[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ActiveLogo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {activeBusiness.business.name}
            </span>
            <span className="truncate text-xs">
              {activeBusiness.business.registration_number}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
