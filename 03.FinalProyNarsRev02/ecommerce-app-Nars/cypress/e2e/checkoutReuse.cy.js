describe('Phase 2 Hardening - Checkout Reuse', () => {
  const uniqueSuffix = Date.now()
  const testUser = {
    displayName: 'Checkout Reuse QA',
    email: `checkout-reuse-${uniqueSuffix}@mail.com`,
    password: 'Password123!',
  }

  const seedCheckoutData = {
    phone: '5511111111',
    address: 'Av. Insurgentes 501',
    city: 'Ciudad de Mexico',
    state: 'CDMX',
    postalCode: '03100',
    cardHolder: 'Checkout Reuse QA',
    cardNumber: '4111111111111111',
    cardExpiry: '12/29',
    cardCvv: '123',
    saveAsDefault: true,
  }

  const openCheckoutWithNewCart = () => {
    cy.addFirstProductToCartViaUi()
    cy.visit('/cart')
    cy.get('.cart-item', { timeout: 15000 }).should('have.length.at.least', 1)
    cy.get('[data-testid="checkout-btn"]').click()
    cy.url().should('include', '/checkout')
    cy.get('form.checkout-form').should('be.visible')
  }

  const fillShippingForm = (overrides = {}) => {
    const shippingData = {
      name: testUser.displayName,
      phone: '5522222222',
      address: `Calle Nueva ${Date.now()}`,
      city: 'Guadalajara',
      state: 'Jalisco',
      postalCode: '44100',
      ...overrides,
    }

    cy.get('[data-testid="input-name"]').clear().type(shippingData.name)
    cy.get('[data-testid="input-phone"]').clear().type(shippingData.phone)
    cy.get('[data-testid="input-address"]').clear().type(shippingData.address)
    cy.get('[data-testid="input-city"]').clear().type(shippingData.city)
    cy.get('[data-testid="input-state"]').clear().type(shippingData.state)
    cy.get('[data-testid="input-postalCode"]').clear().type(shippingData.postalCode)
  }

  const fillPaymentForm = (overrides = {}) => {
    const paymentData = {
      cardHolder: testUser.displayName,
      cardNumber: '4000000000000002',
      cardExpiry: '11/30',
      cardCvv: '456',
      ...overrides,
    }

    cy.get('[data-testid="input-cardHolder"]').clear().type(paymentData.cardHolder)
    cy.get('[data-testid="input-cardNumber"]').clear().type(paymentData.cardNumber)
    cy.get('[data-testid="input-cardExpiry"]').clear().type(paymentData.cardExpiry)
    cy.get('[data-testid="input-cardCvv"]').clear().type(paymentData.cardCvv)
  }

  const prepareCreationCounters = () => {
    const counters = {
      shipping: 0,
      payment: 0,
    }

    cy.intercept('POST', '**/api/shipping-addresses', (req) => {
      counters.shipping += 1
      req.continue()
    }).as('createShippingResource')

    cy.intercept('POST', '**/api/payment-methods', (req) => {
      counters.payment += 1
      req.continue()
    }).as('createPaymentResource')

    cy.intercept('POST', '**/api/orders/checkout').as('createOrder')

    return counters
  }

  const assertSuccessfulOrder = () => {
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201)
    cy.url().should('include', '/confirmation')
    cy.get('[data-testid="order-summary"]', { timeout: 15000 }).should('be.visible')
  }

  before(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()

    cy.registerUserViaUi(testUser)
    openCheckoutWithNewCart()
    cy.completeCheckoutViaUi(testUser, seedCheckoutData).its('response.statusCode').should('eq', 201)
    cy.visit('/')
    cy.logoutViaUi()
  })

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()
    cy.loginUserViaUi(testUser)
  })

  it('completa existing / existing sin recrear shipping ni payment', () => {
    cy.intercept('GET', '**/api/shipping-addresses').as('getShippingOptions')
    cy.intercept('GET', '**/api/payment-methods/user/*').as('getPaymentOptions')

    openCheckoutWithNewCart()

    cy.wait('@getShippingOptions').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getPaymentOptions').its('response.statusCode').should('be.oneOf', [200, 304])

    const counters = prepareCreationCounters()

    cy.get('[data-testid="saved-shipping-options"]', { timeout: 15000 }).should('be.visible')
    cy.get('[data-testid="saved-payment-options"]', { timeout: 15000 }).should('be.visible')
    cy.get('[data-testid="shipping-option-new"]').should('not.be.checked')
    cy.get('[data-testid="payment-option-new"]').should('not.be.checked')
    cy.get('[data-testid="input-phone"]').should('be.disabled')
    cy.get('[data-testid="input-cardNumber"]').should('be.disabled').invoke('val').should('include', '1111')

    cy.get('[data-testid="btn-confirmar-compra"]').click()
    assertSuccessfulOrder()

    cy.wrap(null).then(() => {
      expect(counters.shipping).to.eq(0)
      expect(counters.payment).to.eq(0)
    })
  })

  it('completa new / existing creando solo shipping nuevo', () => {
    cy.intercept('GET', '**/api/shipping-addresses').as('getShippingOptions')
    cy.intercept('GET', '**/api/payment-methods/user/*').as('getPaymentOptions')

    openCheckoutWithNewCart()

    cy.wait('@getShippingOptions').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getPaymentOptions').its('response.statusCode').should('be.oneOf', [200, 304])

    const counters = prepareCreationCounters()

    cy.get('[data-testid="shipping-option-new"]').check()
    cy.get('[data-testid="input-phone"]').should('not.be.disabled').and('have.value', '')
    cy.get('[data-testid="input-cardNumber"]').should('be.disabled')
    fillShippingForm({
      phone: '5533333333',
      address: `Av. Vallarta ${uniqueSuffix}`,
      city: 'Zapopan',
      state: 'Jalisco',
      postalCode: '45040',
    })

    cy.get('[data-testid="btn-confirmar-compra"]').click()
    assertSuccessfulOrder()

    cy.wrap(null).then(() => {
      expect(counters.shipping).to.eq(1)
      expect(counters.payment).to.eq(0)
    })
  })

  it('completa existing / new creando solo payment nuevo', () => {
    cy.intercept('GET', '**/api/shipping-addresses').as('getShippingOptions')
    cy.intercept('GET', '**/api/payment-methods/user/*').as('getPaymentOptions')

    openCheckoutWithNewCart()

    cy.wait('@getShippingOptions').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getPaymentOptions').its('response.statusCode').should('be.oneOf', [200, 304])

    const counters = prepareCreationCounters()

    cy.get('[data-testid="payment-option-new"]').check()
    cy.get('[data-testid="input-phone"]').should('be.disabled')
    cy.get('[data-testid="input-cardNumber"]').should('not.be.disabled').and('have.value', '')
    fillPaymentForm({
      cardNumber: '5555555555554444',
      cardExpiry: '10/31',
      cardCvv: '321',
    })

    cy.get('[data-testid="btn-confirmar-compra"]').click()
    assertSuccessfulOrder()

    cy.wrap(null).then(() => {
      expect(counters.shipping).to.eq(0)
      expect(counters.payment).to.eq(1)
    })
  })

  it('completa new / new creando ambos recursos antes de la orden', () => {
    cy.intercept('GET', '**/api/shipping-addresses').as('getShippingOptions')
    cy.intercept('GET', '**/api/payment-methods/user/*').as('getPaymentOptions')

    openCheckoutWithNewCart()

    cy.wait('@getShippingOptions').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getPaymentOptions').its('response.statusCode').should('be.oneOf', [200, 304])

    const counters = prepareCreationCounters()

    cy.get('[data-testid="shipping-option-new"]').check()
    cy.get('[data-testid="payment-option-new"]').check()
    cy.get('[data-testid="input-phone"]').should('not.be.disabled')
    cy.get('[data-testid="input-cardNumber"]').should('not.be.disabled')

    fillShippingForm({
      phone: '5544444444',
      address: `Blvd. Independencia ${uniqueSuffix}`,
      city: 'Torreon',
      state: 'Coahuila',
      postalCode: '27000',
    })
    fillPaymentForm({
      cardNumber: '378282246310005',
      cardExpiry: '09/32',
      cardCvv: '1234',
    })

    cy.get('[data-testid="input-save-default"]').check()
    cy.get('[data-testid="btn-confirmar-compra"]').click()
    assertSuccessfulOrder()

    cy.wrap(null).then(() => {
      expect(counters.shipping).to.eq(1)
      expect(counters.payment).to.eq(1)
    })
  })

  it('permite fallback manual cuando falla la carga remota de shipping y payment', () => {
    cy.intercept('GET', '**/api/shipping-addresses', {
      statusCode: 500,
      body: { error: 'shipping load failed for qa' },
    }).as('getShippingOptionsError')
    cy.intercept('GET', '**/api/payment-methods/user/*', {
      statusCode: 500,
      body: { error: 'payment load failed for qa' },
    }).as('getPaymentOptionsError')

    openCheckoutWithNewCart()

    cy.wait('@getShippingOptionsError').its('response.statusCode').should('eq', 500)
    cy.wait('@getPaymentOptionsError').its('response.statusCode').should('eq', 500)

    const counters = prepareCreationCounters()

    cy.get('[data-testid="saved-data-error"]', { timeout: 15000 })
      .should('be.visible')
      .and('contain.text', 'No pudimos actualizar todos tus datos guardados')
    cy.get('[data-testid="saved-shipping-options"]').should('not.exist')
    cy.get('[data-testid="saved-payment-options"]').should('not.exist')
    cy.get('[data-testid="input-phone"]').should('not.be.disabled')
    cy.get('[data-testid="input-cardNumber"]').should('not.be.disabled')

    fillShippingForm({
      phone: '5555555555',
      address: `Manual Fallback ${uniqueSuffix}`,
      city: 'Puebla',
      state: 'Puebla',
      postalCode: '72000',
    })
    fillPaymentForm({
      cardNumber: '6011111111111117',
      cardExpiry: '08/33',
      cardCvv: '987',
    })

    cy.get('[data-testid="btn-confirmar-compra"]').click()
    assertSuccessfulOrder()

    cy.wrap(null).then(() => {
      expect(counters.shipping).to.eq(1)
      expect(counters.payment).to.eq(1)
    })
  })
})
