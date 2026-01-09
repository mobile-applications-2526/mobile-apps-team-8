describe("Root redirect", () => {
  it("redirects unauthenticated user to login", () => {
    cy.logout();
    cy.visit("/");
    cy.url().should("include", "/login");
  });

  it("redirects authenticated user to onboarding", () => {
    cy.login();
    cy.visit("/");
    cy.url().should("include", "/onboarding");
  });
});
