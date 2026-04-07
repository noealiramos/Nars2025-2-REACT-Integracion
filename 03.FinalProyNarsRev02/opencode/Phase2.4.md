PROMPT: => PHASE 2.2 - CIERRE E2E Y CONSOLIDACION DOCUMENTAL

Contexto:
Estamos trabajando sobre el proyecto e-commerce full stack.
La iteracion previa ya implemento el hardening conservador de checkout reuse en frontend y dejo evidencia en:

- docs/specs/2026-03-30-feature-checkout-reuse-hardening.md
- PHASE2.2_PROGRESS_2.md o su equivalente documental
- CheckoutPage endurecida
- shippingService corregido
- paymentService y shippingService propagando errores
- tests unitarios frontend ampliados
- build frontend validado

Objetivo de este prompt:
Cerrar la validacion real de Phase 2.2 mediante pruebas E2E y dejar documentacion consolidada, SIN romper contratos actuales y SIN introducir cambios innecesarios.

Reglas de ejecucion:
1. Trabaja spec-first y evidence-first.
2. NO cambies contratos backend/frontend salvo que sea estrictamente necesario para corregir una falla real.
3. NO inventes endpoints.
4. NO redisenes checkout.
5. Mantente conservador.
6. Si detectas deuda tecnica, documentala, no la expandas sin necesidad.
7. Si algo ya existe, reusalo.
8. Toda conclusion debe quedar respaldada por evidencia real del repo, tests o ejecucion.
9. Al finalizar, entrega resumen ejecutivo, lista de archivos tocados, resultados y pendientes.
10. Si el arbol ya tiene cambios previos no relacionados, no los reviertas.

Tarea principal:
Realiza el cierre operativo de PHASE 2.2 cubriendo estos puntos:

--------------------------------------------------
A. AUDITORIA PREVIA RAPIDA
--------------------------------------------------
Antes de modificar nada:

1. Revisa el estado actual de:
   - CheckoutPage
   - servicios de shipping/payment
   - spec de la fase
   - tests existentes de Cypress
   - docs de progreso de la fase

2. Confirma si ya existen utilidades, fixtures, comandos o seeds reutilizables para login, carrito, checkout, direcciones y payment methods.

3. Identifica el mejor punto de entrada para ampliar Cypress SIN duplicar logica.

Entrega una mini auditoria breve dentro del reporte final.

--------------------------------------------------
B. AMPLIAR CYPRESS PARA REUSE CHECKOUT
--------------------------------------------------
Amplia Cypress para cubrir formalmente las 4 combinaciones del flujo de checkout:

1. existing / existing
   - reutiliza shipping existente
   - reutiliza payment existente
   - valida que la orden se complete correctamente
   - valida que NO se creen datos nuevos innecesarios si esto puede demostrarse por UI, payload observable o evidencia controlada

2. new / existing
   - crea nuevo shipping
   - reutiliza payment existente
   - valida orden exitosa

3. existing / new
   - reutiliza shipping existente
   - crea nuevo payment
   - valida orden exitosa

4. new / new
   - crea ambos
   - valida orden exitosa

Requisitos:
- Prefiere flujo real de UI.
- Evita mocks si no son indispensables.
- Evita stubs salvo que exista una razon tecnica documentada.
- Si hay helpers existentes aceptables, reutilizalos.
- Usa selectores robustos.
- Reduce fragilidad E2E.
- Deja los tests legibles y mantenibles.

Si para estabilizar los escenarios necesitas preparar datos:
- hazlo del modo mas cercano posible al flujo real,
- y si usas preparación técnica, documenta exactamente por qué.

--------------------------------------------------
C. CASO DE FALLO REMOTO + FALLBACK MANUAL
--------------------------------------------------
Agrega validacion E2E del caso donde falle carga remota de shipping o payment y el usuario:

- vea aviso visible de error
- pueda continuar con captura manual
- logre completar la orden sin quedar bloqueado

Importante:
- Si este caso no puede probarse 100% por UI real sin introducir infraestructura excesiva, haz la mejor aproximacion conservadora posible
- documenta claramente el alcance real de la validacion
- no maquilles limitaciones

--------------------------------------------------
D. VALIDACION Y EJECUCION
--------------------------------------------------
Ejecuta lo necesario para validar lo implementado, idealmente:

- tests Cypress relevantes de esta fase
- tests unitarios afectados si aplica
- build si hubo cambios que lo ameriten

No corras baterias innecesarias si no aportan valor directo, pero si ejecutas un subconjunto, justifica por qué ese subconjunto es suficiente para esta fase.

--------------------------------------------------
E. CIERRE DOCUMENTAL
--------------------------------------------------
Actualiza la documentacion consolidada de la fase.

Objetivo:
Dejar claro:
- que se implemento
- que se valido
- que quedo pendiente
- riesgos remanentes
- decision de estado de la fase

Actualizar, crear o consolidar segun corresponda:
- docs/PHASE2_PROGRESS.md
- o el documento canonico equivalente de progreso de la fase
- y si hace falta, nota corta en README o doc funcional relacionada con checkout reuse

Incluye:
1. resumen ejecutivo
2. cambios implementados
3. evidencia de validacion
4. combinaciones E2E cubiertas
5. riesgos abiertos
6. recomendacion de cierre:
   - DONE
   - DONE WITH KNOWN LIMITATIONS
   - PARTIAL
y sustenta la decision

--------------------------------------------------
F. CRITERIOS DE ACEPTACION
--------------------------------------------------
La tarea se considera bien ejecutada solo si:

- existe evidencia concreta de cobertura E2E para reuse checkout
- las 4 combinaciones estan cubiertas o queda transparentemente documentado por qué alguna no pudo cerrarse
- existe validacion del fallback manual ante fallo remoto, aunque sea con alcance claramente acotado
- no se rompieron contratos actuales
- la documentacion de Phase 2 queda consolidada
- el resultado final deja claro si la fase ya puede cerrarse o no

--------------------------------------------------
G. FORMATO DE ENTREGA FINAL
--------------------------------------------------
Al terminar, entrega exactamente estas secciones:

1. Resumen ejecutivo
2. Auditoria previa breve
3. Archivos modificados
4. Escenarios E2E cubiertos
5. Validaciones ejecutadas y resultados
6. Riesgos o limitaciones
7. Estado recomendado de la fase
8. Siguientes pasos concretos

Importante:
- No des respuestas vagas.
- No digas solo “todo bien”.
- Reporta evidencia real.
- Si algo fallo, dilo claramente.
- Si algo no se ejecuto, dilo claramente.
- Si encontraste trade-offs, explicalos.

Documenta el avance en D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\opencode\PHASE_2.3_PROGRESS.md