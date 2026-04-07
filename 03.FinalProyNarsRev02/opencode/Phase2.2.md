Quiero que ejecutes este trabajo en modo disciplinado y spec-first.
Primero realiza únicamente:
1. auditoría del estado actual,
2. propuesta de diseño,
3. listado de archivos a modificar,
4. riesgos,
5. creación de la spec.

No implementes todavía hasta terminar esa fase y presentar el resultado completo.


PROMPT MAESTRO PRO — Phase 2.2 Checkout UX Hardening

OBJETIVO:
Continuar con Phase 2 del proyecto e-commerce, avanzando la siguiente iteración de hardening enfocada en UX real de checkout con reutilización de datos previos del usuario, sin romper la arquitectura actual ni el flujo real ya validado.

CONTEXTO:
Proyecto full stack e-commerce.
- Backend: Node.js + Express + MongoDB/Mongoose
- Frontend: React + Vite
- Auth con access token + refresh token
- Ya quedó completado Phase 2.1 Auth Hardening con pruebas reales del lifecycle de sesión
- Actualmente el checkout crea shipping address y payment method antes de crear la orden
- El frontend usa CartContext y flujo real de checkout/confirmation/orders
- Se requiere endurecer la UX para compras consecutivas, reduciendo fricción y manteniendo consistencia de datos

OBJETIVO FUNCIONAL DE ESTA FASE:
Implementar reutilización de datos previos en checkout:
1. Reusar dirección de envío existente del usuario cuando aplique
2. Reusar método de pago existente del usuario cuando aplique
3. Permitir fallback claro para capturar nuevos datos
4. Mantener compatibilidad con el flujo actual de creación de orden
5. No introducir mocks ni hacks
6. Dejar pruebas y documentación listas

ALCANCE:
Trabaja sobre backend + frontend + tests + documentación.
No cambies la lógica de negocio fuera del checkout salvo que sea estrictamente necesario y quede documentado.
No rompas el flujo actual que ya pasa.
No elimines compatibilidad hacia el comportamiento actual; la nueva lógica debe ser incremental.

REQUISITOS FUNCIONALES:
A. SHIPPING REUSE
- Al entrar al checkout con usuario autenticado, si existen direcciones previas, mostrar opción para reutilizar una existente
- Permitir seleccionar una dirección existente
- Permitir capturar una nueva dirección si el usuario no quiere reutilizar
- Si se selecciona una existente, evitar crear duplicados innecesarios
- Si se captura una nueva, debe persistirse de forma consistente

B. PAYMENT METHOD REUSE
- Al entrar al checkout con usuario autenticado, si existen métodos de pago previos, mostrar opción para reutilizar uno existente
- Permitir seleccionar método existente
- Permitir capturar uno nuevo
- Mantener comportamiento seguro; no exponer datos sensibles incorrectamente
- Evitar duplicados innecesarios cuando se reutilice uno existente

C. UX / FRONTEND
- La UI debe dejar claro cuándo se está reutilizando algo existente y cuándo se está capturando algo nuevo
- Mantener experiencia sencilla, limpia y consistente con el flujo actual
- Si no existen datos previos, el flujo debe funcionar exactamente como hoy
- Debe tolerar estados vacíos, respuestas lentas y errores del backend

D. ORDEN FINAL
- La orden debe seguir creándose correctamente usando:
  - shipping existente o nuevo
  - payment method existente o nuevo
- ConfirmationPage y Orders no deben romperse

REQUISITOS TECNICOS:
1. Diseña primero una SPEC completa en /docs/specs/
   Usa formato tipo:
   /docs/specs/YYYY-MM-DD-feature-checkout-reuse-hardening.md

La spec debe incluir:
- Metadata
- Historia SMART
- Contexto actual
- Problema actual
- Objetivo
- Alcance
- No alcance
- Requisitos funcionales
- Requisitos no funcionales
- Consideraciones de seguridad
- Riesgos
- Decisiones técnicas
- Estrategia de pruebas
- Criterios de aceptación
- Plan de rollback
- Checklist de cierre

2. Antes de modificar código:
- inspecciona arquitectura actual
- identifica contratos reales backend/frontend involucrados
- enumera archivos a tocar
- detecta si ya existen endpoints o modelos reutilizables para shippingAddress y paymentMethod
- valida si conviene agregar endpoints de “listar mis direcciones / mis métodos” o reutilizar existentes
- evita duplicación de lógica

3. Implementación backend:
- realiza solo cambios mínimos pero sólidos
- si faltan endpoints para listar/reusar recursos del usuario, agrégalos correctamente
- protege ownership para que un usuario solo vea/use sus propios recursos
- valida input
- mantén consistencia con middlewares y manejo de errores existentes
- no expongas campos sensibles de forma insegura
- documenta decisiones

4. Implementación frontend:
- adapta CheckoutPage y componentes relacionados
- carga datos previos del usuario autenticado
- muestra opciones de selección/reuso
- conserva fallback a captura nueva
- maneja loading, error y empty states
- conserva compatibilidad con flujo existente y estado router hacia confirmation

5. Testing obligatorio:
Backend:
- tests unitarios/integración para nuevas rutas/controladores/servicios
- validar ownership
- validar reuse correcto
- validar fallback a nuevo registro
- validar errores y casos borde

Frontend:
- tests para UI y lógica del checkout
- validar reuse de shipping
- validar reuse de payment
- validar fallback a nuevos datos
- validar que la orden final se construye correctamente

E2E / Cypress:
- agregar casos reales para:
  1. checkout usando shipping y payment existentes
  2. checkout usando shipping nuevo y payment existente
  3. checkout usando shipping existente y payment nuevo
  4. checkout con ambos nuevos cuando no existan previos o el usuario así lo elija

6. Documentación obligatoria:
Actualizar según aplique:
- README
- D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\docs\Phase2.2_PROGRESS.md.md
- SECURITY.md si cambia exposición de datos
- backlog/progress según corresponda

7. CI / scripts:
- si esta fase requiere nuevas suites o separación de tests, proponer scripts claros
- no romper scripts existentes
- deja sugerencias concretas si no quieres modificar package.json automáticamente

METODO DE TRABAJO OBLIGATORIO:
FASE A - ANALISIS
1. Audita la implementación actual
2. Resume flujo actual real de checkout
3. Detecta huecos
4. Propón diseño objetivo
5. Presenta plan de archivos a modificar
6. Presenta riesgos y mitigaciones

FASE B - SPEC
7. Crea la spec completa antes de tocar código

FASE C - IMPLEMENTACION
8. Backend
9. Frontend
10. Tests backend
11. Tests frontend
12. Tests E2E

FASE D - VALIDACION
13. Ejecuta o deja listos los comandos de validación
14. Resume resultados esperados
15. Enumera cualquier pendiente real

FASE E - DOCUMENTACION FINAL
16. Actualiza documentación impactada
17. Cierra con resumen ejecutivo:
- qué se hizo
- qué archivos cambiaron
- qué pruebas cubren la funcionalidad
- qué riesgos quedan
- recomendación de siguiente paso

RESTRICCIONES IMPORTANTES:
- No usar mocks donde no sean necesarios para E2E
- No romper happy path actual
- No introducir complejidad innecesaria
- Mantener estilo del proyecto
- Mantener seguridad por ownership
- No asumir contratos falsos; primero inspeccionar
- Si detectas deuda técnica relacionada, documentarla aparte, no mezclarla sin control

CRITERIOS DE ACEPTACION:
- Usuario autenticado puede reutilizar shipping existente
- Usuario autenticado puede reutilizar payment existente
- Usuario puede optar por capturar nuevos datos
- Orden final se crea correctamente en todas las combinaciones principales
- No hay fuga de datos de otros usuarios
- Tests relevantes quedan implementados
- Documentación queda actualizada
- Solución queda lista para pasar a una siguiente iteración de Phase 2

FORMATO DE ENTREGA:
Quiero que trabajes en este orden:
1. Auditoría breve del estado actual
2. Propuesta de diseño
3. Spec creada
4. Implementación
5. Tests
6. Documentación
7. Resumen final + siguiente paso recomendado

IMPORTANTE:
Si detectas decisiones ambiguas, elige la opción más conservadora, compatible y segura, y documenta esa decisión en la spec y en el resumen final.