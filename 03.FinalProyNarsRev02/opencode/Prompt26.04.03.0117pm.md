Necesito que atiendas ÚNICAMENTE estos 2 puntos antes de avanzar a cualquier otra fase:

1) agregar un Test E2E mínimo de `/profile` (incluyendo usuario autenticado y NO autenticado)
2) fortalecer `userService` con defensive parsing

Trabaja en modo:
- incremental
- controlado
- sin big-bang
- sin romper contratos existentes
- sin avanzar a MP-03 ni a ninguna otra fase

IMPORTANTE:
NO implementes nada hasta terminar primero la PRE-IMPLEMENTACIÓN DETALLADA solicitada abajo.

---

# CONTEXTO

Ya existe implementación de perfil en frontend, documentada en:

- `docs/Resultado_MP-02-EXEC-2026-04-03-1303.md`
- `docs/iteraciones/iteracion-1-2026-04-03-1302.md`

Estado actual esperado:

- existe `src/services/userService.js`
- existe `src/pages/ProfilePage.jsx`
- existe ruta protegida `/profile`
- existe acceso desde `SiteHeader`
- existen pruebas unitarias/componentes
- NO existe prueba E2E real mínima de `/profile`

Objetivo:

Cerrar riesgos detectados en MP-02:
- fragilidad ante cambios de shape en backend
- falta de validación E2E real de la ruta protegida

SIN tocar backend salvo que sea absolutamente necesario.

---

# FASE 1 - PRE-IMPLEMENTACIÓN DETALLADA

Antes de ejecutar cambios, genera un análisis detallado con este nivel de precisión:

## A) Archivos a crear o modificar

Para cada archivo:
- ruta completa
- indicar si es nuevo o existente
- propósito exacto

---

## B) Plan del Test E2E mínimo de `/profile`

Define con precisión:

1. archivo E2E que crearás o modificarás

2. precondiciones

3. estrategia de autenticación
   - preferir flujo real por UI
   - NO usar mocks de respuesta
   - NO romper la disciplina de integración real

4. pasos exactos del test

### Escenario 1 - Usuario autenticado

- login por UI
- navegación a `/profile` (directa o vía header)
- espera de carga

Validaciones mínimas:
- la ruta es `/profile`
- la página renderiza
- existen elementos visibles del perfil (nombre, email u otro identificador estable)

---

### Escenario 2 - Usuario NO autenticado (OBLIGATORIO)

- intentar acceder a `/profile` directamente sin login

Comportamiento esperado:
- redirección a login (o equivalente)

Validaciones mínimas:
- URL final incluye `/login` (o ruta equivalente)
- NO existe contenido de perfil en pantalla

---

5. assertions exactas que usarás

6. riesgos de fragilidad del test
   - selectores inestables
   - dependencia de datos dinámicos
   - sesiones expiradas

7. cómo evitar flaky tests
   - uso de `data-testid` o `data-cy` si es necesario
   - esperas controladas
   - evitar dependencias innecesarias

---

## C) Plan para defensive parsing en `userService`

Explica exactamente:

1. cómo se consume hoy `/api/users/me`

2. qué shapes de respuesta vas a tolerar:

- `{ data: user }`
- `user`
- `{ user: ... }` si aplica
- otros razonables si ya existen

3. comportamiento ante respuestas inválidas:
- null
- undefined
- estructura inesperada

4. estrategia:
- devolver `null` controlado o lanzar error
- NO ocultar errores críticos

5. impacto esperado en `ProfilePage`

---

## D) Validación de contratos

Confirma explícitamente impacto en:

- auth
- cart
- checkout

Para cada uno:
- cambio de contrato: sí/no
- riesgo: bajo/medio/alto
- justificación breve

---

## E) Estrategia de validación

Después de cada cambio debes ejecutar:

- tests unitarios/componentes
- test E2E específico
- build
- validación mínima manual si aplica

---

## F) Criterio de salida

Define claramente cuándo esta mini-fase se considera terminada.

---

# REGLAS DE IMPLEMENTACIÓN

Cuando inicies implementación:

1. Cambios pequeños y secuenciales
2. Después de CADA cambio:
   - correr tests
   - correr build
   - reportar resultado
3. NO hacer refactors no relacionados
4. NO modificar backend innecesariamente
5. NO romper contratos existentes
6. NO usar mocks falsos en E2E
7. Si detectas bloqueo → detener y documentar

---

# IMPLEMENTACIÓN

## Parte 1 - Defensive parsing en `userService`

Implementar:

- parsing robusto de respuesta
- tolerancia a variaciones de shape
- sin romper comportamiento actual

Priorizar:
- claridad
- bajo riesgo
- compatibilidad

---

## Parte 2 - Test E2E mínimo de `/profile`

Debe incluir EXACTAMENTE estos dos escenarios:

### 1) Usuario autenticado
- accede a `/profile`
- ve contenido del perfil

### 2) Usuario NO autenticado
- intenta acceder a `/profile`
- es redirigido a login
- no ve contenido protegido

Si necesitas agregar `data-testid` o `data-cy`:
- haz el cambio mínimo
- documenta por qué

---

# DOCUMENTACIÓN OBLIGATORIA

Genera un archivo markdown con timestamp:

`docs/Resultado_Profile-Hardening-YYYY-MM-DD-HHMM.md`

Debe incluir:

## 1. Resumen ejecutivo
- qué se hizo
- por qué

## 2. Archivos modificados

## 3. Defensive parsing
- antes vs después
- riesgos cubiertos

## 4. Test E2E agregado

Debe incluir:

- flujo autenticado
- flujo NO autenticado
- cómo se valida redirección
- cómo se evita fuga de datos

## 5. Validación de contratos

- auth
- cart
- checkout

## 6. Resultados de pruebas

- unit/component
- e2e
- build

## 7. Riesgos residuales

## 8. Registro de terminal
- incluir salidas relevantes de:
  - vitest
  - cypress
  - build

---

# ORDEN DE EJECUCIÓN

1. PRE-IMPLEMENTACIÓN DETALLADA
2. Implementación defensive parsing
3. Validación
4. Implementación E2E `/profile`
5. Validación
6. Documentación
7. Resumen final

---

# RESTRICCIÓN FINAL

NO avanzar a MP-03  
NO proponer nuevas fases  
NO modificar fuera de este alcance  

---

# ENTREGA FINAL

Al terminar, entregar:

- resumen claro y directo
- riesgos residuales
- decisión final:
  → "listo para continuar"
  → o "aún no listo"

REGLA CRÍTICA DE TRAZABILIDAD:

No olvides al finalizar:

1. Generar un archivo .md en:
   docs/Resultado_MP-02-EXEC-[timestamp].md.