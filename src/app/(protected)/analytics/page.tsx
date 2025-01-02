import React from "react";
import Crumbs from "@/components/crumbs";
import Stat from "./stats";
import { MostAndLeastSoldProducts } from "./most&least";
import TitleContainer from "@/components/containers/TitleContainer";
import AnalyticTransactions from "./transactions";
import AnalyticLogs from "./logs";
import StockMarginStat from "./opening&closing";
import TimeShow from "./TimeShow";
import {
  getLeastSoldProduct,
  getMostSoldProduct,
} from "@/server/monthly-analysis/statements";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const crumbsLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Analytics" },
  ];
  const time_range = (searchParams.t as string) || "1";
  const timeRange = Number(time_range);
  const currentDate = new Date();

  let month = currentDate.getMonth();
  let year = currentDate.getFullYear();

  month -= timeRange;

  if (month < 0) {
    year -= 1;
    month += 12;
  }

  month += 1;
  const date = new Date(year, month - 1, 1);
  const mostSold = await getMostSoldProduct(date);
  const leastSold = await getLeastSoldProduct(date);
  if (
    !mostSold ||
    mostSold.status === "error" ||
    !mostSold.data ||
    !leastSold ||
    leastSold.status === "error" ||
    !leastSold.data
  )
    return null;
  return (
    <div className="flex min-h-screen gap-6 md:gap-8 p-2 md:p-4 sm:px-6 sm:py-0 w-full flex-col">
      <Crumbs crumbs={crumbsLinks} />
      <main className="grid flex-1 items-start gap-4 md:gap-8">
        <TimeShow month={month} year={year} />
        <TitleContainer title="Stock Value">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8">
            <StockMarginStat month={month} year={year} />
          </div>
        </TitleContainer>
        <TitleContainer title="Monthly activities">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Stat month={month} year={year} />
          </div>
        </TitleContainer>
        <TitleContainer title="Most and Least Sold Leaderboard">
          <div className="grid md:grid-cols-2 gap-4">
            <MostAndLeastSoldProducts
              mostSold={mostSold.data.mostSoldProduct}
              leastSold={leastSold.data.leastSoldProduct}
            />
          </div>
        </TitleContainer>
        <TitleContainer title="Transactions">
          <AnalyticTransactions month={month} year={year} />
        </TitleContainer>
        <TitleContainer title="Logs">
          <AnalyticLogs month={month} year={year} />
        </TitleContainer>
      </main>
    </div>
  );
};

export default page;
