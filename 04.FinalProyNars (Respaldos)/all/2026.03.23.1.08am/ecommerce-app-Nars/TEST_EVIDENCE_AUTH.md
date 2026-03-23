# Evidencia de Pruebas: Autenticación (API Real)

## Resumen General de Pruebas

- **Objetivo**: Asegurar el ciclo de la suite de E2E sobre un Backend real y mitigar cualquier brecha previamente tapada por mocks o stubs.
- **Suite**: `cypress/e2e/auth.cy.js`
- **Resultados de Ejecución**: 0 Fallos / 4 Exitosas (100% Passed)
- **Modalidad**: Backend Real Express corriendo sobre `http://localhost:3000`

## Casos Ejecutados en `auth.cy.js`

### AUTH-001: Debería permitir registrarse exitosamente
- **Resultado**: PASSED (Aprobado)
- **Modo**: API Real (Sin stubs)
- **Datos generados al vuelo**: 
  - `displayName`: Cypress Test
  - `email`: test-[TIMESTAMP]@example.com
  - `password`: password123
- **Observaciones**: Registrado adecuadamente en Mongo y devuelto al Home en la confirmación de Frontend luego del Autologin con su nombre correcto ("Hola, Cypress Test"). 

### AUTH-002: Debería mostrar error de la API al intentar registrar un usuario duplicado
- **Resultado**: PASSED (Aprobado)
- **Modo**: API Real (Sin stubs, usando Intercept solo para la validación de `.as("registerDupReq")`)
- **Datos de prueba**: Utilizó intencionalmente las credenciales únicas ya registradas en MongoDB provenientes del `loginUser` (antes de que Cypress comience cada test) para detonar un 409 Conflict real de Mongo.
- **Observaciones**: Mensaje capturado adecuadamente, evitando cualquier renderizado inconsistente. Se expone un mensaje claro indicando "Email already...".

### AUTH-003: Debería permitir iniciar sesión exitosamente con credenciales válidas
- **Resultado**: PASSED (Aprobado)
- **Modo**: API Real (Sin stubs)
- **Datos de prueba**: Usuario y Contraseña exactos generados en la API a través de `cy.request()` previo a correr los IT.
- **Observaciones**: Conectado e inyectado token de acceso y de refresco, verificado redircción al `/` con "Hola, Login QA User".

### AUTH-004: Debería manejar correctamente el inicio de sesión con credenciales inválidas
- **Resultado**: PASSED (Aprobado)
- **Modo**: API Real 
- **Datos de prueba controlables**: 
  - `email`: fake.user123@mail.com
  - `password`: wrongpass
- **Observaciones**: Recibe 400 Bad Request / 401 del Backend, arrojando el texto de error "Credenciales incorrectas" al DOM y deshabilitando cualquier navegación.
