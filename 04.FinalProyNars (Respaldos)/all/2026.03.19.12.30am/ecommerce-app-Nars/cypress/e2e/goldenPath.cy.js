describe('Golden Path - E-commerce Shopping Flow', () => {
  const testUser = {
    email: 'ali.ramos@mail.com', 
    password: '123456'
  }

  beforeEach(() => {
    // 1. Aislamiento del Estado: limpieza a fondo
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()

    // 2. Interceptar peticiones iniciales para asegurar carga de datos (Evitar flakiness)
    cy.intercept('GET', '**/api/products*').as('getInitialProducts')
  })

  it('Debería completar satisfactoriamente una compra desde búsqueda hasta confirmación', () => {
    // Visitar Home y esperar API
    cy.visit('/')
    cy.wait('@getInitialProducts').its('response.statusCode').should('eq', 200)
    
    // Verificamos carga real mediante un anchor estructural
    cy.get('header').should('be.visible').and('contain.text', 'Ramdi Jewerly')
    
    // Búsqueda. Interceptamos para no depender del timing de tipeo
    cy.intercept('GET', '**/api/products/search*').as('searchProducts')
    cy.get('[data-testid="search-input"]').type('anillo{enter}')
    cy.wait('@searchProducts').its('response.statusCode').should('be.oneOf', [200, 304])
    
    // Validamos respuesta renderizada
    cy.get('.product-card').should('have.length.greaterThan', 0)
    
    // Entrar a detalle del PRIMER producto encontrado (agnóstico al ID real)
    cy.intercept('GET', '**/api/products/*').as('getProductDetails')
    cy.get('[data-testid^="view-detail-"]').first().click()
    cy.wait('@getProductDetails').its('response.statusCode').should('eq', 200)
    
    // Validar visualización de detalle usando la etiqueta main y un price element visible
    cy.get('main').should('be.visible')
    cy.get('.product-detail__price').should('be.visible')

    // Acción de Cesta
    cy.get('[data-testid="add-to-cart-detail"]').click()
    
    // Assertion sobre estado derivado: el Header Badge
    cy.get('[data-testid="cart-badge"]').should('be.visible').and('have.text', '1')

    // Acción de navegación al carrito
    cy.get('[data-testid="nav-cart"]').click()
    cy.url().should('include', '/cart')
    
    // Validación de renderizado del item en carrito
    cy.get('.cart-item').should('have.length', 1)
    
    // Transición Protegida a Checkout
    cy.get('[data-testid="checkout-btn"]').click()
    
    // El PrivateRoute del frontend debe hacer el redirect inmediato (es síncrono por la falta de user autenticado en context)
    cy.url().should('include', '/login')
    
    // Ejecución de Login interceptado
    cy.intercept('POST', '**/api/auth/login').as('loginReq')
    
    cy.get('[data-testid="input-email"]').type(testUser.email)
    cy.get('[data-testid="input-password"]').type(testUser.password)
    cy.get('[data-testid="btn-entrar"]').click()
    
    // Esperamos la API y validamos redirección post-login
    cy.wait('@loginReq').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/checkout')
    
    // Llenar formulario de Checkout - Independiente del prellenado (usamos clear() para robustez)
    cy.get('[data-testid="input-name"]').clear().type('Ali Ramos QA')
    cy.get('[data-testid="input-phone"]').type('5512345678')
    cy.get('[data-testid="input-address"]').type('Av Reforma 123')
    cy.get('[data-testid="input-city"]').type('Ciudad de Mexico')
    cy.get('[data-testid="input-state"]').type('CDMX')
    cy.get('[data-testid="input-postalCode"]').type('11000')

    cy.get('[data-testid="input-cardHolder"]').clear().type('Ali Ramos QA')
    cy.get('[data-testid="input-cardNumber"]').type('4111111111111111')
    cy.get('[data-testid="input-cardExpiry"]').type('12/28')
    cy.get('[data-testid="input-cardCvv"]').type('123')
    
    // Configuración de chain requests endpoints
    cy.intercept('POST', '**/api/shipping-addresses').as('createShipping')
    cy.intercept('POST', '**/api/payment-methods').as('createPayment')
    cy.intercept('POST', '**/api/orders').as('createOrder')
    
    // Validar el botón confirmando.
    cy.get('[data-testid="btn-confirmar-compra"]').click()
    
    // Asegurar sincronización con tiempos de red (pueden ser lentos en pipeline)
    cy.wait('@createShipping').its('response.statusCode').should('eq', 201)
    cy.wait('@createPayment').its('response.statusCode').should('eq', 201)
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201)
    
    // Validar Confirmación
    cy.url().should('include', '/confirmation')
    cy.get('[data-testid="order-summary"]').should('be.visible') // Usando testid explícito
    cy.contains('ID de orden').should('be.visible')
    
    // Validación de limpieza de contexto local: el badge debe desaparecer 
    cy.get('[data-testid="cart-badge"]').should('not.exist')
  })
})
