// /// <reference types="cypress" />
// declare namespace Cypress {
//   interface Chainable {
//     login(): Chainable<void>;
//     logout(): Chainable<void>;
//     getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
//   }
// }

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      logout(): Chainable<void>;
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export {};
