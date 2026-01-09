/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// / <reference types="cypress" />

// Cypress.Commands.add("login", () => {
//   cy.window().then((win) => {
//     win.localStorage.setItem(
//       "loggedInUser",
//       JSON.stringify({
//         token: "test-token",
//         username: "testuser",
//         email: "test@example.com",
//       })
//     );
//   });
// });

// Cypress.Commands.add("logout", () => {
//   cy.window().then((win) => {
//     win.localStorage.clear();
//   });
// });

// Cypress.Commands.add("getByTestId", (testId: string) => {
//   return cy.get(`[data-testid="${testId}"]`);
// });

// cypress/support/commands.ts

// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(): Chainable<void>;
//       logout(): Chainable<void>;
//       getByTestId(
//         testId: string,
//         options?: Partial<Cypress.Timeoutable & Cypress.Loggable>
//       ): Chainable<JQuery<HTMLElement>>;
//     }
//   }
// }

// Cypress.Commands.add("getByTestId", (testId: string, options = {}) => {
//   return cy.get(`[data-testid="${testId}"]`, options);
// });

// Cypress.Commands.add("logout", () => {
//   cy.window().then((win) => {
//     win.localStorage.removeItem("loggedInUser");
//   });
// });

// Cypress.Commands.add("login", () => {
//   cy.intercept("POST", "**/login**", {
//     statusCode: 200,
//     body: {
//       token: "test-token",
//       username: "testuser",
//       email: "test@example.com",
//     },
//   }).as("loginSuccess");

//   cy.visit("/login");

//   cy.getByTestId("login-email-input", { timeout: 15000 }).should("be.visible");
//   cy.getByTestId("login-password-input", { timeout: 15000 }).should(
//     "be.visible"
//   );

//   cy.fixture("user/user").then((user) => {
//     cy.getByTestId("login-email-input").scrollIntoView().click({ force: true });

//     cy.getByTestId("login-email-input").clear({ force: true });
//     cy.getByTestId("login-email-input").type(user.email, { delay: 10 });

//     cy.getByTestId("login-password-input")
//       .scrollIntoView()
//       .click({ force: true });

//     cy.getByTestId("login-password-input").clear({ force: true });
//     cy.getByTestId("login-password-input").type(user.password, { delay: 10 });
//   });

//   cy.getByTestId("login-submit-button")
//     .should("be.visible")
//     .click({ force: true });

//   cy.wait("@loginSuccess", { timeout: 20000 });
//   cy.url({ timeout: 20000 }).should("include", "/onboarding");
// });

// export {};

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      loginAndCompleteOnboarding(emotionId?: string): Chainable<void>;
      logout(): Chainable<void>;
      getByTestId(
        testId: string,
        options?: Partial<Cypress.Timeoutable & Cypress.Loggable>
      ): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("getByTestId", (testId: string, options = {}) => {
  return cy.get(`[data-testid="${testId}"]`, options);
});

Cypress.Commands.add("logout", () => {
  cy.window().then((win) => {
    win.localStorage.removeItem("loggedInUser");
  });
});

Cypress.Commands.add("login", () => {
  cy.intercept("POST", "**/login**", {
    statusCode: 200,
    body: {
      token: "test-token",
      username: "testuser",
      email: "test@example.com",
    },
  }).as("loginSuccess");

  cy.visit("/login");

  cy.getByTestId("login-email-input", { timeout: 15000 }).should("be.visible");
  cy.getByTestId("login-password-input", { timeout: 15000 }).should(
    "be.visible"
  );

  cy.fixture("user/user").then((user) => {
    cy.getByTestId("login-email-input").scrollIntoView().click({ force: true });
    cy.getByTestId("login-email-input").clear({ force: true });
    cy.getByTestId("login-email-input").type(user.email, { delay: 10 });

    cy.getByTestId("login-password-input")
      .scrollIntoView()
      .click({ force: true });
    cy.getByTestId("login-password-input").clear({ force: true });
    cy.getByTestId("login-password-input").type(user.password, { delay: 10 });
  });

  cy.getByTestId("login-submit-button")
    .should("be.visible")
    .click({ force: true });

  cy.wait("@loginSuccess", { timeout: 20000 });

  cy.url({ timeout: 20000 }).should("include", "/onboarding");
});

Cypress.Commands.add(
  "loginAndCompleteOnboarding",
  (emotionId: string = "happy") => {
    cy.login();

    cy.url({ timeout: 20000 }).should("include", "/onboarding");
    cy.getByTestId("onboarding-screen", { timeout: 20000 }).should("exist");
    cy.getByTestId(`onboarding-emotion-${emotionId}`, { timeout: 20000 })
      .should("be.visible")
      .click({ force: true });

    cy.getByTestId("onboarding-continue-button", { timeout: 20000 })
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 20000 }).should("not.include", "/onboarding");
  }
);

export {};
