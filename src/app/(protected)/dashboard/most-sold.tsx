import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  // CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMostSoldProducts } from "@/server/monthly-analysis/statements";

const MostSold = async () => {
  const most_sold_products = await getMostSoldProducts(new Date());
  if (!most_sold_products || !most_sold_products.data) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Most sold products</CardTitle>
          {/* <CardDescription>Most sold.</CardDescription> */}
        </div>
      </CardHeader>
      <CardContent className="grid gap-8">
        <Table>
          <TableHeader>
            <TableRow className="text-xs sm:text-base">
              <TableHead>Product</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Product A</TableCell>
              <TableCell>50</TableCell>
              <TableCell>$500</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MostSold;
