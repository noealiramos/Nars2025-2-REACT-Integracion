const API_URL = 'http://localhost:3001/api'
const AUTH_TEST_API_URL = API_URL
const AUTH_TEST_ACCESS_TOKEN_WAIT_MS = 42000

const getCollectionItems = (body, key) => {
  if (Array.isArray(body)) return body
  if (Array.isArray(body?.[key])) return body[key]
  if (Array.isArray(body?.items)) return body.items
  return []
}

const unwrapEntity = (body, primaryKey) => body?.[primaryKey] || body?.data || body

const requestWithRetry = (requestOptions, retries = 3) => {
  return cy.request({
    failOnStatusCode: false,
    ...requestOptions,
  }).then((response) => {
    if (response.status !== 429 || retries <= 0) {
      return response
    }

    const retryAfterHeader = response.headers?.['retry-after']
    const retryAfterSeconds = Number.parseInt(retryAfterHeader, 10)
    const waitMs = Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : 3000

    cy.wait(waitMs)
    return requestWithRetry(requestOptions, retries - 1)
  })
}

Cypress.Commands.add('ensureUser', (user) => {
  requestWithRetry({
    method: 'POST',
    url: `${API_URL}/auth/register`,
    body: {
      displayName: user.displayName,
      email: user.email,
      password: user.password,
    },
  }).then((response) => {
    expect([201, 409]).to.include(response.status)
  })
})

Cypress.Commands.add('loginByApi', (user) => {
  cy.ensureUser(user)

  cy.session(user.email, () => {
    cy.wait(1100)
    requestWithRetry({
      method: 'POST',
      url: `${API_URL}/auth/login`,
      body: {
        email: user.email,
        password: user.password,
      },
    }).then(({ body }) => {
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('accessToken', body.accessToken)
          win.localStorage.setItem('refreshToken', body.refreshToken)
          win.localStorage.setItem('userData', JSON.stringify(body.user))
        },
      })
    })
  })

  cy.visit('/')
})

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-cy="input-email"]').clear().type(email)
  cy.get('[data-cy="input-password"]').clear().type(password)
  cy.get('[data-cy="btn-entrar"]').click()
})

Cypress.Commands.add('registerUserViaUi', (user) => {
  cy.intercept('POST', '**/api/auth/register').as('registerReq')
  cy.visit('/register')
  cy.get('[data-testid="input-name"]').clear().type(user.displayName)
  cy.get('[data-testid="input-email"]').clear().type(user.email)
  cy.get('[data-testid="input-password"]').clear().type(user.password)
  cy.get('[data-testid="btn-crear-cuenta"]').click()
  cy.wait('@registerReq').its('response.statusCode').should('eq', 201)
  cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  cy.get('.site-header').should('contain', user.displayName)
})

Cypress.Commands.add('loginUserViaUi', (user, expectedPath = '/') => {
  cy.intercept('POST', '**/api/auth/login').as('loginReq')
  cy.visit('/login')
  cy.get('[data-testid="input-email"]').clear().type(user.email)
  cy.get('[data-testid="input-password"]').clear().type(user.password)
  cy.get('[data-testid="btn-entrar"]').click()
  cy.wait('@loginReq').its('response.statusCode').should('eq', 200)
  cy.url().should('include', expectedPath)
  cy.get('.site-header').should('contain', user.displayName)
})

Cypress.Commands.add('logoutViaUi', () => {
  cy.get('[data-cy="logout-button"]').click()
  cy.get('.site-header').should('contain', 'Inicia sesión')
})

Cypress.Commands.add('addFirstProductToCartViaUi', () => {
  cy.intercept('GET', '**/api/products*').as('getProducts')
  cy.visit('/')
  cy.wait('@getProducts').its('response.statusCode').should('be.oneOf', [200, 304])
  cy.get('.product-card', { timeout: 15000 }).should('have.length.greaterThan', 0)

  cy.get('[data-testid^="add-to-cart-"]', { timeout: 15000 })
    .filter(':visible:not(:disabled)')
    .should('have.length.greaterThan', 0)
    .first()
    .should('not.contain', 'Agotado')
    .click()
})

Cypress.Commands.add('openFirstAvailableProductDetailViaUi', () => {
  cy.intercept('GET', '**/api/products*').as('getProducts')
  cy.visit('/')
  cy.wait('@getProducts').its('response.statusCode').should('be.oneOf', [200, 304])
  cy.get('.product-card', { timeout: 15000 }).should('have.length.greaterThan', 0)

  cy.get('[data-testid^="add-to-cart-"]', { timeout: 15000 })
    .filter(':visible:not(:disabled)')
    .should('have.length.greaterThan', 0)
    .first()
    .should('not.contain', 'Agotado')
    .closest('.product-card')
    .find('[data-testid^="view-detail-"]')
    .should('be.visible')
    .click()
})

Cypress.Commands.add('completeCheckoutViaUi', (user, overrides = {}) => {
  const checkoutData = {
    name: user.displayName,
    phone: '5512345678',
    address: 'Av Reforma 123',
    city: 'Ciudad de Mexico',
    state: 'CDMX',
    postalCode: '11000',
    cardHolder: user.displayName,
    cardNumber: '4111111111111111',
    cardExpiry: '12/29',
    cardCvv: '123',
    saveAsDefault: false,
    ...overrides,
  }

  cy.intercept('POST', '**/api/shipping-addresses').as('createShipping')
  cy.intercept('POST', '**/api/payment-methods').as('createPayment')
  cy.intercept('POST', '**/api/orders/checkout').as('createOrder')

  cy.get('form.checkout-form').should('be.visible')
  cy.get('[data-testid="input-name"]').clear().type(checkoutData.name)
  cy.get('[data-testid="input-phone"]').clear().type(checkoutData.phone)
  cy.get('[data-testid="input-address"]').clear().type(checkoutData.address)
  cy.get('[data-testid="input-city"]').clear().type(checkoutData.city)
  cy.get('[data-testid="input-state"]').clear().type(checkoutData.state)
  cy.get('[data-testid="input-postalCode"]').clear().type(checkoutData.postalCode)
  cy.get('[data-testid="input-cardHolder"]').clear().type(checkoutData.cardHolder)
  cy.get('[data-testid="input-cardNumber"]').clear().type(checkoutData.cardNumber)
  cy.get('[data-testid="input-cardExpiry"]').clear().type(checkoutData.cardExpiry)
  cy.get('[data-testid="input-cardCvv"]').clear().type(checkoutData.cardCvv)
  if (checkoutData.saveAsDefault) {
    cy.get('[data-testid="input-save-default"]').check()
  }
  cy.get('[data-testid="btn-confirmar-compra"]').click()

  cy.wait('@createShipping').its('response.statusCode').should('eq', 201)
  cy.wait('@createPayment').its('response.statusCode').should('eq', 201)
  return cy.wait('@createOrder')
})

Cypress.Commands.add('createOrderForUser', (user) => {
  const uniqueSuffix = Date.now()

  cy.ensureUser(user)

  return cy.wait(1100).then(() => requestWithRetry({
    method: 'POST',
    url: `${API_URL}/auth/login`,
    body: {
      email: user.email,
      password: user.password,
    },
  })).then(({ body: authBody }) => {
    const authHeaders = {
      Authorization: `Bearer ${authBody.accessToken}`,
    }

    return cy.request(`${API_URL}/products?limit=1`).then(({ body: productsBody }) => {
      const product = getCollectionItems(productsBody, 'products')[0]

      expect(product, 'seed product').to.exist

      return cy
        .request({
          method: 'POST',
          url: `${API_URL}/shipping-addresses`,
          headers: authHeaders,
          body: {
            name: user.displayName,
            address: `Calle QA ${uniqueSuffix}`,
            city: 'Monterrey',
            state: 'Nuevo Leon',
            postalCode: '64000',
            phone: '8112345678',
            isDefault: true,
          },
        })
        .then(({ body: shippingResponse }) => {
          const shippingBody = unwrapEntity(shippingResponse, 'address')

          return cy
            .request({
              method: 'POST',
              url: `${API_URL}/payment-methods`,
              headers: authHeaders,
              body: {
                type: 'credit_card',
                cardHolderName: user.displayName,
                expiryDate: '12/29',
                brand: 'Visa',
                last4: '4242',
                isDefault: true,
              },
            })
            .then(({ body: paymentResponse }) => {
              const paymentBody = unwrapEntity(paymentResponse, 'paymentMethod')

              return cy
                .request({
                  method: 'POST',
                  url: `${API_URL}/orders`,
                  headers: authHeaders,
                  body: {
                    products: [
                      {
                        productId: product._id,
                        quantity: 1,
                      },
                    ],
                    shippingAddress: shippingBody._id,
                    paymentMethod: paymentBody._id,
                    shippingCost: 0,
                  },
                })
                .then(({ body: orderBody }) => ({
                  order: orderBody,
                  auth: authBody,
                }))
            })
        })
    })
  })
})

Cypress.Commands.add('waitForAccessTokenToExpire', () => {
  cy.wait(AUTH_TEST_ACCESS_TOKEN_WAIT_MS)
})

Cypress.Commands.add('revokeRefreshTokensForCurrentSession', () => {
  cy.window().then((win) => {
    const refreshToken = win.localStorage.getItem('refreshToken')
    expect(refreshToken, 'refresh token for session revoke flow').to.be.a('string').and.not.be.empty

    return requestWithRetry({
      method: 'POST',
      url: `${AUTH_TEST_API_URL}/auth/logout`,
      body: {
        refreshToken,
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body?.message).to.eq('Logged out successfully')
    })
  })
})
