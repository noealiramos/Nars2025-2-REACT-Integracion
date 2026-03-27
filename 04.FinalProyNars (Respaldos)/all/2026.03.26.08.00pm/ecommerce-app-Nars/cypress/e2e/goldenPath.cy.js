describe('Golden Path - Login to Orders', () => {
  const uniqueSuffix = Date.now()
  const testUser = {
    displayName: 'Golden Path QA',
    email: `golden-path-${uniqueSuffix}@mail.com`,
    password: 'Password123!',
  }

  before(() => {
    cy.ensureUser(testUser)
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()

    cy.intercept('GET', '**/api/products*').as('getProducts')
  })

  it('E2E-PH3-004: completa Login -> Producto -> Carrito -> Checkout -> Confirmacion -> Orders sin mocks', () => {
    cy.intercept('POST', '**/api/auth/login').as('loginReq')
    cy.visit('/login')

    cy.get('[data-testid="input-email"]').clear().type(testUser.email)
    cy.get('[data-testid="input-password"]').clear().type(testUser.password)
    cy.get('[data-testid="btn-entrar"]').click()

    cy.wait('@loginReq').its('response.statusCode').should('eq', 200)
    cy.url().should('match', /\/$/)
    cy.wait('@getProducts').its('response.statusCode').should('eq', 200)

    cy.get('[data-testid="nav-orders"]').should('be.visible')
    cy.get('.product-card').should('have.length.greaterThan', 0)

    cy.intercept('GET', '**/api/products/*').as('getProductDetail')
    cy.get('[data-testid^="view-detail-"]').first().click()
    cy.wait('@getProductDetail').its('response.statusCode').should('eq', 200)

    cy.get('main').should('be.visible')
    cy.get('.product-detail__price').should('be.visible')
    cy.get('[data-testid="add-to-cart-detail"]').click()
    cy.get('[data-testid="cart-badge"]').should('have.text', '1')

    cy.get('[data-testid="nav-cart"]').click()
    cy.url().should('include', '/cart')
    cy.get('.cart-item').should('have.length', 1)

    cy.intercept('POST', '**/api/shipping-addresses').as('createShipping')
    cy.intercept('POST', '**/api/payment-methods').as('createPayment')
    cy.intercept('POST', '**/api/orders').as('createOrder')

    cy.get('[data-testid="checkout-btn"]').click()
    cy.url().should('include', '/checkout')

    cy.get('[data-testid="input-name"]').clear().type(testUser.displayName)
    cy.get('[data-testid="input-phone"]').clear().type('5512345678')
    cy.get('[data-testid="input-address"]').clear().type('Av Reforma 123')
    cy.get('[data-testid="input-city"]').clear().type('Ciudad de Mexico')
    cy.get('[data-testid="input-state"]').clear().type('CDMX')
    cy.get('[data-testid="input-postalCode"]').clear().type('11000')
    cy.get('[data-testid="input-cardHolder"]').clear().type(testUser.displayName)
    cy.get('[data-testid="input-cardNumber"]').clear().type('4111111111111111')
    cy.get('[data-testid="input-cardExpiry"]').clear().type('12/29')
    cy.get('[data-testid="input-cardCvv"]').clear().type('123')
    cy.get('[data-testid="btn-confirmar-compra"]').click()

    cy.wait('@createShipping').its('response.statusCode').should('eq', 201)
    cy.wait('@createPayment').its('response.statusCode').should('eq', 201)
    cy.wait('@createOrder').then(({ response }) => {
      expect(response?.statusCode).to.eq(201)
      const createdOrderId = response?.body?._id
      expect(createdOrderId, 'created order id').to.be.a('string').and.not.be.empty
      cy.wrap(createdOrderId).as('createdOrderId')
    })

    cy.url().should('include', '/confirmation')
    cy.get('[data-testid="order-summary"]').should('be.visible')
    cy.contains('ID de orden').should('be.visible')
    cy.get('[data-testid="cart-badge"]').should('not.exist')

    cy.intercept('GET', '**/api/orders/user/*').as('getOrders')
    cy.get('[data-testid="nav-orders"]').click()
    cy.url().should('include', '/orders')
    cy.wait('@getOrders').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-cy="orders-list"]').should('be.visible')
    cy.get('@createdOrderId').then((createdOrderId) => {
      cy.contains(createdOrderId).should('be.visible')

      cy.contains('[data-cy="order-id"]', createdOrderId)
        .closest('[data-cy="order-card"]')
        .as('createdOrderCard')

      cy.intercept('GET', `**/api/orders/${createdOrderId}`).as('getOrderDetail')
      cy.get('@createdOrderCard').within(() => {
        cy.get('[data-cy="order-view-detail"]').click()
      })

      cy.wait('@getOrderDetail').its('response.statusCode').should('be.oneOf', [200, 304])
      cy.url().should('include', `/orders/${createdOrderId}`)
      cy.get('[data-cy="order-detail-card"]').should('be.visible')
      cy.get('[data-cy="order-detail-id"]').should('contain', createdOrderId)
    })
    cy.get('[data-cy="order-detail-items"]').should('be.visible')
    cy.get('[data-cy="order-detail-total"]').should('be.visible')
  })
})
