describe('Flujo minimo de perfil', () => {
  const uniqueSuffix = Date.now()
  const loginUser = {
    displayName: 'Profile QA User',
    email: `profile-${uniqueSuffix}@mail.com`,
    password: 'password123',
  }

  before(() => {
    cy.ensureUser(loginUser)
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()
  })

  it('PROFILE-001: Usuario autenticado accede a /profile y ve contenido real', () => {
    cy.intercept('POST', '**/api/auth/login').as('loginReq')
    cy.intercept('GET', '**/api/users/me').as('getProfile')

    cy.visit('/login')
    cy.get('[data-testid="input-email"]').clear().type(loginUser.email)
    cy.get('[data-testid="input-password"]').clear().type(loginUser.password)
    cy.get('[data-testid="btn-entrar"]').click()

    cy.wait('@loginReq').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)

    cy.visit('/profile')
    cy.wait('@getProfile').its('response.statusCode').should('eq', 200)

    cy.url().should('include', '/profile')
    cy.get('[data-testid="profile-page"]', { timeout: 10000 }).should('be.visible')
    cy.contains('Mi perfil').should('be.visible')
    cy.contains(loginUser.email).should('be.visible')
  })

  it('PROFILE-002: Usuario no autenticado es redirigido al login al intentar acceder a /profile', () => {
    cy.visit('/profile')

    cy.url().should('include', '/login')
    cy.get('[data-testid="profile-page"]').should('not.exist')
    cy.contains('Mi perfil').should('not.exist')
  })
})
