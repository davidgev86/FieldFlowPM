/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>
      logout(): Chainable<void>
    }
  }
}

// Custom command to login
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      username,
      password
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    // Cookies are automatically stored by Cypress
  });
});

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.request({
    method: 'POST',
    url: '/api/auth/logout',
    failOnStatusCode: false
  });
});

export {};