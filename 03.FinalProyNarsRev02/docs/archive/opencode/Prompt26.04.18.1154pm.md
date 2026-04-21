Actúa como Senior QA Engineer + Frontend/Backend Integration Engineer.

CONTEXTO:
Proyecto full stack:
- Backend: ecommerce-api-Nars
- Frontend: ecommerce-app-Nars

ESTADO ACTUAL:
- Suite backend completa: PASS
- Suite frontend completa: PASS
- Suite E2E Cypress: 12/13 specs PASS
- Solo queda 1 falla en:
  `cypress/e2e/authLifecycle.cy.js`

FALLA ACTUAL:
Test:
- `cierra la sesion y redirige a login cuando el refresh ya fue revocado`

Error:
- `AssertionError: expected 404 to equal 200`
- origen reportado en:
  `cypress/support/commands.js:279:33`

OBJETIVO:
Corregir de forma mínima, limpia y mantenible la falla del test E2E `authLifecycle.cy.js`, alineándolo con el comportamiento real actual del sistema, sin romper los demás tests y sin tocar lógica de negocio innecesariamente.

IMPORTANTE:
NO quiero sobreingeniería.
NO quiero abrir refactors grandes.
NO quiero “parchar” a ciegas.
Quiero diagnóstico breve, corrección precisa y revalidación completa de E2E.

---

## REGLAS

1. Primero diagnosticar, luego implementar.
2. Cambios mínimos.
3. No tocar backend salvo que sea estrictamente necesario y esté claramente justificado.
4. Si el problema es que el test quedó desalineado con una ruta/helper ya inexistente o cambiada, corregir el test o helper.
5. Si el problema es que el helper usa un endpoint de soporte que ya no debe existir, ajustar la estrategia de prueba.
6. Documentar TODO con salida completa de terminal.
7. Documento con fecha y hora obligatorio.

---

## FASE 1 — DIAGNÓSTICO RÁPIDO

Revisar:

1. `cypress/e2e/authLifecycle.cy.js`
2. `cypress/support/commands.js`
3. cualquier helper/ruta usada para revocar refresh token o forzar logout
4. si existe dependencia de:
   - `ENABLE_TEST_AUTH_TOOLS`
   - rutas auxiliares de test auth
   - endpoints que hoy responden `404`
5. confirmar:
   - cuál endpoint o helper espera `200`
   - por qué hoy devuelve `404`
   - si el fallo está en el test, en el helper o en una ruta ya eliminada/cambiada

ENTREGABLE:
- causa raíz exacta
- archivo(s) implicados
- solución recomendada

NO IMPLEMENTAR TODAVÍA.

---

## FASE 2 — IMPLEMENTACIÓN MÍNIMA

Aplicar la corrección más pequeña y correcta.

Ejemplos válidos solo si aplican:
- actualizar helper Cypress
- ajustar expectativa del test
- reemplazar uso de ruta obsoleta
- cambiar estrategia para revocar sesión usando flujo real soportado

Evitar:
- hacks temporales
- desactivar test
- comentar asserts
- meter lógica nueva innecesaria al backend

---

## FASE 3 — VALIDACIÓN

Ejecutar:

1. spec puntual:
```bash
npx cypress run --spec cypress/e2e/authLifecycle.cy.js