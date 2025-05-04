import React, { Fragment } from "react";
import { Star, XCircle } from "lucide-react";

interface CardProps {
  title: string;
  product: string;
  icon: React.ReactNode;
  qty: number;
  span: string;
  description: string;
}

const Card: React.FC<CardProps> = ({
  title,
  product,
  icon,
  qty,
  span,
  description,
}) => {
  return (
    <div className="bg-card border shadow-md rounded-lg p-6 w-full">
      <div className="flex items-center">
        <div className="shrink-0">{icon}</div>
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-muted-foreground">{span}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className=" font-bold text-foreground/80">{product}</p>
        <p className="text-sm text-muted-foreground">{qty} units sold</p>
        <p className="mt-2 text-muted-foreground/80">{description}</p>
      </div>
    </div>
  );
};

interface ProductData {
  productName: string;
  qty: number;
}

interface MostAndLeastSoldProductsProps {
  mostSold: ProductData;
  leastSold: ProductData;
}

export const MostAndLeastSoldProducts: React.FC<
  MostAndLeastSoldProductsProps
> = ({ mostSold, leastSold }) => {
  return (
    <Fragment>
      <Card
        title="Most Sold Product"
        product={mostSold.productName}
        icon={<Star className="h-7 w-7 text-yellow-500" />}
        qty={mostSold.qty}
        span="Top seller this month"
        description="This is the product with the highest number of units sold this month."
      />

      <Card
        title="Least Sold Product"
        product={leastSold.productName}
        icon={<XCircle className="h-7 w-7 text-red-500" />}
        qty={leastSold.qty}
        span="Lowest seller this month"
        description="This is the product with the lowest number of units sold this month."
      />
    </Fragment>
  );
};
