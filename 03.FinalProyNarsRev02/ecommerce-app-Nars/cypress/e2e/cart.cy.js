describe('Flujos Secundarios: Carrito y Checkout', () => {
  const uniqueSuffix = Date.now()
  const loginUser = {
    displayName: 'Cart QA User',
    email: `cart-${uniqueSuffix}@mail.com`,
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

  it('E2E-PH3-001: El carrito debe persistir sus items tras una recarga del navegador (Usuario autenticado)', () => {
    cy.loginByApi(loginUser)
    cy.intercept('GET', '**/api/products*').as('getProducts')

    cy.visit('/')
    cy.wait('@getProducts').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get('[data-testid^="add-to-cart-"]:not(:disabled)', { timeout: 15000 }).first().click()
    cy.get('[data-testid="cart-badge"]').should('contain', '1')

    cy.reload()

    cy.get('[data-testid="cart-badge"]').should('contain', '1')
    cy.visit('/cart')
    cy.get('.cart-item', { timeout: 15000 }).should('have.length.at.least', 1)
  })

  it('E2E-PH3-002: Debería permitir alterar la cantidad de productos y eliminarlos', () => {
    cy.loginByApi(loginUser)
    cy.intercept('GET', '**/api/products*').as('getProducts')

    cy.visit('/cart')
    cy.get('body').then(($body) => {
      if ($body.find('.cart-items').length) {
        cy.contains('Vaciar carrito').click()
        cy.get('.cart-empty__title').should('be.visible')
      }
    })

    cy.visit('/')
    cy.wait('@getProducts').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get('[data-testid^="add-to-cart-"]:not(:disabled)', { timeout: 15000 }).first().click()

    cy.visit('/cart')
    cy.get('.cart-item', { timeout: 15000 }).should('have.length', 1)
    cy.get('.cart-item__qty-btn').first().click({ force: true })

    cy.contains('Quitar').click()
    cy.get('.cart-empty__title').should('be.visible').and('contain.text', 'Tu carrito está vacío')
  })

  it('E2E-PH3-003: Debería orquestar todo el Checkout hacia una confirmación exitosa con la API Real', () => {
    cy.loginByApi(loginUser)
    cy.intercept('GET', '**/api/products*').as('getProducts')
    cy.intercept('POST', '**/api/shipping-addresses').as('createShipping')
    cy.intercept('POST', '**/api/payment-methods').as('createPayment')
    cy.intercept('POST', '**/api/orders/checkout').as('createOrder')

    cy.visit('/')
    cy.wait('@getProducts').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get('[data-testid^="add-to-cart-"]:not(:disabled)', { timeout: 15000 }).first().click()

    cy.visit('/cart')
    cy.get('[data-testid="checkout-btn"]').click()
    cy.url().should('include', '/checkout')

    cy.get('[data-testid="input-name"]').clear().type(loginUser.displayName)
    cy.get('[data-testid="input-phone"]').clear().type('5551234567')
    cy.get('[data-testid="input-address"]').clear().type('123 Cyber Avenue')
    cy.get('[data-testid="input-city"]').clear().type('Ciudad Test')
    cy.get('[data-testid="input-state"]').clear().type('Estado Test')
    cy.get('[data-testid="input-postalCode"]').clear().type('12345')
    cy.get('[data-testid="input-cardHolder"]').clear().type(loginUser.displayName)
    cy.get('[data-testid="input-cardNumber"]').clear().type('4111222233334444')
    cy.get('[data-testid="input-cardExpiry"]').clear().type('12/28')
    cy.get('[data-testid="input-cardCvv"]').clear().type('123')
    cy.get('[data-testid="btn-confirmar-compra"]').click()

    cy.wait('@createShipping').its('response.statusCode').should('eq', 201)
    cy.wait('@createPayment').its('response.statusCode').should('eq', 201)
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201)

    cy.url().should('include', '/confirmation')
    cy.get('[data-testid="order-summary"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="order-summary"]').should('contain', loginUser.displayName)
  })

  it('E2E-PH3-004: Historial de Órdenes muestra compras reales del usuario autenticado', () => {
    cy.createOrderForUser(loginUser).then(({ order }) => {
      cy.wrap(order._id).as('seededOrderId')
    })

    cy.loginByApi(loginUser)
    cy.intercept('GET', '**/api/orders/user/*').as('getOrders')

    cy.visit('/orders')
    cy.wait('@getOrders').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-cy="orders-list"]').should('be.visible')
    cy.get('@seededOrderId').then((seededOrderId) => {
      cy.contains('[data-cy="order-id"]', seededOrderId).should('be.visible')
    })
  })
})
