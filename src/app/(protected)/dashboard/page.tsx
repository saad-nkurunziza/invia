import React from "react";
import TitleContainer from "@/components/containers/title-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrentStat from "./current-stat";
import { Card } from "@/components/ui/card";
import {
  getPurchaseStatistics,
  getSalesStatistics,
} from "@/server/services/chart-data";
import CompareStatDaily from "./daily-stat";
import CompareStatMonthly from "./monthly-stat";
import { Watchlists } from "./watchlist";
import RecentTransactions from "./recent-transactions";
import RecentLogs from "./recent-logs";
import MostSold from "./most-sold";

const page = async () => {
  const recent_sales_statistics = await getSalesStatistics();
  const recent_purchase_statistics = await getPurchaseStatistics();
  return (
    <div className="space-y-8 flex flex-col justify-center">
      <TitleContainer title="Your Stock Stats">
        <div className="bg-transparent border-none backdrop-blur-sm grid gap-2 md:grid-cols-4">
          <CurrentStat />
        </div>
      </TitleContainer>

      <TitleContainer title="Monthly Stats">
        <Tabs defaultValue="day">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <TabsContent value="day">
            <Card className="bg-transparent border-none backdrop-blur-sm grid gap-2 md:grid-cols-4">
              <CompareStatDaily />
            </Card>
          </TabsContent>
          <TabsContent value="month">
            <Card className="bg-transparent border-none backdrop-blur-sm grid gap-2 md:grid-cols-4">
              <CompareStatMonthly />
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
                <Watchlists
                  data={recent_sales_statistics.data || []}
                  title="Sales"
                />
              </TabsContent>
              <TabsContent value="purchase">
                <Watchlists
                  data={recent_purchase_statistics.data || []}
                  title="Purchases"
                />
              </TabsContent>
            </Tabs>
          </TitleContainer>
        </div>
      </div>
      <TitleContainer title="Recent entries">
        <div className="flex w-full gap-2">
          <div className="w-2/3">
            <RecentTransactions />
          </div>
          <div className="w-1/3">
            <MostSold />
          </div>
        </div>
        <RecentLogs />
      </TitleContainer>
    </div>
  );
};

export default page;
