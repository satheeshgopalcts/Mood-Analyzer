describe('Journal Entry Features', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('should create a new journal entry', () => {
    // Navigate to new entry form
    cy.get('[data-cy="new-entry-button"]').click()    // Fill in the form
    cy.get('[data-cy="entry-title"]').type('Test Journal Entry')
    cy.get('[data-cy="entry-content"]').type('This is a test journal entry content.')
    cy.get('[data-cy="mood-select"]').select('HAPPY')

    // Submit the form
    cy.get('[data-cy="submit-entry"]').click()

    // Verify entry was created
    cy.get('[data-cy="journal-entry"]').should('contain', 'Test Journal Entry')
    cy.get('[data-cy="mood-indicator"]').should('contain', 'Happy')
  })

  it('should edit an existing journal entry', () => {
    // Create an entry first
    cy.get('[data-cy="new-entry-button"]').click()
    cy.get('[data-cy="entry-title"]').type('Entry to Edit')
    cy.get('[data-cy="entry-content"]').type('Initial content')
    cy.get('[data-cy="mood-select"]').click()
    cy.get('[data-cy="mood-option-HAPPY"]').click()
    cy.get('[data-cy="submit-entry"]').click()

    // Edit the entry
    cy.get('[data-cy="edit-entry-button"]').first().click()
    cy.get('[data-cy="entry-title"]').clear().type('Updated Entry')
    cy.get('[data-cy="entry-content"]').clear().type('Updated content')
    cy.get('[data-cy="mood-select"]').click()
    cy.get('[data-cy="mood-option-CALM"]').click()
    cy.get('[data-cy="submit-entry"]').click()

    // Verify changes
    cy.get('[data-cy="journal-entry"]').should('contain', 'Updated Entry')
    cy.get('[data-cy="mood-indicator"]').should('contain', 'Calm')
  })

  it('should delete a journal entry', () => {
    // Create an entry first
    cy.get('[data-cy="new-entry-button"]').click()
    cy.get('[data-cy="entry-title"]').type('Entry to Delete')
    cy.get('[data-cy="entry-content"]').type('This will be deleted')
    cy.get('[data-cy="mood-select"]').click()
    cy.get('[data-cy="mood-option-SAD"]').click()
    cy.get('[data-cy="submit-entry"]').click()

    // Delete the entry
    cy.get('[data-cy="delete-entry-button"]').first().click()
    cy.get('[data-cy="confirm-delete"]').click()

    // Verify entry was deleted
    cy.get('[data-cy="journal-entry"]').should('not.exist')
  })
})
