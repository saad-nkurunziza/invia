import React from "react";
import Crumbs from "@/components/crumbs";
import Stat from "./stats";
// import { MostAndLeastSoldProducts } from "./most&least";
import TitleContainer from "@/components/containers/title-container";
import AnalyticTransactions from "./transactions";
import AnalyticLogs from "./logs";
import StockMarginStat from "./opening&closing";
import TimeShow from "./time-show";
// import {
//   getLeastSoldProduct,
//   getMostSoldProducts,
// } from "@/server/monthly-analysis/statements";

const page = async (props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const searchParams = await props.searchParams;
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
  // const date = new Date(year, month - 1, 1);
  // const mostSold = await getMostSoldProducts(date);
  // const leastSold = await getLeastSoldProduct(date);
  // if (
  //   !mostSold ||
  //   mostSold.status === "error" ||
  //   !mostSold.data ||
  //   !leastSold ||
  //   leastSold.status === "error" ||
  //   !leastSold.data
  // )
  //   return null;
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
        {/* {mostSold.data ? <TitleContainer title="Most and Least Sold Leaderboard">
          <div className="grid md:grid-cols-2 gap-4">
            <MostAndLeastSoldProducts
              mostSold={mostSold.data}
              leastSold={leastSold.data.leastSoldProduct}
            />
          </div>
        </TitleContainer> : null} */}
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
