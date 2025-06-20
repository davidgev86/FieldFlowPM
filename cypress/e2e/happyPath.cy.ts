describe('FieldFlowPM Happy Path', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/');
  });

  it('should complete full user workflow', () => {
    // 1. Login as admin
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Wait for redirect to dashboard
    cy.url().should('not.include', '/login');
    cy.contains('Projects', { timeout: 10000 }).should('be.visible');

    // 2. Navigate to projects
    cy.contains('Projects').click();
    cy.url().should('include', '/projects');

    // 3. Create a new project via UI
    cy.get('[data-testid="new-project-button"]', { timeout: 5000 })
      .should('be.visible')
      .click();

    // Fill project form
    cy.get('input[name="name"]').type('E2E Test Project');
    cy.get('input[name="description"]').type('Project created via E2E test');
    cy.get('input[name="address"]').type('123 Test Street, Test City');
    cy.get('select[name="status"]').select('planning');
    cy.get('input[name="budgetTotal"]').type('25000');

    // Submit project
    cy.get('button[type="submit"]').click();

    // Verify project appears in list
    cy.contains('E2E Test Project').should('be.visible');

    // 4. Click on the project to view details
    cy.contains('E2E Test Project').click();

    // 5. Add a cost entry
    cy.contains('Costs').click();
    cy.get('[data-testid="add-cost-button"]', { timeout: 5000 })
      .should('be.visible')
      .click();

    // Fill cost form
    cy.get('input[name="name"]').type('Materials');
    cy.get('input[name="description"]').type('Construction materials');
    cy.get('input[name="budgetAmount"]').type('5000');

    // Submit cost
    cy.get('button[type="submit"]').click();

    // 6. Verify cost appears on dashboard
    cy.visit('/dashboard');
    cy.contains('Materials').should('be.visible');
    cy.contains('5000').should('be.visible');

    // 7. Logout
    cy.get('[data-testid="user-menu"]').click();
    cy.contains('Logout').click();
    cy.url().should('include', '/login');
  });

  it('should handle authentication errors gracefully', () => {
    // Try invalid login
    cy.get('input[name="username"]').type('invalid');
    cy.get('input[name="password"]').type('wrong');
    cy.get('button[type="submit"]').click();

    // Should show error message
    cy.contains('Invalid credentials').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should protect routes when not authenticated', () => {
    // Try to access protected route directly
    cy.visit('/dashboard');
    
    // Should redirect to login
    cy.url().should('include', '/login');
  });
});