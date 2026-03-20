describe('Flujo de Autenticación', () => {
  const testUser = {
    name: 'Cypress Test',
    email: `test-${Date.now()}@example.com`,
    password: 'password123'
  }

  it('Debería permitir registrarse exitosamente', () => {
    cy.visit('/register')
    cy.get('[data-testid="input-name"]').type(testUser.name)
    cy.get('[data-testid="input-email"]').type(testUser.email)
    cy.get('[data-testid="input-password"]').type(testUser.password)
    cy.get('[data-testid="btn-crear-cuenta"]').click()

    // Debería redirigir al login o al home logueado
    cy.url().should('not.include', '/register')
    cy.get('.site-header').should('contain', 'Hola')
  })

  it('Debería permitir iniciar sesión exitosamente', () => {
    cy.login(testUser.email, testUser.password)
    
    // Verificación de login exitoso
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('.site-header').should('contain', 'Hola')
  })

  it('Debería mostrar error con credenciales incorrectas', () => {
    cy.login('fake@user.com', 'wrongpassword')
    cy.get('.login-form__error').should('be.visible')
  })
})
