import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RecentPurchases = ({ recentPurchases }: { recentPurchases: any }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Purchases</CardTitle>
          <CardDescription>Recent purchases from your store.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPurchases.map((item: any) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.productId}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">{item.qty}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.product.buying_price} rwf / unit
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentPurchases;
