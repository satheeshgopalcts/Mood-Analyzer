describe('Journal Entry & Mood Tracking Features', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Journal Entry Management', () => {
    const testEntry = {
      title: 'Test Journal Entry',
      content: 'This is a test journal entry content.',
      mood: 'Happy'
    };

    it('should allow creating a new journal entry', () => {
      cy.get('[data-test=new-entry-button]').click();
      cy.get('[data-test=entry-title]').type(testEntry.title);
      cy.get('[data-test=entry-content]').type(testEntry.content);
      cy.get('[data-test=mood-selector]').select(testEntry.mood);
      cy.get('[data-test=save-entry-button]').click();

      // Wait for success message and redirect
      cy.get('[data-test=success-message]')
        .should('be.visible')
        .and('contain', 'Entry saved successfully');

      // Verify we're redirected to the journal list
      cy.url().should('include', '/journal');

      // Verify the entry appears in the list
      cy.get('.entry-card')
        .should('contain', testEntry.title)
        .and('contain', testEntry.mood);
    });

    it('should display saved journal entries', () => {
      // Create a test entry first
      cy.get('[data-test=new-entry-button]').click();
      cy.get('[data-test=entry-title]').type('Test Entry for Display');
      cy.get('[data-test=entry-content]').type('Test Content');
      cy.get('[data-test=mood-selector]').select('Happy');
      cy.get('[data-test=save-entry-button]').click();

      // Wait for redirect
      cy.url().should('include', '/journal');

      // Verify entries display
      cy.get('.entry-card')
        .should('exist')
        .and('be.visible')
        .and('have.length.at.least', 1);
    });

    it('should allow selecting predefined mood options', () => {
      cy.get('[data-test=new-entry-button]').click();
      cy.get('[data-test=mood-selector]')
        .should('exist')
        .find('option')
        .should('have.length.at.least', 5)
        .then($options => {
          const values = [...$options].map(o => o.value);
          expect(values).to.include.members(['Happy', 'Sad', 'Anxious', 'Excited', 'Calm']);
        });
    });
  });

  describe('User Interface', () => {
    it('should have an intuitive navigation layout', () => {
      // Check main navigation elements
      cy.get('[data-test=new-entry-button]')
        .should('be.visible')
        .and('contain', 'New Entry');

      cy.get('[data-test=nav-analytics]')
        .should('be.visible')
        .and('contain', 'Analytics');
    });

    it('should provide feedback on successful actions', () => {
      cy.get('[data-test=new-entry-button]').click();
      cy.get('[data-test=entry-title]').type('Test Entry');
      cy.get('[data-test=entry-content]').type('Test Content');
      cy.get('[data-test=mood-selector]').select('Happy');
      cy.get('[data-test=save-entry-button]').click();

      // Verify success message
      cy.get('[data-test=success-message]')
        .should('be.visible')
        .and('contain', 'Entry saved successfully');
    });
  });
});
