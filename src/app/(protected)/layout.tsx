import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import React, { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";
import { integrateMonthlyStockValue } from "@/server/input/analysis";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SessionProvider } from "next-auth/react";
// import { cookies } from "next/headers";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import QuickAccessIconButton from "@/components/quick-access/icon-button";
import CurrentBreadcrumb from "@/components/navigation/current-breadcrumb";
import TransactionContainer from "@/components/transaction-container";
import { Button } from "@/components/ui/button";
import { FlipHorizontal, FlipVertical, Settings } from "lucide-react";
import { SettingsDialog } from "@/components/settings/settings-dialog";

export const metadata: Metadata = {
  title: "Invia",
};

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();
  if (!session || !session.user || !session.user.businessId) {
    redirect("/onboarding");
  }
  await integrateMonthlyStockValue();
  // const cookieStore = await cookies();
  // const sidebarState = cookieStore.get("sidebar:state")?.value || "true";
  // console.log({ sidebarState });
  // // const defaultOpen = sidebarState === "true" ? true : false;
  // const sidebarSide =
  //   (cookieStore.get("sidebar:side")?.value as NavigationSettings["side"]) ||
  //   "left";
  // const sidebarVariant =
  //   (cookieStore.get("sidebar:variant")
  //     ?.value as NavigationSettings["variant"]) || "sidebar";
  // const sidebarCollapsible =
  //   (cookieStore.get("sidebar:collapsible")
  //     ?.value as NavigationSettings["collapsible"]) || "offcanvas";
  return (
    <SessionProvider>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 ">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <CurrentBreadcrumb />
            </div>
            <div className="flex gap-4 ml-auto">
              <SettingsDialog>
                <Button
                  className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                  variant="outline"
                  size="icon"
                  aria-label="Flip Horizontal"
                >
                  <Settings size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </SettingsDialog>
              <div className="inline-flex -space-x-px rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse">
                <TransactionContainer tag="sale">
                  <Button
                    className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                    variant="outline"
                    size="icon"
                    aria-label="Flip Horizontal"
                  >
                    <FlipHorizontal
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Button>
                </TransactionContainer>
                <TransactionContainer tag="purchase">
                  <Button
                    className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                    variant="outline"
                    size="icon"
                    aria-label="Flip Vertical"
                  >
                    <FlipVertical
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Button>
                </TransactionContainer>
              </div>
              <QuickAccessIconButton />
            </div>
          </header>
          <div className="select-none flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </SessionProvider>
  );
}
