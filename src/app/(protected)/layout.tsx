import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import React, { ReactNode } from "react";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import Search from "@/components/Search";
import BottomNav from "@/components/bottombar";
import NewCircleArea from "@/components/NewCircleArea";
import Navbar from "@/components/Nav";
import { redirect } from "next/navigation";
import { fetchPreferences } from "@/server/query/preference";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { fetchProducts } from "@/server/query/products";
import { lowStockCount } from "@/server/services/stats";
import { integrateMonthlyStockValue } from "@/server/input/analysis";

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

  const products = await fetchProducts();
  const low_stock_count = await lowStockCount();

  const settings = await fetchPreferences();

  const initial_stock_name =
    settings.data!.find((p) => p.key === "stock_name")?.value || "Invia";

  await integrateMonthlyStockValue();

  return (
    <div>
      <header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-[48] w-full bg-aside border-b text-sm py-2.5 lg:ps-[260px]">
        <nav className="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
          <div className="me-5 lg:me-0 lg:hidden">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="capitalize">{initial_stock_name}</span>
            </Link>
          </div>
          <div className="w-full flex items-center justify-end ms-auto md:justify-between gap-x-1 md:gap-x-3">
            <div className="">
              <Search />
            </div>

            <div className="flex flex-row items-center justify-end gap-1">
              <NewCircleArea products={products.data!} />
              <UserProfileDropdown
                name={session.user.name ?? ""}
                email={session.user.email ?? ""}
                role={session.user.role ?? "WORKER"}
              />
            </div>
          </div>
        </nav>
      </header>

      <div className="w-[260px] h-full hidden fixed inset-y-0 start-0 z-[48] bg-aside border-e lg:block lg:translate-x-0 lg:end-auto lg:bottom-0">
        <div className="relative flex flex-col h-full max-h-full">
          <div className="px-6 hidden md:block pt-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="">{initial_stock_name}</span>
            </Link>
          </div>
          <div className="h-full overflow-y-auto">
            <nav className="p-3 w-full flex flex-col flex-wrap">
              <ul className="flex flex-col space-y-1">
                <Navbar
                  products={products.data!}
                  low_stock_count={low_stock_count.data!}
                />
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <main className="w-full pb-16 pt-4 md:pb-0 md:pt-0 lg:ps-64">
        <div className="p-4 mx-auto sm:p-6 space-y-4 sm:space-y-6">
          {children}
        </div>
      </main>
      <BottomNav />
      <Toaster />
    </div>
  );
}
