describe("Chat", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/");

    // Wacht tot RootLayout redirect naar onboarding
    cy.url({ timeout: 8000 }).should("include", "/onboarding");

    cy.getByTestId("onboarding-emotion-happy").click();
    cy.getByTestId("onboarding-continue-button").click();

    cy.getByTestId("tab-chat").click();
    cy.url({ timeout: 5000 }).should("include", "/chat");
  });

  it("sends a message and receives AI response", () => {
    cy.intercept("POST", "**/messages", {
      statusCode: 200,
      body: {
        id: "123",
        message: "AI response",
        ai: true,
        timestamp: new Date().toISOString(),
      },
    }).as("sendMessage");

    cy.getByTestId("chat-input").type("Hello AI");
    cy.getByTestId("chat-send-button").click();

    cy.contains("Hello AI").should("be.visible");

    // cy.wait("@chat");
    cy.contains("AI response").should("be.visible");
  });
});
