// describe("Signup via onboarding flow", () => {
//   it("completes onboarding and signs up", () => {
//     const ts = Date.now();

//     cy.intercept("POST", "**/register**", {
//       statusCode: 201,
//       body: { message: "User created" },
//     }).as("register");

//     cy.intercept("POST", "**/login**", {
//       statusCode: 200,
//       body: {
//         token: "test-token",
//         username: `user${ts}`,
//         email: `user${ts}@test.com`,
//       },
//     }).as("loginAfterSignup");

//     // 1️⃣ Zelfde setup als onboarding test
//     cy.login();
//     cy.visit("/onboarding");

//     // 2️⃣ Onboarding werkt (bewezen)
//     cy.getByTestId("onboarding-screen").should("exist");

//     cy.getByTestId("onboarding-emotion-happy").click();
//     cy.getByTestId("onboarding-continue-button")
//       .should("not.be.disabled")
//       .click();

//     // 3️⃣ Ga nu naar signup (zoals echte user)
//     cy.visit("/signup");

//     cy.getByTestId("signup-username-input").type(`user${ts}`);
//     cy.getByTestId("signup-email-input").type(`user${ts}@test.com`);
//     cy.getByTestId("signup-password-input").type("password123");

//     cy.getByTestId("signup-submit-button").click();

//     cy.wait("@register");
//     cy.wait("@loginAfterSignup");

//     // 4️⃣ Na signup weer onboarding / tabs
//     cy.url({ timeout: 10000 }).should("include", "/onboarding");
//   });
// });

describe("Signup flow", () => {
  beforeEach(() => {
    cy.logout();

    // CORS
    cy.intercept("OPTIONS", "**/users/signup", {
      statusCode: 200,
    });

    cy.intercept("POST", "**/users/signup", {
      statusCode: 200,
      body: {
        id: "1",
        username: "testuser123",
        email: "testuser123@example.com",
      },
    }).as("signup");

    cy.intercept("POST", "**/users/login", {
      statusCode: 200,
      body: {
        token: "test-token",
        username: "testuser123",
        email: "testuser123@example.com",
      },
    }).as("login");

    cy.visit("/login");
  });

  it("navigates from login to signup and signs up successfully", () => {
    cy.logout();
    cy.visit("/login");

    cy.getByTestId("login-signup-link").click();
    cy.getByTestId("signup-screen").should("exist");

    cy.getByTestId("signup-username-input").type("testuser123");
    cy.getByTestId("signup-email-input").type("testuser123@example.com");
    cy.getByTestId("signup-password-input").type("Password123!");

    cy.getByTestId("signup-submit-button").click();

    cy.wait("@signup");
    cy.wait("@login");
    // cy.url({ timeout: 6000 }).should("include", "/onboarding");
  });
});
