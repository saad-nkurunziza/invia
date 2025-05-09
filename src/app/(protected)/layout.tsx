import React, { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import QuickAccessIconButton from "@/components/quick-access/icon-button";
import CurrentBreadcrumb from "@/components/navigation/current-breadcrumb";
import TransactionContainer from "@/components/transaction-container";
import { Button } from "@/components/ui/button";
import { FlipHorizontal, FlipVertical } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const SidebarWrapper = React.memo(function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
});

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) {
    redirect("/sign-in");
  } else if (!session.user.businessId) {
    redirect("/onboarding");
  } else {
    return (
      <SidebarWrapper>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center px-4 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 ">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <CurrentBreadcrumb />
            </div>
            <div className="flex gap-4 ml-auto">
              <div className="inline-flex -space-x-px rounded-lg shadow-xs shadow-black/5 rtl:space-x-reverse">
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
          <div className="select-none relative flex flex-1 flex-col gap-4 p-4 pt-7">
            {children}
          </div>
        </SidebarInset>
        <Toaster />
      </SidebarWrapper>
    );
  }
}
