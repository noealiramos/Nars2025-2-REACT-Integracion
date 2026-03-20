describe('Flujos Adversos - Autenticación', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearAllSessionStorage()
  })

  it('Debería manejar correctamente el inicio de sesión con credenciales inválidas', () => {
    cy.visit('/login')

    // Esperar a que el formulario se haya pintado antes de interactuar
    cy.get('form.login-form').should('be.visible')

    // Ingresamos datos de un usuario que sabemos que fallará (No registrado / Mal password)
    cy.get('[data-testid="input-email"]').type('invitado.falso@mail.com')
    cy.get('[data-testid="input-password"]').type('11111111') // Pass erróneo

    // Interceptamos la petición para validar la respuesta del servidor (Comportamiento Adverso)
    cy.intercept('POST', '**/api/auth/login').as('loginReqFailed')
    
    // Disparamos el login
    cy.get('[data-testid="btn-entrar"]').click()

    // Validamos que la API responda con un HTTP status en rango de error de cliente (4xx) o no autorizado (401)
    cy.wait('@loginReqFailed').its('response.statusCode').should('eq', 400).or('eq', 401)

    // Assertion crítica: la interfaz debe informar al usuario del error, usando el componente adecuado (.)
    // Buscamos el párrafo de error (según la estructura en LoginPage.jsx)
    cy.get('.login-form__error')
      .should('be.visible')
      .and('not.be.empty') // El mensaje exacto depende del backend, nos aseguramos que haya texto
  })
})
