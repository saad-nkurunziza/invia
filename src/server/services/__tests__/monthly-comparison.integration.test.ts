import { db } from "@/lib/db";
import { createTestContext } from "@/test/context";
import { profitsComparedToLastMonth } from "../monthly-comparision";

describe("Monthly Comparison Integration Tests", () => {
  let context: ReturnType<typeof createTestContext>;

  beforeAll(async () => {
    context = createTestContext();
    await context.setup();
  });

  afterAll(async () => {
    await context.teardown();
  });

  it("should compare profits between months", async () => {
    // Setup test data
    const testDate = new Date("2024-03-15");

    // Create a test product first
    const product = await db.product.create({
      data: {
        name: "Test Product",
        business_id: context.business.id,
        versions: {
          create: {
            name: "Test Version",
            version_id: "1",
            stock: 100,
            buying_price: 1000,
            selling_price: 2000,
            threshold: 10,
          },
        },
      },
      include: {
        versions: true,
      },
    });

    // Create test transactions
    await db.stockMovement.createMany({
      data: [
        // Last month's data
        {
          type: "IN",
          quantity: 10,
          business_id: context.business.id,
          user_id: context.user.id,
          product_id: product.id,
          created_at: new Date("2024-02-15"),
        },
        // This month's data
        {
          type: "OUT",
          quantity: 5,
          business_id: context.business.id,
          user_id: context.user.id,
          product_id: product.id,
          created_at: new Date("2024-03-10"),
        },
      ],
    });

    const result = await profitsComparedToLastMonth(testDate);

    expect(result.status).toBe("success");
    expect(result.data).toHaveProperty("current");
    expect(result.data).toHaveProperty("last");
    expect(typeof result.data?.current).toBe("number");
    expect(typeof result.data?.last).toBe("number");
  });
});
