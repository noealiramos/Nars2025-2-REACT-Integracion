describe('Orders Feature - API Real', () => {
  const seededUser = {
    displayName: 'Orders QA',
    email: `orders-${Date.now()}@mail.com`,
    password: 'password123',
  }

  const emptyUser = {
    displayName: 'Orders Empty QA',
    email: `orders-empty-${Date.now()}@mail.com`,
    password: 'password123',
  }

  let seededOrderId

  before(() => {
    cy.createOrderForUser(seededUser).then(({ order }) => {
      seededOrderId = order._id
    })

    cy.ensureUser(emptyUser)
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()
  })

  it('ASOS-001: Usuario autenticado puede ver sus órdenes', () => {
    cy.loginByApi(seededUser)
    cy.intercept('GET', '**/api/orders/user/*').as('getOrders')

    cy.visit('/orders')
    cy.wait('@getOrders').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-cy="orders-list"]').should('be.visible')
    cy.get('[data-cy="order-card"]').should('have.length.at.least', 1)
    cy.get('[data-cy="order-id"]').first().should('contain', seededOrderId)
  })

  it('ASOS-002: Usuario puede ver el detalle de una orden', () => {
    cy.loginByApi(seededUser)
    cy.intercept('GET', '**/api/orders/user/*').as('getOrders')
    cy.intercept('GET', `**/api/orders/${seededOrderId}`).as('getOrderDetail')

    cy.visit('/orders')
    cy.wait('@getOrders').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-cy="order-view-detail"]').first().click()
    cy.wait('@getOrderDetail').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.url().should('include', `/orders/${seededOrderId}`)
    cy.get('[data-cy="order-detail-card"]').should('be.visible')
    cy.get('[data-cy="order-detail-id"]').should('contain', seededOrderId)
    cy.get('[data-cy="order-detail-items"]').should('be.visible')
    cy.get('[data-cy="order-detail-total"]').should('be.visible')
  })

  it('ASOS-003: Maneja correctamente la lista vacía', () => {
    cy.loginByApi(emptyUser)
    cy.intercept('GET', '**/api/orders/user/*').as('getOrders')

    cy.visit('/orders')
    cy.wait('@getOrders').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-cy="orders-empty"]').should('be.visible')
    cy.get('[data-cy="orders-empty-action"]').should('be.visible')
    cy.get('[data-cy="order-card"]').should('not.exist')
  })
})
