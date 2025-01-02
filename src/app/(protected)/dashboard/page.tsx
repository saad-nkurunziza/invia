import React from "react";

import TitleContainer from "@/components/containers/TitleContainer";
import { Watchlists } from "./watchlist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import LowStock from "./low-stock-chart";
// import HighStock from "./high-stock";
// import MostSales from "./most-sales";
// import RecentSales from "./recent-sales";
// import RecentPurchases from "./recent-purchases";
import CompareStat from "./compare-stat";
import CurrentStat from "./current-stat";
import { Card } from "@/components/ui/card";
// import DetailsCard from "@/components/DetailsCard";
import CompareStatDaily from "./day-stat";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
import {
  getPurchaseStatistics,
  getSalesStatistics,
} from "@/server/services/chart-data";
import { getMostSoldProduct } from "@/server/monthly-analysis/statements";

const page = async () => {
  const recent_sales_statistics = await getSalesStatistics();
  const recent_purchase_statistics = await getPurchaseStatistics();
  // const recent_sales = await recentSales();
  // const recent_purchases = await recentPurchases();
  const most_sold_product = await getMostSoldProduct(new Date());
  console.log({
    most_sold_product,
    recent_sales_statistics,
    recent_purchase_statistics,
  });

  if (
    !recent_sales_statistics ||
    !recent_sales_statistics.data ||
    recent_sales_statistics.status === "error" ||
    !recent_purchase_statistics ||
    !recent_purchase_statistics.data ||
    recent_purchase_statistics.status === "error"
  )
    return null;

  return (
    <div className="space-y-8 flex flex-col justify-center">
      <TitleContainer title="Your Stock Stats">
        <Card className="bg-transparent border-none backdrop-blur grid gap-2 md:grid-cols-4">
          <CurrentStat />
        </Card>
      </TitleContainer>

      <TitleContainer title="Monthly Stats">
        <Tabs defaultValue="day">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <TabsContent value="day">
            <Card className="bg-transparent border-none backdrop-blur grid gap-2 md:grid-cols-4">
              <CompareStatDaily />
            </Card>
          </TabsContent>
          <TabsContent value="month">
            <Card className="bg-transparent border-none backdrop-blur grid gap-2 md:grid-cols-4">
              <CompareStat />
            </Card>
          </TabsContent>
        </Tabs>
      </TitleContainer>

      <div className="hidden md:grid md:grid-cols-3 grid-cols-1 gap-6">
        <div className="col-span-3">
          <TitleContainer title="Stock Watchlists">
            <Tabs defaultValue="sale">
              <TabsList>
                <TabsTrigger value="sale">Sales</TabsTrigger>
                <TabsTrigger value="purchase">Purchases</TabsTrigger>
              </TabsList>
              <TabsContent value="sale">
                <Watchlists data={recent_sales_statistics.data} title="Sales" />
              </TabsContent>
              <TabsContent value="purchase">
                <Watchlists
                  data={recent_purchase_statistics.data}
                  title="Purchases"
                />
              </TabsContent>
            </Tabs>
          </TitleContainer>
        </div>
      </div>

      {/* <div className="grid flex-1 items-start gap-4 md:gap-8">
            <TitleContainer title="Transaction Stats">
              <Tabs defaultValue="graph">
                <TabsList className="mr-auto">
                  <TabsTrigger value="graph">Graph</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-3 items-start">
                    <DetailsCard
                      products={low_stock_products}
                      title="Low Stock Items"
                      sub_header="These products are running low and may need restocking soon."
                    />

                    <DetailsCard
                      products={high_stock_products}
                      title="High Stock Items"
                      sub_header="These products have the highest stock levels."
                    />
                    <DetailsCard
                     
                      products={most_sales_products}
                      title="Top Selling Products"
                      sub_header="These products have the highest sales figures."
                    />
                  </div>
                </TabsContent>
                <TabsContent value="graph">
                  <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-3">
                    <LowStock products={low_stock_products} />
                    <HighStock products={high_stock_products} />
                    <MostSales products={most_sales_products} />
                  </div>
                </TabsContent>
              </Tabs>
            </TitleContainer>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-2 items-start">
              <RecentPurchases recentPurchases={recent_purchases} />
              <RecentSales recentSales={recent_sales} />
            </div>
          </div>
    </Fragment>
 
      <div className="flex flex-1 h-full p-5 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Welcome to the stock
          </h3>
          <p className="text-sm text-muted-foreground">
            You can start selling as soon as you add a product.
          </p>
          <div className="flex gap-1 md:gap-4 mt-4">
            <Button size="sm" className="mt-4" asChild>
              <Link href="/features">Check out features</Link>
            </Button>
            <Button size="sm" className="mt-4" asChild>
              <Link href="/add-product">Add Product</Link>
            </Button>
            <Button size="sm" className="mt-4" asChild>
              <Link href="/add-supplier">Add Supplier</Link>
            </Button>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default page;
