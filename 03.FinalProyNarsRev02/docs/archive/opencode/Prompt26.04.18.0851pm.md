Actúa como QA Lead + Test Engineer + Full Stack Engineer senior.

CONTEXTO:
Proyecto ecommerce full stack:
- Backend: ecommerce-api-Nars
- Frontend: ecommerce-app-Nars

Ya existe evidencia previa de:
- smoke test funcional exitoso
- golden path Cypress exitoso
- tests representativos backend/frontend exitosos
- PERO aún NO está confirmado que TODA la suite de pruebas pase con el estado ACTUAL del proyecto

OBJETIVO:
Ejecutar y validar la suite COMPLETA de pruebas del proyecto en su estado actual, para confirmar qué tan estable está realmente antes de entrar a hardening, documentación final y despliegue.

IMPORTANTE:
Esta fase busca responder con evidencia real:
“¿Las pruebas unitarias / integración / E2E de lo nuevo y de lo existente pasan tal como quedó hoy el proyecto?”

---

## REGLAS OBLIGATORIAS

1. NO modificar código en esta fase, salvo que yo lo autorice después.
2. NO asumir que algo pasó si no fue ejecutado realmente.
3. NO inventar comandos ni resultados.
4. TODO lo que salga en terminal debe integrarse SÍ O SÍ en el documento final.
5. Documento con fecha y hora obligatorio.
6. Si un comando falla, diagnosticar la causa exacta.
7. Si `--runInBand` no aplica a Vitest, corregir el enfoque y usar el comando correcto.
8. Separar claramente:
   - pruebas backend
   - pruebas frontend
   - pruebas E2E Cypress
9. Si detectas pruebas obsoletas, rotas o mal configuradas, NO corregir aún; solo documentar.
10. Si hay warnings no bloqueantes, separarlos de los errores reales.

---

## FASE 1 — DIAGNÓSTICO DE CONFIGURACIÓN DE PRUEBAS

Antes de correr nada:

1. Revisar scripts de test en:
   - `ecommerce-api-Nars/package.json`
   - `ecommerce-app-Nars/package.json`

2. Confirmar:
   - qué runner usa backend
   - qué runner usa frontend
   - cómo se debe ejecutar correctamente la suite completa en cada proyecto
   - si existe coverage script
   - si Cypress depende de levantar backend/frontend por separado
   - si hay scripts de support para entorno de test

3. Verificar si el error previo con `--runInBand` fue por:
   - uso incorrecto del flag
   - incompatibilidad con Vitest
   - script mal definido

ENTREGABLE:
- diagnóstico breve de cómo se debe correr correctamente la suite completa
- comandos correctos propuestos
- riesgos previos detectados

NO MODIFICAR NADA TODAVÍA.

---

## FASE 2 — EJECUCIÓN COMPLETA DE PRUEBAS BACKEND

1. Ejecutar la suite COMPLETA del backend con el comando correcto
2. Si existe coverage, correrla también solo si aporta valor claro
3. Capturar:
   - total de archivos
   - total de tests
   - passed
   - failed
   - skipped
   - duration
4. Si falla algo:
   - identificar test exacto
   - archivo exacto
   - error exacto
   - posible causa técnica

NO CORREGIR. SOLO REPORTAR.

---

## FASE 3 — EJECUCIÓN COMPLETA DE PRUEBAS FRONTEND

1. Ejecutar la suite COMPLETA del frontend con el comando correcto
2. Si existe coverage, correrla también solo si aporta valor claro
3. Capturar:
   - total de archivos
   - total de tests
   - passed
   - failed
   - skipped
   - duration
4. Si falla algo:
   - identificar test exacto
   - archivo exacto
   - error exacto
   - posible causa técnica

NO CORREGIR. SOLO REPORTAR.

---

## FASE 4 — EJECUCIÓN E2E / CYPRESS

1. Confirmar qué specs E2E existen actualmente
2. Ejecutar:
   - primero el golden path
   - luego la suite E2E completa relevante
3. Si hay specs viejos, inestables o duplicados, documentarlo
4. Capturar:
   - cantidad de specs
   - passed / failed / skipped
   - duración
   - warnings
5. Si Cypress requiere levantar backend/frontend, hacerlo correctamente con el entorno adecuado
6. Si hay advertencias como limpieza de screenshots, separarlas como warning no bloqueante si aplica

NO CORREGIR NADA.

---

## FASE 5 — VALIDACIÓN DEL ESTADO REAL DEL PROYECTO

Con base en los resultados, responder con evidencia:

### Quiero saber explícitamente:
1. ¿La suite backend completa pasa sí o no?
2. ¿La suite frontend completa pasa sí o no?
3. ¿La suite E2E completa pasa sí o no?
4. ¿Lo nuevo quedó cubierto sí o no?
5. ¿Hay áreas nuevas sin pruebas?
6. ¿El proyecto está:
   - estable
   - estable con observaciones
   - no estable
?

---

## FASE 6 — CLASIFICACIÓN DE HALLAZGOS

Separar en:

### A. OK VALIDADO
Lo que sí quedó comprobado

### B. FALLAS REALES
Tests que sí rompen la suite

### C. WARNINGS NO BLOQUEANTES
Ejemplo:
- limpieza de screenshots
- ruido del entorno
- mensajes que no alteran exit code

### D. GAPS DE COBERTURA
Áreas nuevas o sensibles no cubiertas por tests

---

## ENTREGABLE OBLIGATORIO

Generar documento en:

`docs/qa/YYYY-MM-DD-HHMM-validacion-suite-completa.md`

El documento debe incluir:

1. Objetivo
2. Alcance
3. Entorno probado
4. Scripts encontrados en package.json
5. Comandos ejecutados
6. Output COMPLETO de terminal
7. Resultado backend
8. Resultado frontend
9. Resultado Cypress/E2E
10. Hallazgos
11. Gaps de cobertura
12. Conclusión ejecutiva final:
   - suite completa validada
   - validada con observaciones
   - no validada

---

## FORMATO DE RESPUESTA EN CHAT

Primero comparte:

A) resumen ejecutivo corto  
B) backend: estado  
C) frontend: estado  
D) E2E: estado  
E) total de fallas reales  
F) recomendación de siguiente paso

---

## ACLARACIÓN IMPORTANTE

No quiero una corrida “parcial”.
No quiero “tests representativos”.
No quiero asumir estabilidad con base en pruebas antiguas.

Quiero una validación real y actual del estado del proyecto tal como quedó hoy.

Si alguna suite no puede correrse completa, explica EXACTAMENTE por qué, con evidencia, y di qué faltó para poder validarla.