"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  Plus,
  Building,
  Ghost,
  Zap,
  Shield,
  // Loader2,
  BarChart3,
  ClipboardList,
  Briefcase,
} from "lucide-react";
import useSWR from "swr";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Prisma } from "@prisma/client";
import { BusinessSwitcherSkeleton } from "@/components/skeleton-loaders";
import { fetcher } from "@/lib/utils";
import { useNetworkStatus } from "@/hooks/use-network";

export type UserBusinessPayload = Prisma.BusinessUserGetPayload<{
  include: {
    business: true;
  };
}>;

export function BusinessSwitcher({
  initialData,
}: {
  initialData: UserBusinessPayload;
}) {
  const { isMobile } = useSidebar();
  const { isOnline } = useNetworkStatus();
  const {
    data: activeBusiness,
    error: activeError,
    isLoading: activeLoading,
  } = useSWR<UserBusinessPayload | null>(`/api/business/active`, fetcher, {
    fallbackData: initialData,
    revalidateOnFocus: isOnline,
    revalidateIfStale: isOnline,
    dedupingInterval: 60000,
    errorRetryCount: isOnline ? 3 : 0,
    onError: (err) => {
      console.error("Failed to fetch user data", err);
    },
  });
  const {
    data: otherBusinesses,
    error: otherError,
    isLoading: otherLoading,
  } = useSWR<UserBusinessPayload[] | null>(`/api/business/all`, fetcher, {
    fallbackData: [],
    revalidateOnFocus: isOnline,
    revalidateIfStale: isOnline,
    dedupingInterval: 60000,
    errorRetryCount: isOnline ? 3 : 0,
    onError: (err) => {
      console.error("Failed to fetch user data", err);
    },
  });

  const isLoading = activeLoading;
  const isOtherLoading = otherLoading;
  const error = activeError;

  const handleBusinessSwitch = async (businessId: string) => {
    console.log(`Switching to business: ${businessId}`);
  };

  if (error) return <div>error</div>;
  if (isLoading || !activeBusiness)
    return (
      <div className="flex items-center justify-center p-4">
        <BusinessSwitcherSkeleton />
      </div>
    );

  const logos = [
    Briefcase,
    BarChart3,
    ClipboardList,
    Building,
    Ghost,
    Zap,
    Shield,
  ];

  const ActiveLogo = logos[0];
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {isOtherLoading ? (
            <div>loading...</div>
          ) : otherError ? (
            <div>error</div>
          ) : (
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Active Business
              </DropdownMenuLabel>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <ActiveLogo className="size-4 shrink-0" />
                </div>
                {activeBusiness.business.name}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Switch Business
              </DropdownMenuLabel>
              {otherBusinesses &&
                otherBusinesses.map((business, index) => {
                  const BusinessLogo = logos[index % logos.length];
                  return (
                    <DropdownMenuItem
                      key={business.business_id}
                      onClick={() => handleBusinessSwitch(business.business_id)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <BusinessLogo className="size-4 shrink-0" />
                      </div>
                      {business.business.name}
                    </DropdownMenuItem>
                  );
                })}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add business
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
