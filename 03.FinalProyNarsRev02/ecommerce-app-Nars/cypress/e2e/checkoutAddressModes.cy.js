describe('Checkout address modes', () => {
  const createTestUser = (suffix) => ({
    displayName: `Checkout Address ${String(suffix).replace(/[^a-zA-Z0-9]/g, '')}`,
    email: `checkout-address-${suffix}@mail.com`,
    password: 'Password123!',
  })

  const openCheckoutWithFreshUser = (user) => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()
    cy.registerUserViaUi(user)
    cy.addFirstProductToCartViaUi()
    cy.visit('/cart')
    cy.get('.cart-item', { timeout: 15000 }).should('have.length.at.least', 1)
    cy.get('[data-testid="checkout-btn"]').click()
    cy.url().should('include', '/checkout')
    cy.get('form.checkout-form').should('be.visible')
  }

  it('sin direcciones muestra guardar y cancelar, y cancelar limpia el formulario', () => {
    const user = createTestUser(`cancel-${Date.now()}`)

    openCheckoutWithFreshUser(user)

    cy.get('[data-testid="shipping-empty-state"]', { timeout: 15000 }).should('be.visible')
    cy.get('[data-testid="shipping-save-new"]').should('be.visible')
    cy.get('[data-testid="shipping-cancel-new"]').should('be.visible')

    cy.get('[data-testid="input-name"]').clear().type('Temporal QA')
    cy.get('[data-testid="input-city"]').clear().type('Merida')
    cy.get('[data-testid="shipping-cancel-new"]').click()

    cy.get('[data-testid="input-name"]').should('have.value', user.displayName)
    cy.get('[data-testid="input-city"]').should('have.value', '')
    cy.get('[data-testid="shipping-save-new"]').should('be.visible')
  })

  it('sin direcciones guardar crea la direccion y pasa a modo view', () => {
    const user = createTestUser(`save-${Date.now()}`)

    cy.intercept('POST', '**/api/shipping-addresses').as('createShippingDraft')
    cy.intercept('GET', '**/api/shipping-addresses').as('getShippingOptions')

    openCheckoutWithFreshUser(user)

    cy.get('[data-testid="shipping-empty-state"]', { timeout: 15000 }).should('be.visible')
    cy.get('[data-testid="input-phone"]').clear().type('5512345678')
    cy.get('[data-testid="input-address"]').clear().type('Av. Juarez 120')
    cy.get('[data-testid="input-city"]').clear().type('Puebla')
    cy.get('[data-testid="input-state"]').clear().type('Puebla')
    cy.get('[data-testid="input-postalCode"]').clear().type('72000')
    cy.get('[data-testid="shipping-save-new"]').click()

    cy.wait('@createShippingDraft').its('response.statusCode').should('eq', 201)
    cy.wait('@getShippingOptions').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get('[data-testid="saved-shipping-options"]', { timeout: 15000 }).should('be.visible')
    cy.get('[data-testid="shipping-save-new"]').should('not.exist')
    cy.get('[data-testid="input-city"]').should('have.value', 'Puebla').and('be.disabled')
  })
})
