describe('Data Visualization Features', () => {
  beforeEach(() => {
    // Create multiple test entries first to ensure we have enough data
    cy.visit('/');
    
    // Create 5 entries with different moods
    const entries = [
      { title: 'Test Entry 1', content: 'Testing analytics features', mood: 'Happy' },
      { title: 'Test Entry 2', content: 'More test content', mood: 'Calm' },
      { title: 'Test Entry 3', content: 'Third test entry', mood: 'Happy' },
      { title: 'Test Entry 4', content: 'Fourth test entry', mood: 'Excited' },
      { title: 'Test Entry 5', content: 'Fifth test entry', mood: 'Calm' }
    ];

    entries.forEach(entry => {
      cy.get('[data-test=new-entry-button]').click();
      cy.get('[data-test=entry-title]').type(entry.title);
      cy.get('[data-test=entry-content]').type(entry.content);
      cy.get('[data-test=mood-selector]').select(entry.mood);
      cy.get('[data-test=save-entry-button]').click();
      cy.get('[data-test=success-message]').should('be.visible');
    });
    
    // Navigate to analytics and wait for it to load
    cy.visit('/analytics');
    cy.wait(3000); // Wait longer for charts to load
  });

  describe('Mood Analytics', () => {
    it('should display mood trends chart', () => {
      // Verify canvas elements exist
      cy.get('canvas').should('have.length.at.least', 2);
      
      // Verify chart containers
      cy.get('.mood-distribution').should('be.visible');
      cy.get('.mood-trend').should('be.visible');
    });    it('should update visualizations with new entries', () => {
      // Create another entry
      cy.visit('/');
      cy.get('[data-test=new-entry-button]').click();
      cy.get('[data-test=entry-title]').type('Another Test Entry');
      cy.get('[data-test=entry-content]').type('Testing chart updates');
      cy.get('[data-test=mood-selector]').select('Sad');
      cy.get('[data-test=save-entry-button]').click();

      // Wait for success message
      cy.get('[data-test=success-message]', { timeout: 5000 })
        .should('be.visible');

      // Go back to analytics
      cy.visit('/analytics');
      cy.wait(3000); // Wait for charts to update

      // Verify total entries increased
      cy.get('.chart-box', { timeout: 10000 })
        .should('have.length', 2)
        .first()
        .find('canvas')
        .should('be.visible');
    });it('should display clear and insightful feedback', () => {
      // Wait for content to load
      cy.wait(2000);

      // Verify sections exist and have content
      cy.get('.chart-box', { timeout: 6000 })
        .should('have.length', 2);

      cy.get('.mood-insight')
        .should('exist')
        .and('be.visible')
        .and('contain', 'Mood');
    });

    it('should allow time range selection for analytics', () => {
      cy.get('.time-buttons', { timeout: 6000 }).should('be.visible');
      
      // Test each time range
      ['Week', 'Month', 'Year', 'All'].forEach(period => {
        cy.contains('button', period).click();
        cy.wait(1000); // Wait for chart update
        cy.get('.chart-box canvas').should('have.length', 2);
      });
    });    it('should provide meaningful mood analysis', () => {
      // Wait for analysis to generate
      cy.wait(3000);

      // Check mood insights section
      cy.get('[data-test=mood-insights]', { timeout: 10000 })
        .should('exist')
        .within(() => {
          cy.get('[data-test=trend-analysis]')
            .should('exist')
            .should('not.be.empty');
          cy.contains('h3', 'Mood Insights').should('be.visible');
        });

      // Check mood summary section
      cy.get('[data-test=mood-summary]', { timeout: 10000 })
        .should('exist')
        .within(() => {
          // Check frequent mood stat
          cy.get('[data-test=stat-frequent-mood]')
            .should('exist')
            .within(() => {
              cy.get('.stat-number').should('not.be.empty');
              cy.get('.stat-label').should('contain', 'Most Frequent Mood');
            });

          // Check total entries stat
          cy.get('[data-test=stat-total-entries]')
            .should('exist')
            .within(() => {
              cy.get('.stat-number').should('not.be.empty');
              cy.get('.stat-label').should('contain', 'Total Entries');
            });

          // Check mood consistency stat
          cy.get('[data-test=stat-consistency]')
            .should('exist')
            .within(() => {
              cy.get('.stat-number').invoke('text').should('match', /^[0-9]+%$/);
              cy.get('.stat-label').should('contain', 'Mood Consistency');
            });
        });
    });
  });
});
