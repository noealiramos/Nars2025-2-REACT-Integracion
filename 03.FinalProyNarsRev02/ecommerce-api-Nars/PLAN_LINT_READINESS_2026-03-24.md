# Plan de Limpieza de Lint y Commit Readiness

Fecha: 2026-03-24
Alcance: `ecommerce-api-Nars`
Estado: Documentado, pendiente de ejecucion

## 1. Objetivo

Dejar el backend en estado apto para commit, con foco en:

- reduccion de warnings de lint,
- limpieza tecnica de codigo,
- deteccion y correccion de malas practicas,
- mejora de logs y trazabilidad,
- eliminacion de errores silenciosos,
- actualizacion de documentacion tecnica minima.

## 2. Estado Base Relevado

- Backend inspeccionado en `ecommerce-api-Nars`.
- `npm run lint` reporta `25 warnings` y `0 errors`.
- `npm test -- --run` reporta `26 files` y `153 tests` en verde.
- `ecommerce-app-Nars` no expone script de lint en `package.json`.
- El backend hoy no esta en estado de `commit ready`.

## 3. Hallazgos Prioritarios

### 3.1 Warnings de lint en codigo productivo

Archivos con warnings relevantes en codigo fuente:

- `server.js`
- `src/controllers/authController.js`
- `src/middlewares/errorHandler.js`
- `src/middlewares/globalErrorHandler.js`
- `src/middlewares/securityLogger.js`
- `src/routes/cartRoutes.js`
- `src/routes/index.js`
- `src/routes/paymentMethodRoutes.js`

Archivos con warnings en pruebas o auxiliares:

- `test_sanitize.js`
- `tests/integration/cartRoutes.test.js`
- `tests/integration/cart_orders.test.js`
- `tests/integration/catalog.test.js`
- `tests/security.test.js`
- `tests/unit/controllers/notificationController.test.js`
- `tests/unit/controllers/orderController.test.js`
- `tests/unit/controllers/paymentMethodController.test.js`
- `tests/unit/controllers/userController.test.js`
- `tests/unit/middlewares/isAdminMiddleware.test.js`
- `tests/unit/middlewares/ownerOrAdmin.test.js`

### 3.2 Trazabilidad inconsistente de request id

- `src/middlewares/requestId.js` usa `req.requestId`.
- `server.js` y `src/routes/index.js` leen `req.id`.
- Resultado: trazabilidad inconsistente o `undefined` en respuestas/logs.

### 3.3 Logging inconsistente

Se mezcla logger central con `console.*` en:

- `server.js`
- `src/config/database.js`
- `src/controllers/paymentMethodController.js`
- `src/middlewares/globalErrorHandler.js`

Riesgo: logs fuera del pipeline estandar, sin correlacion uniforme por request.

### 3.4 Manejo de errores silenciosos o mal clasificados

- `src/controllers/authController.js`: el flujo de refresh token transforma errores internos en `401 Invalid refresh token`.
- `src/routes/index.js`: el health check degrada fallos de Mongo a mensaje generico sin logging util.
- `src/middlewares/errorHandler.js`: puede registrar `status` incorrecto si usa el `res.statusCode` previo.

### 3.5 Validacion distribuida de forma inconsistente

- `src/routes/categoryRoutes.js` carece de validaciones equivalentes al patron documentado.
- `src/routes/paymentMethodRoutes.js` delega parte importante de validacion al controller.
- Esto contradice el patron indicado en `AGENTS.md`.

### 3.6 Documentacion desalineada

- `ReadmeEcommerceJewelry.md` no es un README canonico.
- Existen referencias desactualizadas a rutas/archivos no presentes.
- Swagger existe en forma parcial, principalmente en auth y una ruta de cart.

## 4. Malas Practicas / Code Smells Detectados

- mezcla de responsabilidades entre rutas, controllers y validacion,
- uso de `console.*` en lugar de logger central,
- controladores extensos con mucha logica embebida,
- errores tecnicos transformados en errores funcionales de cliente,
- documentacion funcional y tecnica fragmentada,
- archivo auxiliar `test_sanitize.js` fuera de una estrategia clara de pruebas o utilidades.

## 5. Archivos que Requieren Documentacion Adicional

- `ReadmeEcommerceJewelry.md`
- `src/routes/orderRoutes.js`
- `src/controllers/orderController.js`
- `src/routes/paymentMethodRoutes.js`
- `src/controllers/paymentMethodController.js`
- `src/middlewares/logger.js`
- `src/middlewares/errorHandler.js`
- `src/middlewares/globalErrorHandler.js`
- `src/routes/categoryRoutes.js`

## 6. Evaluacion de Commit Readiness

### 6.1 Codigo limpio

Estado actual: parcial.

Motivos:

- warnings activos,
- validacion no homogena,
- deuda de observabilidad,
- documentacion tecnica incompleta.

### 6.2 Sin warnings criticos

Estado actual: no cumple.

Motivo:

- existen `25 warnings` de lint activos.

### 6.3 Logs correctos

Estado actual: no cumple del todo.

Motivos:

- uso mixto de `console.*` y Winston,
- `requestId` inconsistente,
- status incorrecto en algunos logs de error.

### 6.4 Sin errores silenciosos

Estado actual: no cumple del todo.

Motivos:

- refresh token enmascara causas reales,
- health check oculta causa tecnica,
- politica de manejo global de errores no esta del todo unificada.

### 6.5 Tests

Estado actual: cumple.

Motivo:

- suite backend en verde al momento del relevamiento.

### 6.6 Veredicto

No recomendable commitear hasta completar la limpieza minima definida en este plan.

## 7. Propuesta de Limpieza de Lint

### 7.1 Prioridad alta: codigo fuente

Corregir primero warnings en:

- `server.js`
- `src/controllers/authController.js`
- `src/middlewares/errorHandler.js`
- `src/middlewares/globalErrorHandler.js`
- `src/middlewares/securityLogger.js`
- `src/routes/cartRoutes.js`
- `src/routes/index.js`
- `src/routes/paymentMethodRoutes.js`

### 7.2 Prioridad media: pruebas y archivos auxiliares

- eliminar imports/variables no usados en tests,
- decidir si `test_sanitize.js` se mueve, se documenta o se excluye del lint.

## 8. Orden de Ejecucion Final

Lista numerada exacta de ejecucion:

1. Confirmar alcance operativo: backend `ecommerce-api-Nars` como objetivo principal.
2. Tomar linea base ejecutando `npm run lint` y `npm test -- --run`.
3. Resolver warnings de lint en codigo fuente antes de tocar tests o scripts auxiliares.
4. Unificar el uso de `req.requestId` en `src/middlewares/requestId.js`, `server.js`, `src/routes/index.js` y puntos de logging relacionados.
5. Reemplazar `console.*` por el logger central en `server.js`, `src/config/database.js`, `src/controllers/paymentMethodController.js` y donde aplique.
6. Corregir `src/middlewares/errorHandler.js` para registrar el status final real del error.
7. Revisar `src/middlewares/globalErrorHandler.js` y definir una politica consistente para `uncaughtException` y `unhandledRejection`.
8. Corregir el flujo `refresh` en `src/controllers/authController.js` para que solo responda `401` en errores esperados y derive errores internos al handler global.
9. Mejorar el health check en `src/routes/index.js` para registrar la causa real del fallo sin exponer detalles sensibles al cliente.
10. Limpiar warnings restantes en rutas y middlewares (`server.js`, `src/routes/cartRoutes.js`, `src/routes/paymentMethodRoutes.js`, `src/routes/index.js`, `src/middlewares/securityLogger.js`, `src/middlewares/globalErrorHandler.js`).
11. Limpiar warnings en tests y definir el tratamiento de `test_sanitize.js`.
12. Normalizar validaciones con `express-validator` en `src/routes/categoryRoutes.js` y `src/routes/paymentMethodRoutes.js`, manteniendo en controllers solo logica de negocio.
13. Actualizar documentacion tecnica y funcional en `ReadmeEcommerceJewelry.md` y ampliar Swagger donde hoy falta.
14. Reejecutar `npm run lint` hasta lograr `0 warnings` y `0 errors`.
15. Reejecutar `npm test -- --run` para validar que no hubo regresiones.
16. Ejecutar revision final de commit readiness: arbol limpio, lint limpio, tests verdes, logs consistentes, sin errores silenciosos y documentacion sincronizada.

## 9. Checklist Final de Validacion

- [ ] `npm run lint` sin warnings ni errors.
- [ ] `npm test -- --run` en verde.
- [ ] Sin imports ni variables no usadas en codigo fuente.
- [ ] `requestId` consistente en respuestas y logs.
- [ ] Sin `console.*` fuera de excepciones justificadas.
- [ ] Error handler registrando status correcto.
- [ ] Health check con logging util y respuesta segura.
- [ ] Refresh token sin enmascarar errores internos.
- [ ] Validaciones alineadas al patron del proyecto.
- [ ] Documentacion tecnica actualizada.
- [ ] Estado final apto para commit.

## 10. Nota para Retomar Manana

Al reanudar, continuar directamente desde el paso 1 de la seccion `8. Orden de Ejecucion Final`.
Si el comando del usuario es `aprobado`, iniciar ejecucion del plan sin pedir reconfirmacion adicional.

PLAN LISTO PARA EJECUCION - EN ESPERA DE APROBACION
