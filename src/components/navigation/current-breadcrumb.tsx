"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight } from "lucide-react";

const ROUTE_NAMES = {
  dashboard: "Dashboard",
  products: "Products",
  suppliers: "Suppliers",
  customers: "Customers",
  sales: "Sales",
  purchases: "Purchases",
  analytics: "Analytics",
  settings: "Settings",
  profile: "Profile",
  add: "Add New",
  edit: "Edit",
};

export default function CurrentBreadcrumb() {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter((part) => part);

  const getReadableName = (part: string) => {
    if (ROUTE_NAMES[part as keyof typeof ROUTE_NAMES]) {
      return ROUTE_NAMES[part as keyof typeof ROUTE_NAMES];
    }
    return part
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (pathParts.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
        </BreadcrumbItem>

        {pathParts.map((part, index) => {
          const href = `/${pathParts.slice(0, index + 1).join("/")}`;
          const isLast = index === pathParts.length - 1;
          const readableName = getReadableName(part);

          return (
            <BreadcrumbItem key={href}>
              {!isLast ? (
                <>
                  <BreadcrumbLink href={href}>{readableName}</BreadcrumbLink>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                </>
              ) : (
                <BreadcrumbPage>{readableName}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}

        {pathParts.length > 3 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Show more</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {pathParts.slice(1, -2).map((part) => (
                    <DropdownMenuItem key={part} asChild>
                      <Link href={`/${part}`}>{getReadableName(part)}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
