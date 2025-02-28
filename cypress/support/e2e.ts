import "@testing-library/cypress/add-commands";

// Custom command for authentication
Cypress.Commands.add("login", () => {
  // Implement your login logic here
  cy.session("authenticated", () => {
    // Example: API call to login
    cy.request("POST", "/api/auth/signin", {
      email: "test@example.com",
      password: "password",
    });
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}
