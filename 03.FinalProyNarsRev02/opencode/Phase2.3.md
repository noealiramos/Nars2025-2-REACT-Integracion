Trabaja en modo disciplinado, no pidas confirmación innecesaria, ejecuta directamente y documenta progreso.

Actúa como un senior full-stack engineer con enfoque SSDLC, spec-first, hardening incremental y máxima disciplina de cambios mínimos.

Proyecto:
- Backend: `ecommerce-api-Nars`
- Frontend: `ecommerce-app-Nars`

Contexto:
Ya existe una spec formal para esta fase en:
- `docs/specs/2026-03-30-feature-checkout-reuse-hardening.md`

También existe el progreso/auditoría de la fase, cuyo resumen operativo es:
- ya existen endpoints reutilizables para shipping y payment
- checkout ya tiene una primera implementación de reuse
- hay un bug confirmado en `ecommerce-app-Nars/src/services/shippingService.js`
- no deben agregarse nuevos endpoints
- debe mantenerse el flujo real ya validado
- debe endurecerse el checkout sin romper confirmación, historial ni creación de orden
- el patrón `existing` / `new` debe mantenerse

Objetivo de esta ejecución:
Implementar Phase 2.2 de forma conservadora, segura y compatible, corrigiendo reuse de shipping/payment en checkout y fortaleciendo UX/estado sin romper contratos actuales.

Restricciones obligatorias:
1. NO inventes endpoints nuevos.
2. NO cambies contratos backend/frontend salvo que sea estrictamente necesario y compatible.
3. NO rompas:
   - `POST /api/orders`
   - `ConfirmationPage`
   - `OrdersPage`
   - flujo actual de carrito → checkout → confirmación
4. Mantén `localStorage` solo como optimización UX, no como fuente autoritativa.
5. Haz cambios mínimos, razonados y auditables.
6. Antes de editar, revisa la spec y el código real.
7. Documenta progreso dentro de los archivos de progreso si existen o deben actualizarse.
8. Si detectas inconsistencia no documentada, repórtala y corrígela de forma conservadora.
9. No hagas refactors cosméticos fuera de alcance.
10. Todo cambio debe quedar alineado con pruebas.

Alcance funcional a implementar:
1. Corregir `ecommerce-app-Nars/src/services/shippingService.js`
   - hoy recibe `_userId` pero usa `userId` no definido
   - corregir ese bug y validar consumo real del endpoint canonico de shipping
2. Endurecer `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
   - mantener patrón `existing` / `new`
   - mostrar estados visibles de `loading`, `empty` y `error`
   - permitir fallback claro a captura nueva cuando falle carga remota
   - evitar estados inconsistentes al alternar entre `existing` y `new`
   - conservar selección por IDs reales para la orden final
3. Ajustar `ecommerce-app-Nars/src/pages/CheckoutPage.css` si hace falta, solo para soportar la UX nueva sin sobre-rediseñar
4. Mantener comportamiento:
   - existing/existing => usa IDs existentes
   - new/existing => crea shipping y reutiliza payment
   - existing/new => reutiliza shipping y crea payment
   - new/new => crea ambos antes de la orden
5. Preservar sanitización y uso seguro de payment methods existentes

Archivos objetivo prioritarios:
- `ecommerce-app-Nars/src/services/shippingService.js`
- `ecommerce-app-Nars/src/pages/CheckoutPage.jsx`
- `ecommerce-app-Nars/src/pages/CheckoutPage.css`

Archivos a revisar por impacto:
- `ecommerce-app-Nars/src/api/shippingApi.js`
- `ecommerce-app-Nars/src/api/paymentApi.js`
- `ecommerce-app-Nars/src/api/orderApi.js`
- cualquier helper/context que CheckoutPage use realmente

Orden de trabajo requerido:
FASE 1:
- leer spec
- auditar implementación actual real de checkout y servicios involucrados
- detectar si la implementación ya tiene partes parciales del reuse
- confirmar contrato real de shipping y payment en frontend

FASE 2:
- corregir bug de shippingService primero
- validar que el fetch remoto de shipping quede bien cableado

FASE 3:
- endurecer CheckoutPage
- agregar estados visibles:
  - loading
  - empty
  - error
- asegurar reset/control consistente al alternar entre `existing` y `new`

FASE 4:
- revisar si CSS mínimo es necesario y aplicarlo solo si aporta claridad UX

FASE 5:
- dejar notas claras de implementación para pruebas posteriores

Criterios de aceptación obligatorios:
- usuario autenticado con datos guardados ve opciones reutilizables de shipping/payment
- si falla carga remota, la UI lo comunica y permite continuar capturando datos nuevos
- si no hay datos previos, el flujo nuevo funciona sin romperse
- la orden final sigue usando IDs correctos
- no se rompe navegación a confirmación
- no se rompe historial/local order flow existente
- no se introducen regressions evitables

Salida esperada:
1. Primero presenta un mini plan concreto de ejecución basado en el código real encontrado.
2. Luego implementa los cambios.
3. Al final entrega un reporte breve con:
   - archivos modificados
   - qué cambió en cada uno
   - riesgos observados
   - pendientes para Prompt B
4. Si ejecutas comandos, incluye resultados relevantes.
5. Si algo no se puede completar, explica exactamente por qué, sin inventar.

Importante:
trabaja directamente sobre el código real del repositorio, conservando arquitectura actual y priorizando compatibilidad.

Cada bloque de trabajo debe dejar evidencia clara, incremental y fechada.
No omitir este paso.

documenta o exporta todo el resultado a  D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\docs\PHASE2.2_PROGRESS_2.md
