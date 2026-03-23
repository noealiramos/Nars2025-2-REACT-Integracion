describe('Flujos de Autenticación', () => {
  const testUser = {
    displayName: 'Cypress Test',
    email: `test-${Date.now()}@example.com`,
    password: 'password123'
  }

  const loginUser = {
    displayName: 'Login QA User',
    email: `login-${Date.now()}@mail.com`,
    password: 'password123'
  }

  before(() => {
    // Ensure the QA login user exists by using the actual API
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/auth/register',
      failOnStatusCode: false, 
      body: {
        displayName: loginUser.displayName,
        email: loginUser.email,
        password: loginUser.password
      }
    })
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()
  })

  // ----------------------------------------------------
  // REGISTRO
  // ----------------------------------------------------
  it('AUTH-001: Debería permitir registrarse exitosamente', () => {
    cy.visit('/register')
    cy.get('form.login-form').should('be.visible')
    
    cy.get('[data-testid="input-name"]').type(testUser.displayName)
    cy.get('[data-testid="input-email"]').type(testUser.email)
    cy.get('[data-testid="input-password"]').type(testUser.password)
    
    cy.intercept('POST', '**/api/auth/register').as('registerReq')
    cy.intercept('POST', '**/api/auth/login').as('autoLoginReq')
    
    cy.get('[data-testid="btn-crear-cuenta"]').click()
    
    cy.wait('@registerReq').its('response.statusCode').should('eq', 201)
    
    // Validamos redirección correcta y UI logueada a través de login interno
    cy.wait('@autoLoginReq').its('response.statusCode').should('eq', 200)

    cy.url().should('not.include', '/register')
    cy.get('.site-header').should('contain', testUser.displayName)
  })

  it('AUTH-002: Debería mostrar error de la API al intentar registrar un usuario duplicado', () => {
    cy.visit('/register')
    
    cy.get('[data-testid="input-name"]').type(loginUser.displayName)
    cy.get('[data-testid="input-email"]').type(loginUser.email) 
    cy.get('[data-testid="input-password"]').type(loginUser.password)
    
    cy.intercept('POST', '**/api/auth/register').as('registerDupReq')
    
    cy.get('[data-testid="btn-crear-cuenta"]').click()
    cy.wait('@registerDupReq').its('response.statusCode').should('eq', 409)
    
    cy.get('.login-form__error').should('be.visible').and('not.be.empty')
  })

  // ----------------------------------------------------
  // LOGIN
  // ----------------------------------------------------
  it('AUTH-003: Debería permitir iniciar sesión exitosamente con credenciales válidas', () => {
    cy.visit('/login')
    
    cy.get('[data-testid="input-email"]').clear().type(loginUser.email)
    cy.get('[data-testid="input-password"]').clear().type(loginUser.password)
    
    cy.intercept('POST', '**/api/auth/login').as('loginReq')
    cy.get('[data-testid="btn-entrar"]').click()
    
    cy.wait('@loginReq').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('.site-header').should('contain', loginUser.displayName)
  })

  it('AUTH-004: Debería manejar correctamente el inicio de sesión con credenciales inválidas', () => {
    cy.visit('/login')

    cy.get('[data-testid="input-email"]').clear().type('fake.user123@mail.com')
    cy.get('[data-testid="input-password"]').clear().type('wrongpass')
    
    cy.intercept('POST', '**/api/auth/login').as('loginFailReq')
    cy.get('[data-testid="btn-entrar"]').click()

    cy.wait('@loginFailReq').its('response.statusCode').should('be.oneOf', [400, 401, 404])
    cy.get('.login-form__error').should('be.visible').and('not.be.empty')
  })
})
