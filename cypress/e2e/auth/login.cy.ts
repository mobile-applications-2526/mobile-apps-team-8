describe("Login flow", () => {
  beforeEach(() => {
    cy.logout();
  });

  it("renders login screen", () => {
    cy.visit("/login");

    cy.getByTestId("login-email-input").should("exist");
    cy.getByTestId("login-password-input").should("exist");
    cy.getByTestId("login-submit-button").should("exist");
  });

  it("logs in successfully with valid credentials", () => {
    cy.intercept("POST", "**/login**", {
      statusCode: 200,
      body: {
        token: "test-token",
        username: "testuser",
        email: "test@example.com",
      },
    }).as("loginSuccess");

    cy.visit("/login");

    cy.fixture("user/user").then((user) => {
      cy.getByTestId("login-email-input").type(user.email);
      cy.getByTestId("login-password-input").type(user.password);
    });

    cy.getByTestId("login-submit-button").click();

    cy.wait("@loginSuccess");
    cy.url({ timeout: 10000 }).should("include", "/onboarding");
  });

  it("shows error state on invalid credentials", () => {
    cy.intercept("POST", "**/login**", {
      statusCode: 401,
      body: {
        error: "Invalid credentials",
      },
    }).as("loginFail");

    cy.visit("/login");

    cy.getByTestId("login-email-input").type("wrong@test.com");
    cy.getByTestId("login-password-input").type("wrongpassword");
    cy.getByTestId("login-submit-button").click();

    cy.wait("@loginFail");

    cy.url().should("include", "/login");
  });
});
