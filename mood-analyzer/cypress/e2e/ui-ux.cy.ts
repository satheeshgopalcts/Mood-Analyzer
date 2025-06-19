describe('UI/UX Features', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('should show loading spinner during operations', () => {
    cy.get('[data-cy="new-entry-button"]').click()
    cy.get('[data-cy="loading-spinner"]').should('be.visible')
    cy.get('[data-cy="loading-spinner"]').should('not.exist')
  })

  it('should show error messages appropriately', () => {
    // Try to submit empty form
    cy.get('[data-cy="new-entry-button"]').click()
    cy.get('[data-cy="submit-entry"]').click()
    cy.get('[data-cy="error-message"]').should('be.visible')
  })

  it('should maintain responsive layout', () => {
    // Test desktop view
    cy.viewport(1280, 720)
    cy.get('[data-cy="journal-list"]').should('be.visible')

    // Test tablet view
    cy.viewport(768, 1024)
    cy.get('[data-cy="journal-list"]').should('be.visible')

    // Test mobile view
    cy.viewport(375, 667)
    cy.get('[data-cy="journal-list"]').should('be.visible')
  })

  it('should persist data between page reloads', () => {    // Create entry
    cy.get('[data-cy="new-entry-button"]').click()
    cy.get('[data-cy="entry-title"]').type('Persistence Test')
    cy.get('[data-cy="entry-content"]').type('Testing data persistence')
    cy.get('[data-cy="mood-select"]').select('HAPPY')
    cy.get('[data-cy="submit-entry"]').click()

    // Reload page
    cy.reload()

    // Verify data persists
    cy.get('[data-cy="journal-entry"]').should('contain', 'Persistence Test')
  })

  it('should handle data privacy', () => {
    // Create private entry
    cy.get('[data-cy="new-entry-button"]').click()
    cy.get('[data-cy="entry-title"]').type('Private Entry')
    cy.get('[data-cy="entry-content"]').type('This is private content')
    cy.get('[data-cy="mood-select"]').click()
    cy.get('[data-cy="mood-option-HAPPY"]').click()
    cy.get('[data-cy="private-toggle"]').click()
    cy.get('[data-cy="submit-entry"]').click()

    // Verify entry is marked as private
    cy.get('[data-cy="private-indicator"]').should('exist')
  })
})
