# MP-04-EXEC-PRO

Ejecuta MP-04 en modo disciplinado, incremental y sin romper contratos existentes.

---

## OBJETIVO

Reducir fricción en checkout permitiendo reutilizar:

* direcciones de envío existentes
* métodos de pago existentes

SIN romper:

* flujo actual de checkout
* contratos de API
* E2E existentes

---

## REGLAS ESTRICTAS

1. NO modificar backend
2. NO cambiar endpoints ni payloads
3. NO hacer refactor grande
4. NO introducir nuevas librerías
5. NO romper flujo actual
6. UN SOLO archivo final:
   docs/Resultado_MP-04-YYYY-MM-DD-HHMM.md, nota: también tiene que incluir textualmente lo que plasmes en la "terminal"

---

## UX DEFINITIVA (SIN AMBIGÜEDAD)

### Caso 1: existen datos previos

Mostrar:

* lista seleccionable de direcciones
* lista seleccionable de métodos de pago

Opciones visibles:

* usar existente
* usar nuevo

---

### Caso 2: NO existen datos

* mostrar formulario actual sin cambios

---

### Caso 3: usuario selecciona existente

* NO mostrar formulario completo
* usar directamente ese dato

---

### Caso 4: usuario selecciona “nuevo”

* mostrar formulario normal
* permitir captura completa

---

## REGLA CRÍTICA

Nunca mezclar:

* datos seleccionados
* datos del formulario

Debe existir UNA sola fuente de verdad.

---

## IMPLEMENTACIÓN

### 1) CheckoutPage.jsx

* detectar si existen datos previos

* manejar estado:

  * selectedAddress
  * selectedPayment

* condicionar UI según selección

---

### 2) Componentes

* lista de selección (radio buttons o similar)
* fallback a formulario

---

### 3) Integración con checkout

* si hay selección → usar ese objeto
* si no → usar datos del form

---

## TESTS UNIT/COMPONENT

Cubrir:

* render con datos previos
* selección correcta
* cambio entre existente y nuevo
* envío correcto de datos

---

## E2E

### Escenario 1

usuario con datos previos:

* login
* checkout
* seleccionar existente
* completar compra

---

### Escenario 2

usuario sin datos:

* flujo normal intacto

---

### Escenario 3

usuario cambia a “nuevo”:

* formulario aparece
* compra exitosa

---

## VALIDACIÓN POR ETAPAS

1. Implementación mínima

   * npm test
   * npm run build

2. Ajuste UI

   * npm test
   * npm run build

3. Tests unitarios

   * npm test
   * npm run build

4. E2E

   * ejecutar checkout.cy.js o equivalente
   * validar flujo completo

5. Regresión

   * auth.cy.js
   * cart.cy.js

---

## DOCUMENTACIÓN FINAL

Archivo único:

docs/Resultado_MP-04-YYYY-MM-DD-HHMM.md

Debe incluir:

1. Resumen ejecutivo
2. Alcance
3. UX implementada
4. Archivos modificados
5. Implementación
6. Validación completa
7. Impacto en contratos
8. Riesgos
9. Evidencia real
10. Decisión final

---

## CRITERIO DE ÉXITO

* usuario puede reutilizar datos
* flujo actual NO se rompe
* tests pasan
* E2E pasan
* build OK

---

## INSTRUCCIÓN FINAL

Ejecuta sin improvisar.
No expandas alcance.
No rompas contratos.
Documenta todo.

Detente al finalizar.
