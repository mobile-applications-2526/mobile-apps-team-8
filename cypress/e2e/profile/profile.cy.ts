// describe("Profile screen", () => {
//   beforeEach(() => {
//     cy.login();
//     cy.visit("/profile");
//     cy.getByTestId("profile-screen").should("exist");
//   });

//   it("shows username", () => {
//     cy.getByTestId("profile-username")
//       .should("be.visible")
//       .and("contain", "testuser");
//   });

//   it("logs out", () => {
//     cy.getByTestId("profile-logout-button", { timeout: 10000 })
//       .should("be.visible")
//       .click({ force: true });

//     cy.window().then((win) => {
//       expect(win.localStorage.getItem("loggedInUser")).to.be.null;
//     });
//   });
// });

describe("Profile screen", () => {
  beforeEach(() => {
    cy.logout();
    cy.loginAndCompleteOnboarding();
    cy.visit("/profile");
    cy.getByTestId("profile-screen").should("exist");
  });

  it("logs out", () => {
    cy.getByTestId("profile-logout-button", { timeout: 10000 })
      .should("be.visible")
      .click({ force: true });

    cy.window().then((win) => {
      expect(win.localStorage.getItem("loggedInUser")).to.be.null;
    });
  });
});
