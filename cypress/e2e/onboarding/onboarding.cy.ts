describe("Onboarding flow", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/onboarding");
  });

  it("renders onboarding screen", () => {
    cy.getByTestId("onboarding-screen").should("exist");
  });

  it("allows selecting an emotion and continuing", () => {
    cy.getByTestId("onboarding-emotion-happy").click();
    cy.getByTestId("onboarding-continue-button")
      .should("not.be.disabled")
      .click();

    cy.url({ timeout: 10000 }).should("not.include", "/onboarding");
  });
});
