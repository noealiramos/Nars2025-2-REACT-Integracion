Actúa como **Senior Full-Stack Engineer + QA Analyst + Integration Reviewer** sobre mi proyecto de e-commerce.

## Contexto del proyecto

Estoy trabajando en un proyecto full stack con frontend React/Vite y backend Node/Express + MongoDB.
Necesito que revises un posible problema funcional en la visualización de productos.

### Situación observada

En la vista de administración de productos sí se observan varios productos registrados, pero **no todos aparecen en la pantalla de “Inicio”** del frontend (por ejemplo en `http://localhost:5173/`).

Además, **según se tenía contemplada paginación**, pero actualmente **no la veo reflejada** en la interfaz de inicio.

## Objetivo de esta revisión

Quiero que hagas una **auditoría técnica puntual** de este comportamiento para responder con evidencia:

1. **Por qué no aparecen todos los productos en la página de inicio**.
2. Si el problema está en:

   * backend,
   * frontend,
   * integración entre ambos,
   * filtros,
   * paginación,
   * estado global,
   * consultas a la API,
   * respuesta del backend,
   * mapeo/render del frontend,
   * o datos inconsistentes en MongoDB.
3. Si **la paginación existe pero no se está mostrando**, o si **ya no está implementada**, o si **está rota**.
4. Qué solución propones **sin romper nada de lo ya avanzado**.
5. Qué riesgos existen antes de tocar código.

---

## Instrucción crítica

### NO MODIFIQUES NADA TODAVÍA

Primero debes trabajar en modo:

**REVISAR → DIAGNOSTICAR → DOCUMENTAR → PROPONER PLAN**

No ejecutes cambios de código, no hagas refactor, no corrijas nada, no instales nada y no borres nada hasta que yo apruebe expresamente el plan.

---

## Forma de trabajo requerida

### Fase 1. Revisión y diagnóstico

Haz una revisión ordenada del flujo completo de productos desde backend hasta frontend:

#### Backend

Revisa, documenta y valida:

* rutas de productos,
* controladores,
* servicios,
* queries a MongoDB,
* paginación en API,
* filtros activos,
* defaults como `limit`, `page`, `sort`,
* condiciones como `isActive`, `status`, `stock`, `deletedAt`, etc.,
* diferencias entre endpoint público de productos y endpoint admin,
* estructura real del JSON que devuelve la API,
* si el endpoint de inicio trae todos los productos o solo una parte.

#### Frontend

Revisa, documenta y valida:

* página Home / Inicio,
* componentes que listan productos,
* hooks,
* estado global o local,
* llamadas Axios/fetch,
* parámetros enviados al backend,
* lógica de paginación,
* render condicional,
* filtros automáticos,
* lazy load, infinite scroll o slices,
* si existe límite visual o de consulta,
* si hay productos ocultos por categoría, stock, estado, imagen faltante, error silencioso o key duplication.

#### Integración

Valida:

* URL real del backend consumida por el frontend,
* si hay diferencias entre `localhost:3000/api`, `localhost:3001/api` u otra,
* si el frontend consume el endpoint correcto,
* si la respuesta del backend coincide con lo que el frontend espera,
* si la paginación del backend tiene un formato que el frontend ya no interpreta correctamente.

---

### Fase 2. Evidencia obligatoria

Quiero evidencia clara y verificable.

Documenta:

* archivos revisados,
* rutas/endpoints involucrados,
* componentes involucrados,
* variables/env relevantes,
* respuesta real del endpoint de productos,
* cantidad de productos en base de datos,
* cantidad de productos devueltos por API,
* cantidad de productos efectivamente renderizados en Home.

Si encuentras diferencias, explícitalas claramente.

---

### Fase 3. Hallazgos

Entrega un diagnóstico con este formato:

#### A. Hallazgo principal

Describe la causa raíz más probable.

#### B. Hallazgos secundarios

Lista otros factores que también influyen.

#### C. Impacto

Explica qué afecta:

* visibilidad de productos,
* experiencia de usuario,
* consistencia entre admin e inicio,
* paginación,
* cumplimiento funcional.

#### D. Riesgos

Explica qué podría romperse si se corrige mal.

---

### Fase 4. Plan propuesto

Propón un plan de corrección en pasos pequeños, seguros y reversibles.

El plan debe incluir:

1. Qué archivo(s) tocarías.
2. Qué cambiarías exactamente.
3. Por qué ese cambio resuelve el problema.
4. Qué riesgo tiene cada cambio.
5. Cómo validarías que no se rompió nada.
6. Qué pruebas correrías después.

---

## Restricciones importantes

* No romper nada de lo ya avanzado.
* No introducir cambios innecesarios.
* No rehacer módulos completos si no hace falta.
* No asumir: valida con evidencia.
* No ocultar incertidumbre: si algo no está claro, dilo.
* Si detectas más de una causa posible, priorízalas.
* Si hay deuda técnica relacionada, sepárala del problema actual.

---

## Validaciones mínimas que debes hacer

Antes de proponer cambios, valida como mínimo:

1. **Cantidad de productos en la base de datos**
2. **Cantidad de productos que devuelve el endpoint público**
3. **Cantidad de productos que devuelve el endpoint admin**
4. **Cantidad de productos que renderiza Home**
5. **Si hay parámetro `limit` aplicado**
6. **Si hay paginación en backend**
7. **Si hay componente visual de paginación en frontend**
8. **Si existe filtro por estado / stock / visibilidad**
9. **Si hay productos con datos incompletos que el frontend omite**
10. **Si hay errores en consola o terminal relacionados con productos**

---

## Entregable obligatorio

Genera un archivo de documentación nuevo, claro y completo, con un nombre similar a:

`docs/specs/YYYY-MM-DD-diagnostico-productos-home-vs-admin.md`

o, si esa ruta no existe, usa una ubicación equivalente y coherente con el proyecto.

Ese documento debe incluir:

* objetivo,
* contexto,
* evidencia,
* archivos revisados,
* hallazgos,
* causa raíz probable,
* riesgos,
* plan de acción,
* criterios de validación.

### Importante

Incluye también en la documentación:

* lo que observes en terminal,
* comandos ejecutados,
* resultados relevantes,
* errores encontrados,
* respuestas de endpoints,
* cualquier observación útil para dejar trazabilidad.

---

## Formato de salida en terminal

Quiero que me entregues al final un resumen ejecutivo con esta estructura:

### Resumen ejecutivo

* problema observado
* causa raíz probable
* evidencia principal
* riesgo de corrección
* recomendación

### Plan propuesto

* paso 1
* paso 2
* paso 3
* etc.

### Estado final

Debes cerrar indicando explícitamente algo como:

**“Diagnóstico terminado. No se realizó ninguna modificación. Quedo en espera de liberación para ejecutar el plan.”**

---

## Regla final

Reitero:

### NO HAGAS CAMBIOS TODAVÍA.

Solo revisa, diagnostica, documenta y propón plan.
Cuando termines, espera mi aprobación antes de ejecutar cualquier modificación.
