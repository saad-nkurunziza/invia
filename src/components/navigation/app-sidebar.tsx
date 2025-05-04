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
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUtilities } from "./nav-utilities";
import { BusinessSwitcherSkeleton, NavUserSkeleton } from "../skeleton-loaders";
import { Currency } from "@prisma/client";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Reports",
          url: "/analytics",
        },
        {
          title: "Transactions",
          url: "/transactions",
        },
        {
          title: "Logs",
          url: "/logs",
        },
      ],
    },
    {
      title: "Inventory",
      url: "#",
      icon: Package,
      items: [
        {
          title: "Manage Suppliers",
          url: "/suppliers",
        },
        {
          title: "Manage Products",
          url: "/products",
        },
      ],
    },
    {
      title: "Operations",
      url: "#",
      icon: Layers,
      isActive: true,
      items: [
        {
          title: "New supplier",
          url: "/add-supplier",
        },
        {
          title: "New product",
          url: "/add-product",
        },
      ],
    },
    {
      title: "Stock Alerts",
      url: "#",
      icon: Database,
      items: [
        {
          title: "Low Stock",
          url: "/stock-alerts",
          icon: ShieldCheck,
        },
        {
          title: "Out of Stock",
          url: "/stock-alerts",
          icon: FileText,
        },
      ],
    },
  ],

  utilities: [
    {
      title: "AI Assistant",
      url: "/ai-assistant",
      icon: Bot,
    },
    {
      title: "Payment Portal",
      url: "/payment-portal",
      icon: CreditCard,
    },
    {
      title: "Task Scheduler",
      url: "/task-scheduler",
      icon: Calendar,
    },
    {
      title: "Financial Calculator",
      url: "/financial-calculator",
      icon: Calculator,
    },
    {
      title: "Preferences",
      url: "/preferences",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const businessInitialData = {
    user_id: "",
    business_id: "",
    join_date: new Date(),
    last_access: new Date(),
    deleted_at: null,
    business: {
      name: "string",
      deleted_at: new Date(),
      email: "string",
      id: "string",
      registration_number: "string",
      address: "",
      tel: "",
      currency: Currency.USD,
      created_at: new Date(),
      updated_at: new Date(),
    },
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <React.Suspense fallback={<BusinessSwitcherSkeleton />}>
          <BusinessSwitcher initialData={businessInitialData} />
        </React.Suspense>
      </SidebarHeader>
      <SidebarContent className="scrollbar-hide">
        <NavMain items={data.navMain} />
        <NavUtilities utilities={data.utilities} />
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
