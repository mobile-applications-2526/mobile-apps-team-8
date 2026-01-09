describe("Profile screen", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/profile");
  });

  it("shows username", () => {
    cy.getByTestId("profile-username", { timeout: 10000 })
      .should("be.visible")
      .and("contain", "testuser");
  });

  it("logs out", () => {
    cy.getByTestId("profile-logout-button").should("be.visible").as("logout");

    cy.get("@logout").click();

    cy.url({ timeout: 10000 }).should("include", "/login");
  });
});
