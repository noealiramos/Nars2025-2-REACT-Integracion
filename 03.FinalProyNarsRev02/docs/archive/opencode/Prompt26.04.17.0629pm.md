Actúa como engineer senior full-stack dentro del proyecto integrador de ecommerce, siguiendo estrictamente el manual operativo y las políticas de trabajo ya definidas para este repositorio.

## CONTEXTO DEL PROYECTO
Monorepo local:
D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02

Apps:
- Backend: ecommerce-api-Nars
- Frontend: ecommerce-app-Nars

Stack esperado:
- Frontend: React + Vite
- Backend: Express + MongoDB/Mongoose
- Tests: Cypress + Vitest
- Imágenes: Cloudinary ya integrado

## OBJETIVO DE ESTA FASE
Implementar SOLO los quick wins de bajo riesgo ya auditados, sin tocar backend salvo que sea absolutamente innecesario, y sin mezclar esta fase con requerimientos más delicados.

### Alcance estricto de esta fase
- REQ 1 — Home / bloque descriptivo principal
- REQ 2 — Login
- REQ 3 — Profile
- REQ 7 — Admin products / ocultar texto accesorio

### Fuera de alcance en esta fase
NO tocar todavía:
- REQ 4 IVA / totales / contrato de orden
- REQ 5 checkout direcciones Guardar/Cancelar
- REQ 6 layout + imagen en admin products
- REQ 8 admin categories
- refactors amplios
- cambios de arquitectura
- cambios de contratos API

## POLÍTICAS OBLIGATORIAS
Cumple esto sin excepción:
- No inventes nada.
- No rompas ningún contrato.
- No cambies endpoints.
- No metas mocks.
- No hardcodees datos falsos.
- No aproveches esta fase para “limpiar” otras cosas no pedidas.
- Haz cambios mínimos, quirúrgicos y verificables.
- Si el worktree está sucio, primero revísalo y evita sobrescribir trabajo previo.
- Documenta evidencia real, no supuesta.

## PASO 0 — CONTROL DE WORKTREE
Antes de editar, revisa:
- `git status --short`
- `git diff --stat`

Si detectas cambios previos en archivos que vayas a tocar:
- documéntalo en el reporte,
- trabaja con extremo cuidado,
- no sobrescribas cambios ajenos sin verificar el diff.

## IMPLEMENTAR EN ESTA FASE

# REQ 1 — HOME
## Objetivo
Mejorar el bloque principal del hero para que el texto aproveche mejor el recuadro disponible, sin romper responsive ni cambiar el tono visual del proyecto.

## Lo que debes hacer
- Revisar `HomePage.jsx` y `HomePage.css`.
- Ajustar layout y/o estilos del hero para que el texto no quede restringido innecesariamente.
- Resolver el problema de aprovechamiento del recuadro.
- Mantener la estética existente.
- Validar desktop, tablet y mobile.

## Restricciones
- No inventar nuevo copy comercial.
- No rehacer toda la pantalla.
- No meter una nueva estructura compleja si basta con corregir width, max-width, grid o flex.

# REQ 2 — LOGIN
## Objetivo
Dejar la pantalla de login más limpia y profesional.

## Lo que debes hacer
- Retirar el texto visible tipo demo/ayuda de usuario de prueba.
- Hacer que correo y contraseña SIEMPRE inicien vacíos.
- Revisar pruebas unitarias o de integración afectadas y actualizarlas si esperan valores precargados.
- Confirmar que Cypress siga siendo compatible.

## Restricciones
- No afectar la lógica de autenticación.
- No cambiar rutas.
- No tocar backend.
- No alterar el flujo de submit.
- Si hay pruebas que dependían de los valores precargados, actualízalas de forma mínima y limpia.

# REQ 3 — PROFILE
## Objetivo
Alinear visualmente la pantalla profile con la paleta oscura/azul ya existente del proyecto y ajustar el texto descriptivo.

## Lo que debes hacer
- Cambiar el texto descriptivo para que quede exactamente:
  “Consulta tu información y actualiza los datos.”
- Ajustar la apariencia de la tarjeta principal y/o superficies claras para usar tonos azules obscuros ya existentes en el proyecto.
- Reutilizar variables, colores o estilos ya presentes en `src/index.css` o en estilos globales.
- Mantener legibilidad de labels, inputs, botones y estados.

## Restricciones
- No inventar una paleta nueva.
- No tocar la lógica de carga ni guardado del perfil.
- No romper responsive.
- No degradar el contraste.

# REQ 7 — ADMIN PRODUCTS / TEXTO ACCESORIO
## Objetivo
Ocultar o retirar el texto accesorio de UI que no aporta valor al usuario final.

## Lo que debes hacer
- Revisar `AdminProductsPage.jsx`.
- Retirar de la UI visible el texto auxiliar relacionado con URL manual / URL lista si no aporta al usuario.
- Mantener intacta la lógica de upload y de guardado de imagen.
- Mantener visibles solo mensajes realmente útiles al usuario final.

## Restricciones
- No romper la carga de imagen.
- No eliminar feedback útil de error o éxito.
- No mezclar todavía con REQ 6 de layout/imágenes.

## ARCHIVOS ESPERADOS A REVISAR / TOCAR
Frontend:
- `ecommerce-app-Nars/src/pages/HomePage.jsx`
- `ecommerce-app-Nars/src/pages/HomePage.css`
- `ecommerce-app-Nars/src/pages/LoginPage.jsx`
- `ecommerce-app-Nars/src/pages/LoginPage.css`
- `ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx`
- `ecommerce-app-Nars/src/pages/ProfilePage.jsx`
- `ecommerce-app-Nars/src/pages/ProfilePage.css`
- `ecommerce-app-Nars/src/index.css`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.jsx`
- `ecommerce-app-Nars/src/pages/AdminProductsPage.css`

Solo si aplica por pruebas:
- specs o pruebas relacionadas de frontend

## DOCUMENTACIÓN OBLIGATORIA
Genera este archivo:
`docs/specs/Fixes_-_ecommerce*YYYY-MM-DD-HHmm.md`
- incluyendo todo lo que muestres en la terminal


Agrega una nueva sección claramente separada para esta fase, por ejemplo:
- “FASE 3 — Ejecución quick wins”
o nombre equivalente.

Quiero que documentes:
1. archivos revisados
2. archivos modificados
3. diff funcional resumido
4. motivo de cada cambio
5. riesgos
6. validaciones ejecutadas
7. resultados de tests
8. cualquier ajuste menor a pruebas

## VALIDACIONES OBLIGATORIAS
Haz validación manual mínima de:
- Home hero se ve mejor y aprovecha mejor el espacio.
- Login abre con inputs vacíos.
- Ya no aparece el texto demo.
- Login sigue funcionando.
- Profile muestra el nuevo texto exacto.
- Profile mantiene buena legibilidad y coherencia visual.
- Admin products ya no muestra texto accesorio innecesario.

## TESTS
Ejecuta las pruebas mínimas relevantes para esta fase.
Como mínimo revisa:
- pruebas de login afectadas
- cualquier test de profile si existe
- cualquier test de admin products si existe
- una validación razonable de que Cypress no se rompe por el cambio de login

Si no ejecutas algún test, explica exactamente por qué.

## FORMA DE RESPUESTA ESPERADA
En esta corrida sí quiero implementación, pero SOLO de esta fase.

Tu salida debe incluir:
1. Resumen de lo implementado
2. Archivos modificados
3. Riesgos o hallazgos
4. Tests ejecutados y resultado
5. Actualización del documento `docs/specs/2026-04-16-ui-fixes-ecommerce.md`

## CRITERIO DE CALIDAD
Quiero cambios:
- mínimos
- limpios
- consistentes
- reversibles
- sin side effects

No escales el alcance.
No aproveches para tocar otros requerimientos.
No toques IVA ni checkout complejo todavía.

Implementa ahora esta fase.