describe('Flujos Adversos - Checkout', () => {
  const uniqueSuffix = Date.now()
  const testUser = {
    displayName: 'Checkout Error QA',
    email: `checkout-error-${uniqueSuffix}@mail.com`,
    password: 'Password123!',
  }

  before(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()
    cy.registerUserViaUi(testUser)
    cy.logoutViaUi()
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()
    cy.loginUserViaUi(testUser)
  })

  it('Debería manejar de forma segura un rechazo real del backend al confirmar datos inválidos', () => {
    cy.intercept('POST', '**/api/cart/add-product').as('addToCart')
    cy.addFirstProductToCartViaUi()
    cy.wait('@addToCart').its('response.statusCode').should('be.oneOf', [200, 201])
    cy.get('[data-testid="cart-badge"]').should('have.text', '1')

    cy.visit('/cart')
    cy.get('.cart-item', { timeout: 15000 }).should('have.length.at.least', 1)
    cy.get('[data-testid="checkout-btn"]').click()
    cy.url().should('include', '/checkout')

    cy.intercept('POST', '**/api/shipping-addresses').as('createShipping')

    cy.get('form.checkout-form').should('be.visible')
    cy.get('[data-testid="input-name"]').clear().type(testUser.displayName)
    cy.get('[data-testid="input-phone"]').clear().type('5512345678')
    cy.get('[data-testid="input-address"]').clear().type('Av Reforma 123')
    cy.get('[data-testid="input-city"]').clear().type('CDMX 2026')
    cy.get('[data-testid="input-state"]').clear().type('CDMX')
    cy.get('[data-testid="input-postalCode"]').clear().type('11000')
    cy.get('[data-testid="input-cardHolder"]').clear().type(testUser.displayName)
    cy.get('[data-testid="input-cardNumber"]').clear().type('4111111111111111')
    cy.get('[data-testid="input-cardExpiry"]').clear().type('12/28')
    cy.get('[data-testid="input-cardCvv"]').clear().type('123')
    cy.get('[data-testid="btn-confirmar-compra"]').click()

    cy.wait('@createShipping').its('response.statusCode').should('eq', 422)
    cy.url().should('include', '/checkout')
    cy.get('.form-error')
      .should('be.visible')
      .and('contain.text', 'City: letters and spaces only')

    cy.get('[data-testid="btn-confirmar-compra"]')
      .should('not.be.disabled')
      .and('contain.text', 'Confirmar Compra')
  })
})
