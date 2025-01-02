import type {
  Log,
  Product as PrismaProduct,
  ProductVersion,
  StockMovement,
  //   Supplier,
  //   User,
} from "@prisma/client";

export interface ProductTypes extends Omit<PrismaProduct, "current_version"> {
  current_version: ProductVersion | null;
  versions: ProductVersion[];
}

export interface LogTypes extends Omit<Log, "user" | "product" | "supplier"> {
  user: { name: string | null } | null;
  product: { name: string } | null;
  supplier: { name: string } | null;
}
export interface TransactionTypes
  extends Omit<StockMovement, "user" | "product" | "supplier"> {
  user: { name: string | null } | null;
}
