"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// const chartData = [
//   { product: "Wireless Charger", sales: 186 },
//   { product: "Phone Handle", sales: 305 },
//   { product: "Xiaomi", sales: 237 },
// ];

const chartConfig = {
  stock: {
    label: "High Stock",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function Popular({
  products,
}: {
  products: { name: string; stock: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>High Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={products}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              //   tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="stock" fill="var(--color-stock)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
