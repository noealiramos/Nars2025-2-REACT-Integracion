# MP-03-EXEC-PRO

Ejecuta **MP-03** en modo **implementación controlada, incremental y sin ambigüedad**.

## Objetivo exacto

Endurecer la lógica frontend para agregar productos al carrito desde:

* catálogo
* detalle de producto

aplicando reglas explícitas de:

* autenticación
* stock disponible

sin romper contratos existentes de:

* auth
* cart
* checkout

---

## Reglas estrictas obligatorias

1. **NO modificar backend**
2. **NO cambiar contratos ni payloads de auth, cart, checkout**
3. **NO hacer refactor grande**
4. **NO tocar MP-04 ni fases posteriores**
5. **NO introducir mocks/stubs en E2E**
6. **Generar UN SOLO archivo final de documentación**

   * `docs/Resultado_MP-03-YYYY-MM-DD-HHMM.md`

---

## Regla UX definitiva (SIN AMBIGÜEDAD)

Estas reglas deben aplicarse **igual** en:

* `src/components/molecules/ProductCard.jsx`
* `src/pages/ProductDetailPage.jsx`

### Caso A: usuario autenticado + stock disponible

* El botón **Agregar al carrito** debe estar habilitado
* Debe ejecutar la acción normal de agregado
* Debe mantener el comportamiento actual del carrito

### Caso B: usuario NO autenticado + stock disponible

* El botón/CTA debe seguir visible
* Al intentar usarlo, **debe redirigir a `/login`**
* **NO** debe agregar nada al carrito
* **NO** debe cambiar badge/cart count

### Caso C: producto sin stock

* El CTA no debe permitir agregado
* Debe mostrarse visualmente como bloqueado/deshabilitado
* El texto visible debe ser explícito, preferentemente:

  * `Agotado`
* **NO** debe intentar agregar al carrito
* **NO** debe redirigir a login por encima de la regla de agotado

## Prioridad de reglas

Aplicar esta precedencia exacta:

1. Si `stock <= 0` ⇒ mostrar `Agotado` y bloquear acción
2. Si `stock > 0` pero usuario no autenticado ⇒ redirigir a `/login`
3. Si `stock > 0` y usuario autenticado ⇒ permitir agregar

---

## Regla técnica de stock (OBLIGATORIA)

La validación de stock debe ser **defensiva**.

Considera que `stock` podría venir como:

* número
* string numérico (`"0"`, `"3"`)
* `undefined`
* `null`

Implementar lógica robusta equivalente a:

* convertir con coerción segura
* tratar `undefined`, `null`, `NaN` como no confiable
* **NO asumir** que cualquier valor truthy significa stock disponible

Criterio obligatorio:

* solo hay stock disponible si el valor es numéricamente válido y `> 0`

Ejemplo de intención:

* `"0"` ⇒ sin stock
* `0` ⇒ sin stock
* `undefined` ⇒ sin stock
* `null` ⇒ sin stock
* `"5"` ⇒ con stock
* `5` ⇒ con stock

---

## Regla de ID de producto

Revisar y endurecer cualquier punto donde exista ambigüedad entre:

* `product.id`
* `product._id`

Debe mantenerse compatibilidad con la forma real en que hoy consume/agrega productos el frontend.

**No romper agregado al carrito por usar la propiedad incorrecta.**

Si detectas inconsistencia:

* corregirla en el mínimo alcance posible
* documentarla en el archivo final

---

## Alcance exacto permitido

### Archivos frontend a ajustar

* `src/components/molecules/ProductCard.jsx`
* `src/pages/ProductDetailPage.jsx`

### Tests unit/component

Agregar o ajustar lo mínimo necesario en archivos como:

* `src/components/molecules/__tests__/ProductCard.test.jsx`
* `src/pages/__tests__/ProductDetailPage.test.jsx`

### E2E

Crear o ajustar un spec focal, preferentemente:

* `cypress/e2e/productAccess.cy.js`

---

## No tocar

* backend
* endpoints API
* payloads
* checkout flow
* orderApi
* cartApi
* reducers globales no relacionados
* React Query
* lazy loading
* admin
* GuestOnly
* migraciones estructurales
* rediseño visual grande

---

## Implementación esperada

### 1) ProductCard

Debes endurecer el CTA para que:

* use la regla UX definitiva
* use coerción robusta de stock
* no permita agregar si no se cumple la regla
* si no autenticado y con stock, redirija a `/login`
* si agotado, muestre `Agotado` y quede bloqueado

### 2) ProductDetailPage

Debes replicar exactamente la misma política visible y funcional de `ProductCard`.

Debe evitarse este bug:

* usuario no puede agregar desde catálogo
* pero sí puede agregar entrando al detalle

Eso debe quedar eliminado.

---

## Tests unit/component obligatorios

Agregar cobertura mínima real para estos casos:

### ProductCard

1. autenticado + stock disponible

   * CTA habilitado
   * permite acción de agregado

2. no autenticado + stock disponible

   * CTA visible
   * al interactuar redirige a `/login`
   * no agrega al carrito

3. stock 0

   * muestra `Agotado`
   * CTA bloqueado
   * no agrega

4. stock como string `"0"` o `"3"`

   * comportamiento correcto según coerción

5. stock `undefined` o inválido

   * tratado como no disponible

### ProductDetailPage

1. replica las mismas reglas
2. no ejecuta agregado cuando no corresponde
3. redirige a `/login` cuando aplica
4. muestra estado agotado cuando aplica

---

## E2E focal obligatorio

Crear un E2E real y robusto, sin depender frágilmente del dataset.

Archivo sugerido:

* `cypress/e2e/productAccess.cy.js`

### Escenario 1: usuario autenticado puede agregar

* login real por UI
* visitar home
* seleccionar dinámicamente un producto realmente agregable
* criterio robusto:

  * elegir una card cuyo CTA esté habilitado
  * no hardcodear producto específico si no es necesario
* agregar al carrito
* validar cambio visible en badge/cart count o carrito

### Escenario 2: usuario no autenticado no puede agregar directamente

* iniciar sesión limpia / visitar home sin auth
* identificar un producto con CTA disponible para usuario no autenticado
* al intentar agregar:

  * debe redirigir a `/login`
  * el carrito no debe cambiar

### Escenario 3: producto agotado

Solo incluirlo si el dataset real lo expone de forma estable.

Si existe producto agotado estable:

* verificar que muestre `Agotado`
* verificar que no permita acción

Si NO existe un producto agotado estable en dataset real:

* no inventar fixture
* no mockear respuesta
* documentar explícitamente esa limitación en el archivo final

---

## Regla de robustez E2E

No hagas tests frágiles por depender de un producto específico salvo que sea estrictamente necesario.

Preferir estrategia robusta:

* encontrar un CTA habilitado real
* interactuar con el primer producto válido disponible
* validar comportamiento observable real

Si el selector actual no permite esto con estabilidad, puedes agregar el **mínimo soporte de testabilidad** frontend, por ejemplo:

* `data-testid`
* `data-cy`

pero solo si es estrictamente necesario y sin contaminar alcance.

---

## Validaciones obligatorias por etapas

### Etapa 1: cambio en ProductCard

Después de implementar:

* `npm test`
* `npm run build`

### Etapa 2: cambio en ProductDetailPage

Después de implementar:

* `npm test`
* `npm run build`

### Etapa 3: tests unit/component

Después de implementar:

* `npm test`
* `npm run build`

### Etapa 4: E2E focal

Después de implementar:

* `npx cypress run --spec "cypress/e2e/productAccess.cy.js"`
  o el spec equivalente si elegiste otro nombre
* `npm test`
* `npm run build`

### Etapa 5: regresión relevante

Ejecutar además:

* `npx cypress run --spec "cypress/e2e/auth.cy.js"`
* `npx cypress run --spec "cypress/e2e/cart.cy.js"`

Si alguno de esos specs no existe en el repo real:

* no inventarlo
* usar el equivalente existente
* documentarlo explícitamente

---

## Modo de trabajo obligatorio

En cada etapa reporta dentro del archivo final:

1. archivos modificados
2. qué cambio exacto se hizo
3. impacto en contratos `auth/cart/checkout`
4. resultado real de:

   * tests
   * build
   * E2E
5. si apareció error:

   * detenerte
   * explicar causa raíz real
   * corregir
   * volver a validar

No declares éxito si no hay evidencia real.

---

## Estructura obligatoria del archivo final

Genera un único archivo:

* `docs/Resultado_MP-03-YYYY-MM-DD-HHMM.md`

Debe contener exactamente estas secciones:

1. **Resumen ejecutivo**
2. **Objetivo y alcance**
3. **Reglas UX definidas**
4. **Archivos modificados**
5. **Implementación realizada**
6. **Defensive parsing de stock**
7. **Compatibilidad de ID (`id` vs `_id`)**
8. **Validación unitaria/component**
9. **Validación E2E**
10. **Validación de build**
11. **Impacto en contratos**
12. **Riesgos y mitigaciones**
13. **Limitaciones encontradas**
14. **Evidencia REAL de terminal**
15. **Decisión final**

---

## Criterio de éxito final

MP-03 se considera exitoso solo si:

* catálogo y detalle aplican la misma regla
* no autenticado no agrega y va a `/login`
* agotado no permite acción
* autenticado con stock sí agrega
* no se rompieron contratos
* tests/build pasan con evidencia real
* E2E focal corre con evidencia real
* regresión relevante sigue estable

---

## Instrucción final

Ejecuta exactamente este plan.

No improvises UX.
No amplíes alcance.
No cambies backend.
No saltes validaciones.
No generes más de un archivo documental.

Detente completamente al terminar.
