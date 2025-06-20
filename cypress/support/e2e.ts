// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
Cypress.on('window:before:load', (win) => {
  // Stub console methods to reduce noise in test output
  cy.stub(win.console, 'log').as('consoleLog');
  cy.stub(win.console, 'warn').as('consoleWarn');
});