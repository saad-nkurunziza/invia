import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, DollarSign, ShoppingCart, CreditCard } from "lucide-react";
import { Fragment } from "react";
import MoreInfo from "@/components/MoreInfo";
import {
  calculateMonthPurchaseValue,
  getPurchaseCount,
} from "@/server/monthly-analysis/purchase";
import {
  getSaleCount,
  calculateMonthSalesValue,
} from "@/server/monthly-analysis/sales";

export default async function Stat({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const date = new Date(year, month - 1, 1);
  const purchaseCount = await getPurchaseCount(date);
  const purchaseValue = await calculateMonthPurchaseValue(date);
  const saleCount = await getSaleCount(date);
  const saleValue = await calculateMonthSalesValue(date);

  if (
    !purchaseCount ||
    !purchaseValue ||
    purchaseCount.status === "error" ||
    !purchaseCount.data ||
    purchaseValue.status === "error" ||
    !purchaseValue.data ||
    !saleCount ||
    !saleValue ||
    saleCount.status === "error" ||
    !saleCount.data ||
    !saleCount ||
    !saleValue ||
    saleValue.status === "error" ||
    !saleValue.data
  )
    return null;
  const data = [
    {
      title: "Purchase Times",
      qty: `${purchaseCount.data}`,
      icon: ListChecks,
      span: "times",
      description: "The total number of purchase transactions made this month.",
    },
    {
      title: "Purchase Value",
      qty: `${purchaseValue.data}`,
      icon: DollarSign,
      span: "RWF",
      description:
        "The total amount spent on purchases this month, in Rwandan Francs (RWF).",
    },
    {
      title: "Sales Times",
      qty: `${saleCount.data}`,
      icon: ShoppingCart,
      span: "times",
      description: "The total number of sales transactions made this month.",
    },
    {
      title: "Sales Value",
      qty: `${saleValue.data}`,
      icon: CreditCard,
      span: "RWF",
      description:
        "The total revenue generated from sales this month, in Rwandan Francs (RWF).",
    },
  ];

  return (
    <Fragment>
      {data.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="w-full flex flex-row justify-between  items-center gap-1.5 space-y-0 pb-2">
            <div className="flex gap-1.5">
              <stat.icon className="md:h-4 h-3.5 w-3.5 md:w-4 text-muted-foreground" />
              <CardTitle className="text-xs md:text-sm font-medium">
                {stat.title}
              </CardTitle>
            </div>
            <div className="ml-auto hidden md:flex">
              <MoreInfo>{stat.description}</MoreInfo>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl flex flex-col md:flex-row font-bold">
              {stat.qty}{" "}
              <span className="font-normal md:self-end text-muted-foreground text-xs md:text-sm">
                {" "}
                /{stat.span}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </Fragment>
  );
}
