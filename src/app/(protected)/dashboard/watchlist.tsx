"use client";


import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";

export function Watchlists({
  data,
  title,
}: {
  data: { date: string; value: number; name: string }[];
  title: string;
}) {
  const [timeRange, setTimeRange] = useState("3m");
  const chartConfig = {

    product: {
      label: "Product",
    },
    value: {
      label: `${title} value`,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title} over time range</CardTitle>
        </div>
        <ToggleGroup
          type="single"
          size="sm"
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <ToggleGroupItem value="3m" aria-label="Toggle 3 months">
            <span>3 months</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="30d" aria-label="Toggle 30 days">
            <span>30 days</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="7d" aria-label="Toggle 7 days">
            <span>7 days</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <CardDescription className="my-1">
          Showing{" "}
          {title
            .split(" ")
            .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
            .join(" ")}{" "}
          transactions for the last {timeRange}
        </CardDescription>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillData" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillData)"
              stroke="var(--color-value)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
