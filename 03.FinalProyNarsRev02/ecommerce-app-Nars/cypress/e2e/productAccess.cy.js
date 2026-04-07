describe('Acceso controlado al carrito desde productos', () => {
  const uniqueSuffix = Date.now()
  const loginUser = {
    displayName: 'Product Access QA User',
    email: `product-access-${uniqueSuffix}@mail.com`,
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

  it('PRODUCT-001: Usuario autenticado puede agregar un producto disponible desde catalogo', () => {
    cy.intercept('POST', '**/api/auth/login').as('loginReq')
    cy.intercept('GET', '**/api/products*').as('getProducts')

    cy.visit('/login')
    cy.get('[data-testid="input-email"]').clear().type(loginUser.email)
    cy.get('[data-testid="input-password"]').clear().type(loginUser.password)
    cy.get('[data-testid="btn-entrar"]').click()
    cy.wait('@loginReq').its('response.statusCode').should('eq', 200)

    cy.visit('/')
    cy.wait('@getProducts').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get('[data-testid^="add-to-cart-"]:not(:disabled)', { timeout: 15000 }).first().click()
    cy.get('[data-testid="cart-badge"]', { timeout: 10000 }).should('contain', '1')
  })

  it('PRODUCT-002: Usuario no autenticado no ve CTA de carrito y usa login para comprar', () => {
    cy.intercept('GET', '**/api/products*').as('getProducts')

    cy.visit('/')
    cy.wait('@getProducts').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get('[data-testid="cart-badge"]').should('not.exist')
    cy.get('[data-testid^="add-to-cart-"]').should('not.exist')

    cy.get('[data-testid^="login-to-buy-"]', { timeout: 15000 }).first().click()

    cy.url().should('include', '/login')
    cy.get('[data-testid="cart-badge"]').should('not.exist')
  })
})
