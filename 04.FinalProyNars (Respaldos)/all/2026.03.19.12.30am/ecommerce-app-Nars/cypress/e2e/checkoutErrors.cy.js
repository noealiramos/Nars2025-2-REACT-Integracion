describe('Flujos Adversos - Checkout', () => {
  const testUser = {
    email: 'ali.ramos@mail.com', // Asumido vivo
    password: '123456'
  }

  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()

    // Preparación rápida de estado usando la GUI:
    // Añadimos 1 producto -> Login con usuario válido -> Navega a Checkout
    cy.visit('/')
    
    cy.intercept('GET', '**/api/products*').as('prods')
    cy.wait('@prods').its('response.statusCode').should('eq', 200)

    // Agrega el primero
    cy.get('[data-testid^="add-to-cart-"]').first().click()
    
    // Inicia sesión
    cy.login(testUser.email, testUser.password)
    
    // Ve a Checkout directo
    cy.visit('/checkout')
  })

  it('Debería manejar de forma segura un fallo del Backend 500 al confirmar la orden', () => {
    // Verificamos carga de Checkout    
    cy.get('[data-testid="btn-confirmar-compra"]').should('be.visible')
    
    // Rellenamos el formato sin fricción
    // Información de Envío
    cy.get('[data-testid="input-name"]').clear().type('Ali Ramos QA')
    cy.get('[data-testid="input-phone"]').type('5512345678')
    cy.get('[data-testid="input-address"]').type('Av Reforma 123')
    cy.get('[data-testid="input-city"]').type('Ciudad de Mexico')
    cy.get('[data-testid="input-state"]').type('CDMX')
    cy.get('[data-testid="input-postalCode"]').type('11000')

    // Información de Pago
    cy.get('[data-testid="input-cardHolder"]').clear().type('Ali Ramos QA')
    cy.get('[data-testid="input-cardNumber"]').type('4111111111111111')
    cy.get('[data-testid="input-cardExpiry"]').type('12/28')
    cy.get('[data-testid="input-cardCvv"]').type('123')

    // 1. Simular un fallo grave en la etapa final: la creación real del pedido (Order)
    cy.intercept('POST', '**/api/shipping-addresses').as('createShipping') // Ok
    cy.intercept('POST', '**/api/payment-methods').as('createPayment') // Ok
    
    // AQUÍ INYECTAMOS LA CONDICIÓN ADVERSA:
    // Obligamos a Cypress a interceptar el POST creando la orden y devolver un Status 500, simulando una caída de BD
    cy.intercept('POST', '**/api/orders', {
      statusCode: 500,
      body: { error: 'Internal Server Error simulando colapso de base de datos' }
    }).as('createOrderFail')

    // Disparamos evento
    cy.get('[data-testid="btn-confirmar-compra"]').click()

    // Verificamos que se ejecutó todo el ciclo, reventando en 'Order'
    cy.wait('@createShipping')
    cy.wait('@createPayment')
    cy.wait('@createOrderFail')

    // 2. Aserciones de Estabilidad (React no debe crashear la página blanca)
    // El usuario debe quedarse en la página de checkout.
    cy.url().should('include', '/checkout')
    
    // Comprobamos la presencia del texto de error estandarizado del CheckoutPage.jsx
    cy.get('.form-error')
      .should('be.visible')
      .and('contain.text', 'colapso de base de datos') 
      // Si el componente extrae msg del backend, lo renderiza. O en su defecto el fallback genérico.
      // (Por el código de CheckoutPage, toma error.response.data.error, que configuramos arriba)
      
    // Revisión del contexto: el botón no debe haberse quedado 'Procesando...' o deshabilitado infinitamente.
    cy.get('[data-testid="btn-confirmar-compra"]')
      .should('not.be.disabled')
      .and('contain.text', 'Confirmar Compra')
  })
})
