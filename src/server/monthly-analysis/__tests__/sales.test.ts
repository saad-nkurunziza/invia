import { calculateMonthSalesValue } from "../sales";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/server/auth";

// Mock dependencies
jest.mock("@/lib/db");
jest.mock("@/server/auth");

describe("calculateMonthSalesValue", () => {
  const mockUser = {
    id: "test-user-id",
    businessId: "test-business-id",
  };

  const mockProducts = [
    {
      quantity: 5,
      product: {
        versions: [{ selling_price: "100" }],
      },
    },
    {
      quantity: 3,
      product: {
        versions: [{ selling_price: "150" }],
      },
    },
  ];

  beforeEach(() => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(mockUser);
    (db.stockMovement.findMany as jest.Mock).mockResolvedValue(mockProducts);
  });

  it("should calculate monthly sales value correctly", async () => {
    const result = await calculateMonthSalesValue(new Date());

    expect(result).toEqual({
      status: "success",
      msg: "Purchase stock value calculated successfully",
      data: 950, // (5 * 100) + (3 * 150)
    });
  });

  it("should handle authentication error", async () => {
    (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

    const result = await calculateMonthSalesValue(new Date());

    expect(result).toEqual({
      status: "error",
      msg: "User not authenticated",
    });
  });
});
