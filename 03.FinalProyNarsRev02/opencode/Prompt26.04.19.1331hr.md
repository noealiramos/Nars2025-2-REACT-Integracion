PROMPT – LIMPIEZA TOTAL DE CYPRESS POST E2E

Actúa como Senior Full-Stack Engineer + QA Lead + Cypress Specialist + Documentador SSDLC.

CONTEXTO

La validación E2E real posterior a FASE 3 quedó en estado:

E2E OK con observaciones
33/33 tests passing en 13 specs
backend y frontend reales funcionando
la suite pasó sin mocks ni stubs

Sin embargo, quedó una observación técnica pendiente:

actualmente ecommerce-app-Nars/cypress.config.mjs usa allowCypressEnv: true como compatibilidad temporal
la suite actual todavía depende de Cypress.env('apiUrl') en algunos puntos
se requiere dejar Cypress limpio al 100%, eliminando esa compatibilidad temporal si es posible
OBJETIVO

Lograr que la suite Cypress siga pasando completamente, pero ahora con configuración más limpia y sin depender de compatibilidad temporal innecesaria.

Objetivo final deseado:

eliminar dependencia de allowCypressEnv: true
dejar allowCypressEnv: false si es viable
mantener 33/33 passing
no reducir cobertura
no introducir mocks
no tocar lógica de negocio
documentar todo
REGLAS CRÍTICAS
NO romper la suite actual
NO bajar el número de pruebas
NO desactivar specs para aparentar éxito
NO usar mocks, stubs ni fixtures que oculten errores reales
NO tocar lógica de negocio salvo que sea absolutamente indispensable
primero diagnosticar, luego planear, luego corregir
si encuentras más de una estrategia, elige la más estable y mantenible
si una corrección pone en riesgo cobertura o estabilidad, DETENTE y documenta antes de seguir
ALCANCE TÉCNICO

Revisar específicamente:

ecommerce-app-Nars/cypress.config.mjs
ecommerce-app-Nars/cypress/support/commands.js
ecommerce-app-Nars/cypress/e2e/auth.cy.js
cualquier otra spec, helper o soporte que dependa de Cypress.env('apiUrl')
scripts o utilidades relacionadas con ejecución E2E

Buscar una alternativa más limpia para resolver apiUrl, por ejemplo mediante config runtime o acceso consistente a config de Cypress, siempre compatible con la versión actual del proyecto.

DOCUMENTACIÓN OBLIGATORIA

Genera un archivo en:

/docs/bitacora/

Con nombre EXACTO:

YYYY-MM-DD_HH-MM_CYPRESS_CLEANUP.md

Ejemplo:
2026-04-19_14-10_CYPRESS_CLEANUP.md

ESTRUCTURA OBLIGATORIA DEL DOCUMENTO
1. Encabezado
Fecha y hora exacta
Objetivo
Contexto de partida
2. Diagnóstico inicial
dónde sigue usándose Cypress.env()
por qué depende de allowCypressEnv
riesgos de dejarlo así
3. Estrategia elegida
opciones consideradas
opción final elegida
justificación técnica
4. Cambios aplicados

Por cada archivo:

ruta completa
antes / después
motivo
riesgo
5. Output de Terminal

Crear sección:

Output de Terminal

Y pegar TODO el output completo de:

búsqueda de referencias
validaciones
corrida Cypress
errores
warnings
reruns
resultado final

SIN RESUMIR
SIN OMITIR
TEXTO COMPLETO

6. Validación funcional
resultado de la corrida final
número de specs
número de tests
evidencia de que no hubo mocks
evidencia de que no se tocó lógica de negocio
7. Riesgos detectados
técnicos
de mantenimiento
de compatibilidad
8. Resultado final

Clasifica exactamente como uno de estos:

Cypress clean OK
Cypress clean OK con observaciones
Cypress clean NO OK
EJECUCIÓN ESPERADA
Diagnosticar todos los puntos donde se usa Cypress.env('apiUrl')
Diseñar estrategia para quitar dependencia temporal
Aplicar cambios mínimos, seguros y mantenibles
Restaurar si es viable:
allowCypressEnv: false
Ejecutar corrida real completa:
npx cypress run
Confirmar que se mantiene el total esperado o documentar cualquier desviación
CRITERIOS DE ÉXITO

Solo se considera éxito si:

la suite completa vuelve a correr realmente
se mantiene cobertura real
no se reducen pruebas
no se introducen mocks
la configuración queda más limpia que antes
allowCypressEnv: true desaparece o queda justificado técnicamente si no puede retirarse aún
PROHIBICIONES
NO comentar pruebas para que pasen
NO saltar specs
NO declarar éxito sin corrida real
NO hacer cambios cosméticos solamente
NO dejar warnings importantes sin documentar
NO modificar negocio solo para arreglar infraestructura de pruebas
NOTA FINAL

Prioriza este orden:

estabilidad real de la suite
limpieza de configuración
mantenibilidad
compatibilidad futura

Si logras dejar allowCypressEnv: false y mantener 33/33, indícalo explícitamente como cierre técnico exitoso.

Si no es viable retirarlo sin una refactorización mayor, documenta exactamente por qué y qué fase posterior sería necesaria.