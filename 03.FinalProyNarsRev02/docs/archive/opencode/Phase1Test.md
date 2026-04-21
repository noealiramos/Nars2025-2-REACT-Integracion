*start:
Actúa como un Senior QA Engineer + Frontend Test Engineer + React Testing Specialist.

Tu tarea es diseñar, implementar y ejecutar pruebas automatizadas para validar la Phase 1 del refactor del carrito, donde el backend pasa a ser la fuente de verdad para usuarios autenticados.

IMPORTANTE:
- NO quiero solo análisis.
- QUIERO que crees y/o ajustes pruebas reales.
- Debes priorizar estabilidad, cobertura útil y detección de regresiones.
- No inventes comportamiento no sustentado por el código actual.
- Si alguna parte no es fácilmente testeable por acoplamiento actual, debes documentarlo y proponer el ajuste mínimo necesario.
- No rompas pruebas existentes.
- Si necesitas refactor pequeño para hacer testeable el código, hazlo de forma mínima y documentada.

## CONTEXTO DE PHASE 1
Cambios realizados:
- Se creó `cartApi` para consumir `/api/cart/user`, `/api/cart/add-product`, `/api/cart/:id`.
- Se refactorizó `CartContext` para usar backend como fuente de verdad en usuarios autenticados y mantener fallback temporal para usuarios anónimos.
- Se sincroniza el carrito local al backend al iniciar sesión si existe carrito local.
- Se agregó manejo de estados `loading` y `error` en UI de carrito.
- Se evitó limpiar el carrito al cerrar sesión para permitir persistencia entre sesiones.
- Se amplió el populate del backend de carrito para incluir `imagesUrl`.

Archivos relevantes:
- `ecommerce-app-Nars/src/api/cartApi.js`
- `ecommerce-app-Nars/src/contexts/CartContext.jsx`
- `ecommerce-app-Nars/src/pages/CartPage.jsx`
- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/components/organisms/SiteHeader.jsx`
- `ecommerce-api-Nars/src/controllers/cartController.js`

## OBJETIVO
Crear una batería de pruebas automatizadas que valide Phase 1 sin depender de validación manual.

## ALCANCE DE PRUEBAS REQUERIDO

### 1. Pruebas unitarias frontend
Debes cubrir al menos:

#### `cartApi`
- obtiene carrito correctamente desde backend
- agrega producto correctamente
- elimina o actualiza item correctamente
- maneja errores de API correctamente

#### `CartContext`
- usa backend como fuente de verdad cuando el usuario está autenticado
- usa fallback local cuando el usuario no está autenticado
- sincroniza carrito local al backend al iniciar sesión
- no duplica productos al sincronizar
- actualiza contador/totales correctamente
- conserva comportamiento estable en loading/error
- no limpia indebidamente el carrito persistente al logout

#### `CartPage`
- renderiza estado loading
- renderiza estado error
- renderiza carrito vacío
- renderiza items correctamente desde datos backend

#### `SiteHeader`
- refleja correctamente el contador del carrito después de cargar/sincronizar

#### `CheckoutPage`
- consume el carrito correcto y no depende de datos stale o exclusivamente locales

---

### 2. Pruebas de integración frontend
Debes crear pruebas que validen:

- `CartContext + cartApi`
- flujo autenticado con carrito backend
- flujo anónimo con fallback local
- transición anónimo -> login -> sincronización backend
- persistencia de carrito al recargar estado autenticado (mockeando API según sea necesario)

---

### 3. Pruebas backend mínimas
Para `cartController.js`, valida si ya existen pruebas.
Si no existen o son insuficientes, agrega pruebas para:

- obtener carrito del usuario
- agregar producto al carrito
- eliminar/actualizar item
- respuesta incluye `imagesUrl`
- manejo de errores cuando producto o carrito no existen

---

## ESTRATEGIA DE IMPLEMENTACIÓN
Debes seguir este orden:

### FASE A — Auditoría de testing actual
1. Detecta framework actual:
- Vitest / Jest
- React Testing Library
- mocks existentes
- estructura de tests actual

2. Identifica:
- qué pruebas ya existen
- cuáles hay que extender
- cuáles hay que crear desde cero

Entrega:
- inventario breve de pruebas existentes
- estrategia de cobertura para Phase 1

### FASE B — Implementación de pruebas
Crea o modifica los archivos de test necesarios.

Prioriza:
- tests robustos
- mocks claros
- baja fragilidad
- cobertura sobre lógica crítica

### FASE C — Ejecución
Ejecuta pruebas relevantes:
- unitarias frontend
- integración frontend
- backend si aplica

Usa los comandos reales del proyecto.

### FASE D — Reporte final
Entrega SIEMPRE:

# Reporte de pruebas Phase 1
## 1. Resumen ejecutivo
## 2. Tests creados
## 3. Tests actualizados
## 4. Archivos modificados
## 5. Resultado de ejecución
## 6. Cobertura lograda o estimada
## 7. Riesgos no cubiertos
## 8. Recomendaciones antes de pasar a Phase 2

---

## REGLAS CRÍTICAS
- No inventes rutas ni contratos.
- No reemplaces pruebas existentes sin justificación.
- No uses mocks irreales si ya existe una capa común de testing en el proyecto.
- Mantén nombres de tests claros y orientados a comportamiento.
- Si detectas deuda de testeabilidad, documenta el cambio mínimo necesario.
- Si alguna prueba falla por bug real, no la fuerces a pasar: reporta el bug claramente.

## CRITERIO DE ÉXITO
El resultado debe dejar validado, con pruebas automatizadas, que:
1. usuarios autenticados usan backend como fuente de verdad del carrito
2. usuarios anónimos siguen operando con fallback local sin romper UX
3. la sincronización local -> backend ocurre correctamente al login
4. no hay duplicación involuntaria de items
5. `CartPage`, `CheckoutPage` y `SiteHeader` reflejan el estado correcto del carrito
6. backend responde correctamente con el contrato esperado

Trabaja como un ingeniero senior que quiere evitar regresiones antes de iniciar Phase 2.

*end

Concéntrate SOLO en pruebas de Phase 1. No avances a Phase 2.

En cuanto termines estos tests, guarda avances en D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\docs\progress-Phase-1-testResult.md