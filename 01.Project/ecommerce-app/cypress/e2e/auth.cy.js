describe("Flujos de Autenticación", () => {
    const testUser = {
        name: "Cypress Tester",
        email: `test-${Date.now()}@example.com`,
        password: "password123",
    };

    beforeEach(() => {
        // Limpiar localStorage antes de cada prueba
        cy.clearLocalStorage();
    });

    describe("Registro", () => {
        it("debería mostrar errores de validación si los campos están vacíos", () => {
            cy.visit("/register");
            cy.get('[data-cy="register-submit"]').click();

            // La validación nativa de HTML5 podría impedir el submit
            // Pero si hay mensajes de error en el DOM, los buscamos
            cy.get('[data-cy="displayName"]').should("have.attr", "required");
            cy.get('[data-cy="email"]').should("have.attr", "required");
        });

        it("debería fallar si las contraseñas no coinciden", () => {
            cy.visit("/register");
            cy.get('[data-cy="displayName"]').type(testUser.name);
            cy.get('[data-cy="email"]').type(testUser.email);
            cy.get('[data-cy="password"]').type(testUser.password);
            cy.get('[data-cy="verifyPassword"]').type("different_password");

            cy.get('[data-cy="register-submit"]').click();

            // Debería mostrar un mensaje de error (ErrorMessage)
            cy.get('.error-message').should('be.visible').and('contain', 'no coinciden');
        });

        it("debería registrar un nuevo usuario exitosamente", () => {
            // Mock de la API si es necesario, o usar la real
            // cy.intercept('POST', '**/auth/register', { statusCode: 201, body: { success: true } }).as('registerReq');

            cy.visit("/register");
            cy.get('[data-cy="displayName"]').type(testUser.name);
            cy.get('[data-cy="email"]').type(testUser.email);
            cy.get('[data-cy="password"]').type(testUser.password);
            cy.get('[data-cy="verifyPassword"]').type(testUser.password);

            cy.get('[data-cy="register-submit"]').click();

            // Debería redirigir al login tras el éxito
            cy.url().should("include", "/login");
            cy.get(".success-message").should("be.visible").and("contain", "Registro exitoso");
        });
    });

    describe("Login", () => {
        it("debería mostrar error con credenciales incorrectas", () => {
            cy.visit("/login");
            cy.get('[data-cy="email"]').type("wrong@example.com");
            cy.get('[data-cy="password"]').type("wrongpassword");
            cy.get('[data-cy="login-submit"]').click();

            cy.get('.error-message').should("be.visible");
        });

        it("debería iniciar sesión exitosamente y guardar el token", () => {
            // Nota: Este test depende de que el usuario testUser ya esté creado 
            // o de un mock de la API.

            cy.visit("/login");
            cy.get('[data-cy="email"]').type(testUser.email);
            cy.get('[data-cy="password"]').type(testUser.password);
            cy.get('[data-cy="login-submit"]').click();

            // Debería redirigir al home
            cy.url().should("eq", Cypress.config().baseUrl + "/");

            // Verificar localStorage
            cy.window().then((window) => {
                expect(window.localStorage.getItem("authToken")).to.not.be.null;
            });
        });
    });
});
