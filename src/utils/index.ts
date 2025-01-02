import { Prisma } from "@prisma/client";
import type { Currency } from "@prisma/client";

export const formatPrice = (
  price: Prisma.Decimal | string | number,
  currency: Currency = "USD",
  options?: {
    notation?: "compact" | "standard";
    showSymbol?: boolean;
  }
) => {
  const numericPrice = Number(price);

  const getCurrencyConfig = (
    curr: Currency
  ): Partial<Intl.NumberFormatOptions> => {
    switch (curr) {
      case "RWF":
        return {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        };
      case "USD":
      case "EUR":
      case "GBP":
      default:
        return {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        };
    }
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: options?.showSymbol === false ? "decimal" : "currency",
    currency: currency,
    notation: options?.notation || "standard",
    ...getCurrencyConfig(currency),
  });

  // Round RWF to nearest whole number
  const finalPrice =
    currency === "RWF" ? Math.round(numericPrice) : numericPrice;

  return formatter.format(finalPrice);
};

// Usage examples:
/*
formatPrice(1000.50, 'RWF')                    // "RWF 1,001"
formatPrice(1000.50, 'RWF', { showSymbol: false }) // "1,001"
formatPrice(10.99, 'USD')                      // "$10.99"
formatPrice(1000000, 'EUR', { notation: 'compact' }) // "€1M"
formatPrice(25.99, 'GBP', { showSymbol: false })    // "25.99"
*/
