describe("Journal", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/");

    cy.url({ timeout: 8000 }).should("include", "/onboarding");

    cy.getByTestId("onboarding-emotion-happy").click();
    cy.getByTestId("onboarding-continue-button").click();

    cy.visit("/journal");

    cy.url({ timeout: 5000 }).should("include", "/journal");
  });

  it("shows the journal screen", () => {
    cy.contains("Journal").should("be.visible");
  });
});
