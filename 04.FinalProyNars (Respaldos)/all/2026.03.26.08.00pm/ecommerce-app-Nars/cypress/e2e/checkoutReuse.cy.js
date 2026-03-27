describe('Phase 2 Hardening - Checkout Reuse', () => {
  const uniqueSuffix = Date.now()
  const testUser = {
    displayName: 'Checkout Reuse QA',
    email: `checkout-reuse-${uniqueSuffix}@mail.com`,
    password: 'Password123!',
  }

  it('reutiliza los datos guardados del checkout sin recrearlos', () => {
    cy.registerUserViaUi(testUser)

    cy.addFirstProductToCartViaUi()
    cy.visit('/cart')
    cy.get('[data-testid="checkout-btn"]').click()

    cy.completeCheckoutViaUi(testUser, {
      address: 'Av. Insurgentes 501',
      city: 'Ciudad de Mexico',
      state: 'CDMX',
      postalCode: '03100',
      saveAsDefault: true,
    }).its('response.statusCode').should('eq', 201)

    cy.visit('/')
    cy.addFirstProductToCartViaUi()
    cy.visit('/cart')
    cy.intercept('GET', '**/api/payment-methods/user/*').as('getPaymentOptions')
    cy.get('[data-testid="checkout-btn"]').click()

    let shippingCalls = 0
    let paymentCalls = 0

    cy.intercept('POST', '**/api/shipping-addresses', (req) => {
      shippingCalls += 1
      req.continue()
    }).as('shippingReuse')

    cy.intercept('POST', '**/api/payment-methods', (req) => {
      paymentCalls += 1
      req.continue()
    }).as('paymentReuse')

    cy.intercept('POST', '**/api/orders').as('createOrder')

    cy.wait('@getPaymentOptions').its('response.statusCode').should('eq', 200)
    cy.get('[data-testid="input-phone"]').should('be.disabled')
    cy.get('[data-testid="saved-payment-options"]', { timeout: 15000 }).should('be.visible')
    cy.get('[data-testid="payment-option-new"]').should('not.be.checked')

    cy.get('[data-testid="btn-confirmar-compra"]').click()
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201)

    cy.wrap(null).then(() => {
      expect(shippingCalls).to.eq(0)
      expect(paymentCalls).to.eq(0)
    })
  })
})
