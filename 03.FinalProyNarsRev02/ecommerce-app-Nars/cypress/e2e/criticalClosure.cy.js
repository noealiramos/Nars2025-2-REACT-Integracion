describe('Phase 1 Critical Closure - UI Real', () => {
  const uniqueSuffix = Date.now()
  const testUser = {
    displayName: 'Critical Closure QA',
    email: `critical-closure-${uniqueSuffix}@mail.com`,
    password: 'Password123!',
  }

  it('cierra el flujo critico con registro, carrito autenticado, checkout y ordenes via UI real', () => {
    cy.registerUserViaUi(testUser)

    cy.addFirstProductToCartViaUi()
    cy.get('[data-testid="cart-badge"]').should('have.text', '1')

    cy.visit('/cart')
    cy.get('.cart-item', { timeout: 15000 }).should('have.length', 1)

    cy.reload()
    cy.get('.cart-item', { timeout: 15000 }).should('have.length', 1)
    cy.get('[data-testid="cart-badge"]').should('have.text', '1')

    cy.get('[data-testid="checkout-btn"]').click()
    cy.url().should('include', '/checkout')

    cy.completeCheckoutViaUi(testUser).then(({ response }) => {
      expect(response?.statusCode).to.eq(201)
      const createdOrderId = response?.body?._id
      expect(createdOrderId).to.be.a('string').and.not.be.empty
      cy.wrap(createdOrderId).as('createdOrderId')
    })

    cy.url().should('include', '/confirmation')
    cy.get('[data-testid="order-summary"]').should('be.visible').and('contain', testUser.displayName)
    cy.get('[data-testid="cart-badge"]').should('not.exist')

    cy.intercept('GET', '**/api/orders/user/*').as('getOrders')
    cy.get('[data-testid="nav-orders"]').click()
    cy.wait('@getOrders').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get('[data-cy="orders-list"]').should('be.visible')

    cy.get('@createdOrderId').then((createdOrderId) => {
      cy.contains('[data-cy="order-id"]', createdOrderId).should('be.visible')
      cy.intercept('GET', `**/api/orders/${createdOrderId}`).as('getOrderDetail')
      cy.contains('[data-cy="order-id"]', createdOrderId)
        .closest('[data-cy="order-card"]')
        .find('[data-cy="order-view-detail"]')
        .click()

      cy.wait('@getOrderDetail').its('response.statusCode').should('be.oneOf', [200, 304])
      cy.url().should('include', `/orders/${createdOrderId}`)
      cy.get('[data-cy="order-detail-id"]').should('contain', createdOrderId)
    })

    cy.logoutViaUi()
    cy.loginUserViaUi(testUser)
    cy.visit('/orders')
    cy.get('@createdOrderId').then((createdOrderId) => {
      cy.contains('[data-cy="order-id"]', createdOrderId).should('be.visible')
    })
  })
})
