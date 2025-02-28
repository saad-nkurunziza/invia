import { db } from "@/lib/db";

export function createTestContext() {
  const context = {
    business: null as any,
    user: null as any,
    async setup() {
      // Create test business
      this.business = await db.business.create({
        data: {
          name: "Test Business",
          email: "test@business.com",
          registration_number: "TEST123",
          address: "Test Address",
          tel: "1234567890",
        },
      });

      // Create test user
      this.user = await db.user.create({
        data: {
          name: "Test User",
          email: "test@user.com",
          businesses: {
            create: {
              business_id: this.business.id,
            },
          },
        },
      });
    },
    async teardown() {
      await db.user.deleteMany();
      await db.business.deleteMany();
    },
  };

  return context;
}
