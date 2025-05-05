"use client";
import * as React from "react";
import {
  BarChart3,
  FileText,
  Layers,
  Package,
  Database,
  Settings,
  ShieldCheck,
  Bot,
  CreditCard,
  Calendar,
  Calculator,
} from "lucide-react";

import { NavMain } from "@/components/navigation/nav-main";
import { NavUser } from "@/components/navigation/nav-user";
import { BusinessSwitcher } from "@/components/navigation/business-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  // SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUtilities } from "./nav-utilities";
import { BusinessSwitcherSkeleton, NavUserSkeleton } from "../skeleton-loaders";

export const data = {
  navMain: [
    {
      id: "dashboard",
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          id: "dashboard-overview",
          title: "Overview",
          url: "/dashboard",
        },
        {
          id: "dashboard-reports",
          title: "Reports",
          url: "/analytics",
        },
        {
          id: "dashboard-transactions",
          title: "Transactions",
          url: "/transactions",
        },
        {
          id: "dashboard-logs",
          title: "Logs",
          url: "/logs",
        },
      ],
    },
    {
      id: "inventory",
      title: "Inventory",
      url: "#",
      icon: Package,
      items: [
        {
          id: "inventory-suppliers",
          title: "Manage Suppliers",
          url: "/suppliers",
        },
        {
          id: "inventory-products",
          title: "Manage Products",
          url: "/products",
        },
      ],
    },
    {
      id: "stock-alerts",
      title: "Stock Alerts",
      url: "#",
      icon: Database,
      items: [
        {
          id: "stock-alerts-low",
          title: "Low Stock",
          url: "/stock-alerts",
          icon: ShieldCheck,
        },
        {
          id: "stock-alerts-out",
          title: "Out of Stock",
          url: "/stock-alerts",
          icon: FileText,
        },
      ],
    },
    {
      id: "operations",
      title: "Operations",
      url: "#",
      icon: Layers,
      isActive: true,
      items: [
        {
          id: "operations-new-supplier",
          title: "New supplier",
          url: "/add-supplier",
        },
        {
          id: "operations-new-product",
          title: "New product",
          url: "/add-product",
        },
      ],
    },
  ],

  utilities: [
    {
      id: "ai-assistant",
      title: "AI Assistant",
      url: "/ai-assistant",
      icon: Bot,
    },
    {
      id: "payment-portal",
      title: "Payment Portal",
      url: "/payment-portal",
      icon: CreditCard,
    },
    {
      id: "task-scheduler",
      title: "Task Scheduler",
      url: "/task-scheduler",
      icon: Calendar,
    },
    {
      id: "financial-calculator",
      title: "Financial Calculator",
      url: "/financial-calculator",
      icon: Calculator,
    },
    {
      id: "preferences",
      title: "Preferences",
      url: "/preferences",
      icon: Settings,
    },
  ],
};

const MemoizedNavMain = React.memo(NavMain);
const MemoizedNavUtilities = React.memo(NavUtilities);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <React.Suspense fallback={<BusinessSwitcherSkeleton />}>
          <BusinessSwitcher />
        </React.Suspense>
      </SidebarHeader>
      <SidebarContent className="scrollbar-hide">
        <MemoizedNavMain items={data.navMain} />
        <MemoizedNavUtilities utilities={data.utilities} />
      </SidebarContent>
      <SidebarFooter>
        <React.Suspense fallback={<NavUserSkeleton />}>
          <NavUser />
        </React.Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
