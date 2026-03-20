const API_URL = 'http://127.0.0.1:3000/api'

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
