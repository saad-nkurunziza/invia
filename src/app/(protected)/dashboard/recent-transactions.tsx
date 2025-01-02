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
import { fetchSliceTransactions } from "@/server/query/transactions";
import { formatPrice } from "@/utils/index";

const RecentTransactions = async () => {
  const recent_transactions = await fetchSliceTransactions();
  if (
    !recent_transactions ||
    !recent_transactions.data ||
    recent_transactions.data.length === 0
  )
    return null;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Sales</CardTitle>
          {/* <CardDescription>Recent sales from your store.</CardDescription> */}
        </div>
      </CardHeader>
      <CardContent className="grid gap-8">
        <Table>
          <TableHeader>
            <TableRow className="text-xs sm:text-base">
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent_transactions.data.map((item) => {
              const selling_price =
                item.product.current_version?.selling_price || 0;
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.product_id}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">{item.quantity}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatPrice(selling_price)}
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

export default RecentTransactions;
