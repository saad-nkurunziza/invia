import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { Fragment } from "react";
// import {
//   stockComparedToLastMonth,
//   revenueComparedToLastMonth,
//   salesComparedToLastMonth,
//   profitsComparedToLastMonth,
// } from "@/actions/analysis_stats";
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
  profitsComparedToLastMonth,
  revenueComparedToLastMonth,
  salesComparedToLastMonth,
  stockComparedToLastMonth,
} from "@/server/services/monthly-comparision";
const CompareStat = async () => {
  const { currentMonthStock, lastMonthStock } =
    await stockComparedToLastMonth();
  const { currentMonthRevenue, lastMonthRevenue } =
    await revenueComparedToLastMonth();
  const { currentMonthSales, lastMonthSales } =
    await salesComparedToLastMonth();
  const { currentMonthProfit, lastMonthProfit } =
    await profitsComparedToLastMonth();
  if (
    !currentMonthStock ||
    !lastMonthStock ||
    !currentMonthRevenue ||
    !lastMonthRevenue ||
    !currentMonthSales ||
    !lastMonthSales ||
    !currentMonthProfit ||
    !lastMonthProfit
  )
    return null;
  const calculatePercentageIncrease = (current: number, last: number) => {
    if (last === 0) return 0;
    return ((current - last) / last) * 100;
  };

  const percentageIncreaseInStock = calculatePercentageIncrease(
    currentMonthStock,
    lastMonthStock
  );
  const percentageIncreaseInRevenue = calculatePercentageIncrease(
    currentMonthRevenue,
    lastMonthRevenue
  );
  const percentageIncreaseInSales = calculatePercentageIncrease(
    currentMonthSales,
    lastMonthSales
  );
  const percentageIncreaseInProfits = calculatePercentageIncrease(
    currentMonthProfit,
    lastMonthProfit
  );

  const stats = [
    {
      title: "Product Sales",
      qty: currentMonthSales,
      icon: ShoppingBagIcon,
      increase: percentageIncreaseInSales.toFixed(2),
      span: "products",
    },
    {
      title: "Stock Value",
      qty: currentMonthStock,
      icon: Package,
      increase: percentageIncreaseInStock.toFixed(2),
      span: "rwf",
    },
    {
      title: "Revenue Income",
      qty: currentMonthRevenue,
      icon: BanknotesIcon,
      increase: percentageIncreaseInRevenue.toFixed(2),
      span: "rwf",
    },
    {
      title: "Profit Earned",
      qty: currentMonthProfit,
      icon: CurrencyDollarIcon,
      increase: percentageIncreaseInProfits.toFixed(2),
      span: "rwf",
    },
  ];

  const getColorAndIcon = (increase: string) => {
    const percentageIncrease = parseFloat(increase);

    return percentageIncrease > 0
      ? { color: "text-green-500", Icon: ArrowTrendingUpIcon }
      : percentageIncrease < 0
      ? { color: "text-red-500", Icon: ArrowTrendingDownIcon }
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
              <div className={`text-[10px] md:text-xs mt-1 ${color} flex`}>
                {Icon && <Icon className="h-4 w-4 mr-1" />}
                {`${Math.abs(parseFloat(stat.increase)).toFixed(2)}%${
                  stat.increase !== "0.00" ? " from last month" : ""
                }`}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </Fragment>
  );
};

export default CompareStat;
