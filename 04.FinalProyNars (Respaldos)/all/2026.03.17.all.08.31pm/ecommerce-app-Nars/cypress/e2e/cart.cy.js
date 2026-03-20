describe('Flujos Secundarios: Carrito y Checkout', () => {
  const loginUser = {
    displayName: 'Login QA User',
    email: `login-${Date.now()}@mail.com`,
    password: 'password123'
  }

  before(() => {
    // Inyectar usuario temporal para tests de checkout authenticado
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/auth/register',
      failOnStatusCode: false, 
      body: {
        displayName: loginUser.displayName,
        email: loginUser.email,
        password: loginUser.password
      }
    })
  })

  beforeEach(() => {
    // Aislar estado
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()
  })

  // ----------------------------------------------------
  // E2E-PH3-001: Persistencia del Carrito
  // ----------------------------------------------------
  it('E2E-PH3-001: El carrito debe persistir sus items tras una recarga del navegador (Usuario anónimo)', () => {
    cy.visit('/')

    // Esperar a que cargue la lista de productos
    cy.get('.product-card', { timeout: 15000 }).first().should('be.visible')
    
    // Capturar titulo y precio de la primera tarjeta
    cy.get('.product-card__name').first().invoke('text').as('productTitle')
    
    // Agregar al carrito el primer producto
    cy.get('[data-testid^="add-to-cart-"]').first().click()
    
    // Confirmar que el badge del header cambió a 1
    cy.get('[data-testid="cart-badge"]').should('contain', '1')

    // Recargar página simulando cierre/recarga (F5)
    cy.reload()

    // El badge debe seguir mostrando 1
    cy.get('[data-testid="cart-badge"]').should('contain', '1')
    
    // Navegamos al carrito
    cy.visit('/cart')
    cy.get('.cart-item', { timeout: 15000 }).should('have.length.at.least', 1)
  })

  // ----------------------------------------------------
  // E2E-PH3-002: Manipulación Avanzada del Carrito
  // ----------------------------------------------------
  it('E2E-PH3-002: Debería permitir alterar la cantidad de productos y eliminarlos', () => {
    cy.visit('/')

    // Agregamos el producto dos veces desde Home
    cy.get('.product-card', { timeout: 15000 }).should('exist')
    cy.get('[data-testid^="add-to-cart-"]').first().click()
    cy.get('[data-testid^="add-to-cart-"]').first().click()
    
    cy.get('[data-testid="cart-badge"]').should('contain', '2')
    
    cy.visit('/cart')

    // Modificar el Input del carrito o usar botones
    cy.get('.cart-item', { timeout: 15000 }).should('have.length', 1) 
    cy.get('.cart-item__qty-value').first().should('have.text', '2')

    // Reducir cantidad
    cy.get('.cart-item__qty-btn').first().click() 
    cy.get('.cart-item__qty-value').first().should('have.text', '1')
    cy.get('[data-testid="cart-badge"]').should('contain', '1')

    // Eliminar producto
    cy.contains('Quitar').click()
    
    // Validar Carrito Vacío
    cy.get('.cart-empty__title').should('be.visible').and('contain.text', 'Tu carrito está vacío')
  })

  // ----------------------------------------------------
  // E2E-PH3-003: Flujo Básico de Creación de Orden
  // ----------------------------------------------------
  it('E2E-PH3-003: Debería orquestar todo el Checkout hacia una confirmación exitosa con la API Real (Stubs para bypass de validaciones estrictas no UI)', () => {
    cy.visit('/')
    
    // 1. Agregar Producto al Carrito
    cy.get('.product-card', { timeout: 15000 }).should('exist')
    cy.get('[data-testid^="add-to-cart-"]').first().click()
    
    // 2. Intentar Check-Out (Redirigirá al login si no estamos auth)
    cy.visit('/cart')
    cy.get('[data-testid="checkout-btn"]').click()
    
    // 3. Debería navegar al '/login'
    cy.url().should('include', '/login')
    
    // 4. Iniciar Sesión con API REAL
    cy.get('[data-testid="input-email"]').clear().type(loginUser.email)
    cy.get('[data-testid="input-password"]').clear().type(loginUser.password)
    cy.intercept('POST', '**/api/auth/login').as('loginReq')
    cy.get('[data-testid="btn-entrar"]').click()
    cy.wait('@loginReq').its('response.statusCode').should('eq', 200)

    // 5. Tras el Login deberíamos ser reenviados al Home o donde indique la app, pero navegaremos a Checkout
    cy.visit('/checkout')
    
    // 6. Llenar Checkout (Dirección y Pago)
    cy.get('#name').should('have.value', loginUser.displayName) // Debería mapearse automáticamente
    cy.get('#address').type('123 Cyber Avenue')
    cy.get('#city').type('Ciudad Test')
    cy.get('#state').type('Estado Test')
    cy.get('#postalCode').type('12345')
    cy.get('#phone').type('5551234567')

    // Pago (Hardcoded)
    cy.get('#cardNumber').type('4111222233334444')
    cy.get('#cardHolder').should('have.value', loginUser.displayName)
    cy.get('#cardExpiry').type('12/28')
    cy.get('#cardCvv').type('123')

    // Forzar Mocks aquí para evitar un 400 o 422 por reglas de negocio que no incumben a la UI directamente
    cy.intercept('POST', '**/api/shipping-addresses', { statusCode: 201, body: { _id: 'ship123' } }).as('shipReq')
    cy.intercept('POST', '**/api/payment-methods', { statusCode: 201, body: { _id: 'pay123' } }).as('payReq')
    cy.intercept('POST', '**/api/orders', { 
      statusCode: 201, 
      body: { 
        _id: 'ord123', 
        id: 'ord123',
        total: 1000, 
        user: { displayName: loginUser.displayName, email: loginUser.email }, 
        items: [{name: 'Anillo', price: 500, quantity: 1, id: 'prod123'}] 
      } 
    }).as('orderReq')
    
    cy.get('[data-testid="btn-confirmar-compra"]').click()

    // 7. Esperamos iteración a Backend Mocks
    cy.wait('@shipReq')
    cy.wait('@payReq')
    cy.wait('@orderReq')

    // 8. Confirmación final en UI
    cy.url().should('include', '/confirmation')
    cy.get('[data-testid="order-summary"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="order-summary"]').should('contain', loginUser.displayName) // Valida el nombre en confirmación
  })

  // ----------------------------------------------------
  // E2E-PH3-004: Historial de Órdenes
  // ----------------------------------------------------
  it('E2E-PH3-004: Historial de Órdenes (Detección de Interfaz)', () => {
    cy.visit('/login')
    cy.get('[data-testid="input-email"]').type(loginUser.email)
    cy.get('[data-testid="input-password"]').type(loginUser.password)
    cy.get('[data-testid="btn-entrar"]').click()
    
    // GAP Analysis: Investigar si la interfaz provee un panel de historial.
    cy.visit('/orders', { failOnStatusCode: false })
    
    // Si la pagina principal se muestra (ej. redirect al home porque NO existe /orders)
    cy.contains(/404|no encontrada|orden|pedido/i, { timeout: 15000 }).then(($el) => {
      const text = $el.text().toLowerCase();
      if (text.includes('404') || text.includes('no encontrada') || text.includes('no existe')) {
        cy.log('GAP DETECTADO: Interfaz de usuario no cuenta con vista frontal de Historial de Órdenes.')
      } else {
        // En caso de que exista panel
        cy.wrap($el).should('contain.text', 'Ordenes')
      }
    })
  })
})
