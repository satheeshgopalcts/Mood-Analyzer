describe('Mood Analytics Features', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage()
    cy.visit('/')
    
    // Create some test entries
    const moods = ['HAPPY', 'SAD', 'CALM', 'EXCITED']
    moods.forEach((mood, index) => {
      cy.get('[data-cy="new-entry-button"]').click()
      cy.get('[data-cy="entry-title"]').type(`Test Entry ${index + 1}`)
      cy.get('[data-cy="entry-content"]').type(`Content for entry ${index + 1}`)      cy.get('[data-cy="mood-select"]').select(mood)
      cy.get('[data-cy="submit-entry"]').click()
    })

    // Navigate to analytics page
    cy.get('[data-cy="analytics-button"]').click()
  })

  it('should display mood distribution chart', () => {
    // Verify chart elements exist
    cy.get('[data-cy="mood-distribution-chart"]').should('exist')
    cy.get('[data-cy="chart-legend"]').should('exist')
  })

  it('should switch between different time periods', () => {
    // Test week view
    cy.get('[data-cy="time-period-week"]').click()
    cy.get('[data-cy="mood-distribution-chart"]').should('be.visible')

    // Test month view
    cy.get('[data-cy="time-period-month"]').click()
    cy.get('[data-cy="mood-distribution-chart"]').should('be.visible')

    // Test year view
    cy.get('[data-cy="time-period-year"]').click()
    cy.get('[data-cy="mood-distribution-chart"]').should('be.visible')

    // Test all-time view
    cy.get('[data-cy="time-period-all"]').click()
    cy.get('[data-cy="mood-distribution-chart"]').should('be.visible')
  })

  it('should update charts when new entries are added', () => {
    // Get initial chart data
    cy.get('[data-cy="mood-distribution-chart"]').then(($chart) => {
      const initialChart = $chart.html()

      // Navigate back and add new entry
      cy.get('[data-cy="back-to-journal"]').click()
      cy.get('[data-cy="new-entry-button"]').click()
      cy.get('[data-cy="entry-title"]').type('New Test Entry')
      cy.get('[data-cy="entry-content"]').type('New content')
      cy.get('[data-cy="mood-select"]').click()
      cy.get('[data-cy="mood-option-HAPPY"]').click()
      cy.get('[data-cy="submit-entry"]').click()

      // Go back to analytics
      cy.get('[data-cy="analytics-button"]').click()

      // Verify chart has updated
      cy.get('[data-cy="mood-distribution-chart"]').should(($newChart) => {
        expect($newChart.html()).not.to.eq(initialChart)
      })
    })
  })
})
