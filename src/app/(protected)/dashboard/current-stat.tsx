import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, Users } from "lucide-react";
// import {
//   BanknotesIcon,
//   ShoppingBagIcon,
//   CurrencyDollarIcon,
// } from "@heroicons/react/24/outline";
// import {
//   productCount,
//   totalStock,
//   supplierCount,
//   totalPurchase,
//   totalSale,
//   marketCap,
// } from "@/actions/analysis_stats";
import { Fragment } from "react";
import MoreInfo from "@/components/MoreInfo";
import {
  marketCap,
  productCount,
  supplierCount,
  totalStock,
} from "@/server/services/stats";

export default async function Stat() {
  const product_count = await productCount();
  const total_stock = await totalStock();
  const supplier_count = await supplierCount();
  // const total_purchase = await totalPurchase();
  // const total_sale = await totalSale();
  const stock_value = await marketCap();

  const data = [
    {
      title: "Stock Value",
      qty: `${stock_value}`,
      icon: DollarSign,
      span: "rwf",
      description: "Total value of all stock in Rwandan Francs",
    },
    {
      title: "Stock",
      qty: `${total_stock}`,
      icon: CreditCard,
      span: "items",
      description: "Total number of items currently in stock",
    },
    {
      title: "Products",
      qty: `${product_count}`,
      icon: DollarSign,
      span: "products",
      description: "Total number of different products available",
    },
    {
      title: "Suppliers",
      qty: `${supplier_count}`,
      icon: Users,
      span: "suppliers",
      description: "Total number of suppliers providing products",
    },
  ];

  return (
    <Fragment>
      {data.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="w-full flex flex-row justify-between  items-center gap-1.5 space-y-0 pb-2">
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
