import { http, HttpResponse } from "msw";

// Define interfaces for the response types
interface MonthlyStockResponse {
  status: "success";
  data: {
    value: number;
    created_at: string;
  };
}

interface MonthlySalesResponse {
  status: "success";
  data: {
    salesValue: number;
    count: number;
  };
}

export const handlers = [
  // Mock monthly stock value
  http.get("/api/analysis/monthly-stock", () => {
    return HttpResponse.json({
      status: "success",
      data: {
        value: 50000,
        created_at: new Date().toISOString(),
      },
    } as MonthlyStockResponse);
  }),

  // Mock sales data
  http.get("/api/monthly-analysis/sales", () => {
    return HttpResponse.json({
      status: "success",
      data: {
        salesValue: 25000,
        count: 50,
      },
    } as MonthlySalesResponse);
  }),
];
