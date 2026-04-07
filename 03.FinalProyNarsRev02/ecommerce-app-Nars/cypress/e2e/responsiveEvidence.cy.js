describe('Responsive evidence closeout', () => {
  const uniqueSuffix = Date.now()
  const user = {
    displayName: 'Responsive QA User',
    email: `responsive-${uniqueSuffix}@mail.com`,
    password: 'password123',
  }

  const viewports = [
    { label: 'mobile-375x812', width: 375, height: 812 },
    { label: 'tablet-768x1024', width: 768, height: 1024 },
    { label: 'desktop-1440x900', width: 1440, height: 900 },
  ]

  const assertNoHorizontalOverflow = () => {
    cy.document().then((doc) => {
      const root = doc.documentElement
      expect(root.scrollWidth, 'document scroll width').to.be.lte(root.clientWidth + 1)
      expect(doc.body.scrollWidth, 'body scroll width').to.be.lte(root.clientWidth + 1)
    })
  }

  const assertHeaderUsable = () => {
    cy.get('.site-header').should('be.visible')
    cy.get('.site-header__nav').should('be.visible')
    cy.get('.site-header__link:visible').its('length').should('be.gte', 2)
  }

  const capture = (pageLabel, viewportLabel) => {
    cy.screenshot(`responsive-closeout/${viewportLabel}/${pageLabel}`, { capture: 'fullPage' })
  }

  before(() => {
    cy.ensureUser(user)
    cy.createOrderForUser(user)
  })

  beforeEach(() => {
    cy.loginByApi(user)
  })

  viewports.forEach((viewport) => {
    it(`verifica vistas clave en ${viewport.label}`, () => {
      cy.viewport(viewport.width, viewport.height)

      cy.visit('/')
      cy.get('.product-list, [data-testid="home-loading"], [data-testid="home-empty"]', { timeout: 15000 }).should('be.visible')
      assertHeaderUsable()
      assertNoHorizontalOverflow()
      cy.get('.product-card').first().within(() => {
        cy.get('[data-testid^="view-detail-"]').should('be.visible')
      })
      capture('home-catalog', viewport.label)

      cy.openFirstAvailableProductDetailViaUi()
      cy.get('.product-detail', { timeout: 15000 }).should('be.visible')
      assertHeaderUsable()
      assertNoHorizontalOverflow()
      cy.get('.product-detail__media').should('be.visible')
      cy.get('.product-detail__actions').should('be.visible')
      capture('product-detail', viewport.label)

      cy.visit('/cart')
      cy.addFirstProductToCartViaUi()
      cy.visit('/cart')
      cy.get('.cart-page', { timeout: 15000 }).should('be.visible')
      assertHeaderUsable()
      assertNoHorizontalOverflow()
      cy.get('.cart-items, [data-testid="guest-cart-state"], .cart-empty').should('be.visible')
      capture('cart', viewport.label)

      cy.visit('/checkout')
      cy.get('form.checkout-form', { timeout: 15000 }).should('be.visible')
      assertHeaderUsable()
      assertNoHorizontalOverflow()
      cy.get('[data-testid="input-name"]').should('be.visible')
      cy.get('[data-testid="btn-confirmar-compra"]').should('be.visible')
      capture('checkout', viewport.label)

      cy.visit('/orders')
      cy.get('.orders-page', { timeout: 15000 }).should('be.visible')
      assertHeaderUsable()
      assertNoHorizontalOverflow()
      cy.get('[data-cy="orders-list"], [data-cy="orders-empty"]').should('be.visible')
      capture('orders', viewport.label)

      cy.visit('/profile')
      cy.get('[data-testid="profile-page"]', { timeout: 15000 }).should('be.visible')
      assertHeaderUsable()
      assertNoHorizontalOverflow()
      cy.get('.profile-card').should('be.visible')
      capture('profile', viewport.label)

      cy.clearLocalStorage()
      cy.clearCookies()
      cy.clearAllSessionStorage()

      cy.visit('/login')
      cy.get('.login-card', { timeout: 15000 }).should('be.visible')
      cy.get('[data-testid="input-email"]').should('be.visible')
      cy.get('[data-testid="btn-entrar"]').should('be.visible')
      assertNoHorizontalOverflow()
      capture('login', viewport.label)

      cy.visit('/register')
      cy.get('.login-card', { timeout: 15000 }).should('be.visible')
      cy.get('[data-testid="input-name"]').should('be.visible')
      cy.get('[data-testid="btn-crear-cuenta"]').should('be.visible')
      assertNoHorizontalOverflow()
      capture('register', viewport.label)
    })
  })
})
