describe("Monthly Analysis", () => {
  beforeEach(() => {
    cy.login(); // Custom command for authentication
    cy.visit("/dashboard/monthly-analysis");
  });

  it("should display monthly sales data", () => {
    cy.intercept("GET", "/api/monthly-analysis/sales*", {
      statusCode: 200,
      body: {
        status: "success",
        data: {
          salesValue: 25000,
          count: 50,
        },
      },
    }).as("getSales");

    cy.wait("@getSales");
    cy.get('[data-testid="sales-value"]').should("contain", "25,000");
    cy.get('[data-testid="sales-count"]').should("contain", "50");
  });

  it("should handle error states", () => {
    cy.intercept("GET", "/api/monthly-analysis/sales*", {
      statusCode: 500,
      body: {
        status: "error",
        msg: "Internal server error",
      },
    }).as("getSalesError");

    cy.wait("@getSalesError");
    cy.get('[data-testid="error-message"]').should("be.visible");
  });
});
