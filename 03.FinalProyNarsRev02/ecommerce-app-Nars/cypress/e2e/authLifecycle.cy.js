describe('Phase 2.1 - Auth Lifecycle Hardening', () => {
  const buildTestUser = (label) => ({
    displayName: `Auth Lifecycle ${label}`,
    email: `auth-lifecycle-${label.toLowerCase()}-${Date.now()}@mail.com`,
    password: 'Password123!',
  })

  const assertShortLivedAccessToken = () => {
    cy.window().then((win) => {
      const accessToken = win.localStorage.getItem('accessToken')
      const payload = JSON.parse(atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      expect(payload.exp - payload.iat).to.eq(35)
    })
  }

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()
  })

  it('renueva la sesion automaticamente tras expirar el access token', () => {
    const testUser = buildTestUser('success')
    cy.registerUserViaUi(testUser)
    cy.logoutViaUi()
    cy.loginUserViaUi(testUser)
    assertShortLivedAccessToken()

    const orderStatuses = []

    cy.intercept('GET', '**/api/orders/user/*', (req) => {
      req.on('response', (res) => {
        orderStatuses.push(res.statusCode)
      })
    }).as('getOrders')
    cy.intercept('POST', '**/api/auth/refresh').as('refreshReq')

    cy.waitForAccessTokenToExpire()
    cy.visit('/orders')

    cy.wait('@getOrders').its('response.statusCode').should('eq', 401)
    cy.wait('@refreshReq').its('response.statusCode').should('eq', 200)

    cy.url().should('include', '/orders')
    cy.get('[data-cy="orders-page"]').should('be.visible')
    cy.get('.site-header').should('contain', testUser.displayName)
    cy.wrap(null, { timeout: 15000 }).should(() => {
      expect(orderStatuses).to.include(401)
      expect(orderStatuses.some((status) => [200, 304].includes(status))).to.eq(true)
      expect([200, 304]).to.include(orderStatuses[orderStatuses.length - 1])
    })
  })

  it('cierra la sesion y redirige a login cuando el refresh ya fue revocado', () => {
    const testUser = buildTestUser('failure')
    cy.registerUserViaUi(testUser)
    cy.logoutViaUi()
    cy.loginUserViaUi(testUser)
    assertShortLivedAccessToken()
    cy.revokeRefreshTokensForCurrentSession()

    cy.intercept('GET', '**/api/orders/user/*').as('getOrders')
    cy.intercept('POST', '**/api/auth/refresh').as('refreshReq')

    cy.waitForAccessTokenToExpire()
    cy.visit('/orders')

    cy.wait('@getOrders').its('response.statusCode').should('eq', 401)
    cy.wait('@refreshReq').its('response.statusCode').should('eq', 401)
    cy.url().should('include', '/login')
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.eq(null)
      expect(win.localStorage.getItem('refreshToken')).to.eq(null)
      expect(win.localStorage.getItem('userData')).to.eq(null)
    })
    cy.get('[data-testid="btn-entrar"]').should('be.visible')
  })
})
