import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { Fragment } from "react";

import { Package } from "lucide-react";
import {
  BanknotesIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import {
  profitsComparedToLastDay,
  revenueComparedToLastDay,
  salesComparedToLastDay,
  stockComparedToLastDay,
} from "@/server/services/daily-comparision";

const CompareStatDaily = async () => {
  const dailyStockData = await stockComparedToLastDay();
  const dailyRevenueData = await revenueComparedToLastDay();
  const dailySalesData = await salesComparedToLastDay();
  const dailyProfitData = await profitsComparedToLastDay();

  const currentDayStock = dailyStockData?.data?.current;
  const lastDayStock = dailyStockData?.data?.last;

  const currentDayRevenue = dailyRevenueData?.data?.current;
  const lastDayRevenue = dailyRevenueData?.data?.last;

  const currentDaySales = dailySalesData?.data?.current;
  const lastDaySales = dailySalesData?.data?.last;

  const currentDayProfit = dailyProfitData?.data?.current;
  const lastDayProfit = dailyProfitData?.data?.last;

  if (
    currentDayStock === undefined ||
    lastDayStock === undefined ||
    currentDayRevenue === undefined ||
    lastDayRevenue === undefined ||
    currentDaySales === undefined ||
    lastDaySales === undefined ||
    currentDayProfit === undefined ||
    lastDayProfit === undefined
  ) {
    return null;
  }

  const calculatePercentageIncrease = (current: number, last: number) => {
    if (last === 0) return 0;
    return ((current - last) / last) * 100;
  };

  const percentageIncreaseInStock = calculatePercentageIncrease(
    currentDayStock,
    lastDayStock
  );
  const percentageIncreaseInRevenue = calculatePercentageIncrease(
    currentDayRevenue,
    lastDayRevenue
  );
  const percentageIncreaseInSales = calculatePercentageIncrease(
    currentDaySales,
    lastDaySales
  );
  const percentageIncreaseInProfits = calculatePercentageIncrease(
    currentDayProfit,
    lastDayProfit
  );

  const stats = [
    {
      title: "Daily Sales",
      qty: currentDaySales,
      icon: ShoppingBagIcon,
      increase: percentageIncreaseInSales.toFixed(2),
      span: "products",
    },
    {
      title: "Daily Stock Value",
      qty: currentDayStock,
      icon: Package,
      increase: percentageIncreaseInStock.toFixed(2),
      span: "rwf",
    },
    {
      title: "Daily Revenue Income",
      qty: currentDayRevenue,
      icon: BanknotesIcon,
      increase: percentageIncreaseInRevenue.toFixed(2),
      span: "rwf",
    },
    {
      title: "Daily Profit Earned",
      qty: currentDayProfit,
      icon: CurrencyDollarIcon,
      increase: percentageIncreaseInProfits.toFixed(2),
      span: "rwf",
    },
  ];

  const getColorAndIcon = (increase: string) => {
    const percentageIncrease = parseFloat(increase);

    return percentageIncrease > 0
      ? { color: "text-emerald-500", Icon: ArrowTrendingUpIcon }
      : percentageIncrease < 0
      ? { color: "text-muted-foreground", Icon: ArrowTrendingDownIcon }
      : { color: "text-gray-500", Icon: ArrowsRightLeftIcon };
  };

  return (
    <Fragment>
      {stats.map((stat, i) => {
        const { color, Icon } = getColorAndIcon(stat.increase);

        return (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center gap-1.5 space-y-0 pb-2">
              <stat.icon className="md:h-4 h-3.5 w-3.5 md:w-4 text-muted-foreground" />
              <CardTitle className="text-xs whitespace-nowrap md:text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-2xl flex flex-col md:flex-row font-bold">
                {stat.qty}{" "}
                <span className="font-normal md:self-end text-muted-foreground text-xs md:text-sm">
                  {" "}
                  /{stat.span}
                </span>
              </div>
              <div
                className={`text-[10px] md:text-xs mt-1 ${color} flex items-center`}
              >
                {Icon && <Icon className="h-4 w-4 mr-1" />}

                {stat.increase === "-100.00" || stat.increase === "100.00"
                  ? "No entries today"
                  : `${Math.abs(parseFloat(stat.increase)).toFixed(2)}%${
                      stat.increase !== "0.00" ? " from yesterday" : ""
                    }`}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </Fragment>
  );
};

export default CompareStatDaily;
