import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightCircle, ArrowLeftCircle } from "lucide-react";
import { Fragment } from "react";
import MoreInfo from "@/components/more-info";
import { getOpeningClosingStockValues } from "@/server/monthly-analysis/statements";

export default async function StockMarginStat({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const date = new Date(year, month - 1, 1);
  const res = await getOpeningClosingStockValues(date);
  if (!res || res.status === "error" || !res.data) return null;
  const { openingValue, closingValue } = res.data;
  const data = [
    {
      title: "Opening Stock",
      qty: `${openingValue.toFixed(2)}`,
      icon: ArrowRightCircle,
      span: "RWF",
      description:
        "The total value of stock at the beginning of the month in Rwandan Francs (RWF).",
    },
    {
      title: "Closing Stock",
      qty: `${closingValue.toFixed(2)}`,
      icon: ArrowLeftCircle,
      span: "RWF",
      description:
        "The total value of stock or sold by the end of the month in Rwandan Francs (RWF).",
    },
  ];

  return (
    <Fragment>
      {data.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="w-full flex flex-row justify-between items-center gap-1.5 space-y-0 pb-2">
            <div className="flex gap-1.5 items-center">
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
