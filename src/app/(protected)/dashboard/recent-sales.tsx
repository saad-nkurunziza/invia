import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RecentSales = ({ recentSales }: { recentSales: any }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Recent sales from your store.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.map((item: any) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.Product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.productId}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">{item.qty}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.Product.selling_price} rwf / unit
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

export default RecentSales;
