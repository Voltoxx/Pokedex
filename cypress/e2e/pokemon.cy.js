describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/')
    expect(cy.contains('Chercher')).to.exist
    cy.get('input').type('pikachu') 
    cy.get('button').click()
    cy.get('.card').first().click()
  })
})