# Repo cleanup and docs

## 1. Estado inicial

- El repositorio estaba funcional, pero con demasiada documentacion historica en `docs/` mezclada con la vigente.
- No existia `README.md` raiz.
- No existia `ecommerce-api-Nars/README.md`.
- `ecommerce-app-Nars/README.md` estaba desactualizado en puerto y `VITE_API_URL`.
- `docs/` mezclaba auditorias antiguas, reportes de progreso, resultados, logs temporales y material reciente.
- Habia basura real:
  - logs `.log` y `.err` en `docs/`
  - screenshots historicos/repetidos de Cypress en `ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/`

## 2. Cambios realizados

### Documentacion creada

- `README.md`
- `ecommerce-api-Nars/README.md`
- `docs/README.md`
- `docs/architecture.md`
- `docs/endpoints.md`

### Documentacion actualizada

- `ecommerce-app-Nars/README.md`

### Reestructuracion de docs

- Se consolido una estructura limpia en `docs/`:
  - `audit/`
  - `fixes/`
  - `qa/`
  - `specs/`
  - `archive/`
  - `release/`
- Se movio historico a:
  - `docs/archive/legacy-docs/`
  - `docs/archive/legacy-specs/`
  - `docs/archive/iteraciones/`

### Limpieza de basura real

- Se eliminaron logs `.log` y `.err` de `docs/`.
- Se eliminaron screenshots antiguos/redundantes de `ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/`.

Nota:

- La validacion E2E completa genero nuevamente screenshots frescos de `responsiveEvidence.cy.js`. Esos screenshots nuevos ya no son basura historica sino evidencia actual de la corrida final.

## 3. Archivos eliminados

### Logs y temporales eliminados de `docs/`

- `docs/audit-backend.err`
- `docs/audit-backend.log`
- `docs/audit-frontend.err`
- `docs/audit-frontend.log`
- `docs/max-score-iter1-dev.err`
- `docs/max-score-iter1-dev.log`
- `docs/max-score-iter2-dev.err`
- `docs/max-score-iter2-dev.log`
- `docs/profile-hardening-backend.err`
- `docs/profile-hardening-backend.log`
- `docs/profile-hardening-frontend.err`
- `docs/profile-hardening-frontend.log`
- `docs/tmp-backend.err`
- `docs/tmp-backend.log`

### Screenshots redundantes eliminados

- Se elimino el contenido historico acumulado previo de `ecommerce-app-Nars/cypress/screenshots/responsiveEvidence.cy.js/`.
- La carpeta fue recreada por la corrida E2E final con evidencia actual.

## 4. Archivos movidos

### A `docs/archive/legacy-docs/`

- `docs/Archivo_Canonico_01-18-50.md`
- `docs/AUDITORIA_5_DUDAS_MASTER_PLAN_2026-04-12-0134.md`
- `docs/AUDITORIA_AGAINST_RUBRIC_2026-04-08-0035.md`
- `docs/AUDITORIA_FINAL_RUBRICA.md`
- `docs/BACKLOG_CONSOLIDADO.md`
- `docs/CYPRESS_FINAL_CLOSURE-2026-04-03-2048.md`
- `docs/CYPRESS_STABILIZATION_FINAL-2026-04-03-1853.md`
- `docs/FINAL_AUDIT_POST_MP05_2026-04-04-0756.md`
- `docs/FINAL_AUDIT_RUBRICA-2026-04-03-2106.md`
- `docs/FINAL_AUDIT_RUBRICA-2026-04-03-2306.md`
- `docs/FINAL_AUDIT_SCORE_2026-04-04-0111.md`
- `docs/FINAL_CLOSEOUT_VERIFY_AGAINST_RUBRIC_2026-04-04-1035.md`
- `docs/FINAL_CLOSURE_130-2026-04-03-1642.md`
- `docs/FINAL_MICRO_ITERATION_GAPS_CLOSED_2026-04-04-0836.md`
- `docs/FINAL_PUSH_130_2026-04-04-0222.md`
- `docs/FINAL_VERIFICATION_AND_DEFENSE-2026-04-03-1808.md`
- `docs/MASTER_PLAN_EXECUTION_2026-04-12-0841.md`
- `docs/MasterPlanIntegracionFinal.md`
- `docs/MAX_SCORE_ITERATION_1-2026-04-03-2355.md`
- `docs/MAX_SCORE_ITERATION_2-2026-04-04-0021.md`
- `docs/MAX_SCORE_ITERATION_3-2026-04-04-0048.md`
- `docs/PHASE_2_4_PROGRESS.md`
- `docs/PHASE1_E2E_CLOSURE_REPORT.md`
- `docs/PHASE1_E2E_CLOSURE_REPORT_V2.md`
- `docs/PHASE1_FINAL_RELEASE_DECISION.md`
- `docs/PHASE2_HARDENING_PLAN.md`
- `docs/PHASE2_PROGRESS.md`
- `docs/PHASE2.2_PROGRESS.md`
- `docs/PHASE2.2_PROGRESS_2.md`
- `docs/POST_EXECUTION_VERIFICATION-2026-04-04-0035.md`
- `docs/RESPONSIVE_EVIDENCE_CLOSEOUT_2026-04-04-1154.md`
- `docs/Resultado_MP-02-EXEC-2026-04-03-1303.md`
- `docs/Resultado_MP-02-EXEC-2026-04-03-1332.md`
- `docs/Resultado_MP-03-2026-04-03-1435.md`
- `docs/Resultado_MP-04-2026-04-03-1458.md`
- `docs/Resultado_MP-04-2026-04-03-1554.md`
- `docs/Resultado_Profile-Hardening-2026-04-03-1308.md`
- `docs/Resultado_Prompt26.04.03.1233pm.md`
- `docs/ResultadoAuditoria_Post_Implementacion_MP-01.md`
- `docs/ResultadosPROMPT26.04.02-00.35.md`
- `docs/ResultadosPROMPT26.04.02-00.39.md`
- `docs/ResultadosPROMPT26.04.02.12.08`
- `docs/ResultAuditoriaVsRubrica.md`
- `docs/ResultDiagnosticoCorreccionVencimiento.md`
- `docs/ResultEjecucionCorreccionVencimiento.md`
- `docs/ResultPrompt26.04.03.0150pm.md`
- `docs/progress-Phase-1-testResult.md`
- `docs/progress-phase-1.md`

### A `docs/archive/legacy-specs/`

- `docs/specs/2026-03-30-feature-checkout-reuse-hardening.md`
- `docs/specs/2026-04-16-ui-fixes-ecommerce.md`
- `docs/specs/Fixes_-_ecommerce_2026-04-17-1855.md`
- `docs/specs/ui-fixes-ecommerce_2026-04-17-2257.md`
- `docs/specs/ui-fixes-ecommerce_2026-04-18-0110.md`
- `docs/specs/ui-fixes-ecommerce_2026-04-18-0144.md`

### A `docs/archive/`

- `docs/iteraciones/`

## 5. Nueva estructura

### `docs/`

```text
docs/
  README.md
  architecture.md
  endpoints.md
  audit/
  fixes/
  qa/
  release/
  specs/
  archive/
```

### Estado final de `docs/`

```text
architecture.md
archive/
audit/
endpoints.md
fixes/
qa/
README.md
release/
specs/
```

## 6. Documentos creados o actualizados

### Creados

- `README.md`
- `ecommerce-api-Nars/README.md`
- `docs/README.md`
- `docs/architecture.md`
- `docs/endpoints.md`
- `docs/release/2026-04-19-0115-repo-cleanup-docs.md`

### Actualizados

- `ecommerce-app-Nars/README.md`

## 7. Validacion final

### Resultado general

- Backend tests: `PASS`
- Frontend tests: `PASS`
- Frontend build: `PASS`
- Cypress E2E completa: `PASS`

### Nota de validacion frontend

- La primera corrida completa de frontend produjo timeouts en `CheckoutPage.test.jsx`.
- Se re-ejecutaron primero el archivo puntual y luego la suite completa.
- En la revalidacion ambas corridas pasaron completas, por lo que el comportamiento observado fue consistente con un timeout/flakiness puntual y no con regresion por la limpieza documental.

## 8. Output completo de terminal

### Pre-check obligatorio

```text
git status

On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   ecommerce-api-Nars/package.json
  modified:   ecommerce-api-Nars/scripts/start-test-server.mjs
  modified:   ecommerce-api-Nars/server.js
  modified:   ecommerce-api-Nars/src/config/env.js
  modified:   ecommerce-api-Nars/src/controllers/categoryController.js
  modified:   ecommerce-api-Nars/src/controllers/orderController.js
  modified:   ecommerce-api-Nars/src/models/category.js
  modified:   ecommerce-api-Nars/src/models/order.js
  modified:   ecommerce-api-Nars/src/routes/index.js
  modified:   ecommerce-api-Nars/tests/integration/auth.test.js
  modified:   ecommerce-api-Nars/tests/integration/cart_orders.test.js
  modified:   ecommerce-api-Nars/tests/integration/catalog.test.js
  modified:   ecommerce-api-Nars/tests/integration/resilience.test.js
  modified:   ecommerce-api-Nars/tests/integration/users.test.js
  modified:   ecommerce-api-Nars/tests/security.test.js
  modified:   ecommerce-api-Nars/tests/unit/controllers/categoryController.test.js
  modified:   ecommerce-api-Nars/tests/unit/controllers/orderController.test.js
  modified:   ecommerce-app-Nars/cypress/e2e/cart.cy.js
  modified:   ecommerce-app-Nars/cypress/e2e/checkoutReuse.cy.js
  modified:   ecommerce-app-Nars/cypress/e2e/goldenPath.cy.js
  modified:   ecommerce-app-Nars/cypress/e2e/orders.cy.js
  modified:   ecommerce-app-Nars/cypress/support/commands.js
  modified:   ecommerce-app-Nars/src/api/apiClient.js
  modified:   ecommerce-app-Nars/src/api/paymentApi.js
  modified:   ecommerce-app-Nars/src/api/productApi.js
  modified:   ecommerce-app-Nars/src/api/shippingApi.js
  modified:   ecommerce-app-Nars/src/components/organisms/CartSummary.jsx
  modified:   ecommerce-app-Nars/src/constants/orderConstants.js
  modified:   ecommerce-app-Nars/src/hooks/useAdminCategories.js
  modified:   ecommerce-app-Nars/src/index.css
  modified:   ecommerce-app-Nars/src/pages/AdminCategoriesPage.css
  modified:   ecommerce-app-Nars/src/pages/AdminCategoriesPage.jsx
  modified:   ecommerce-app-Nars/src/pages/AdminProductsPage.css
  modified:   ecommerce-app-Nars/src/pages/AdminProductsPage.jsx
  modified:   ecommerce-app-Nars/src/pages/CheckoutPage.css
  modified:   ecommerce-app-Nars/src/pages/CheckoutPage.jsx
  modified:   ecommerce-app-Nars/src/pages/ConfirmationPage.jsx
  modified:   ecommerce-app-Nars/src/pages/HomePage.css
  modified:   ecommerce-app-Nars/src/pages/HomePage.jsx
  modified:   ecommerce-app-Nars/src/pages/LoginPage.css
  modified:   ecommerce-app-Nars/src/pages/LoginPage.jsx
  modified:   ecommerce-app-Nars/src/pages/OrderDetailPage.jsx
  modified:   ecommerce-app-Nars/src/pages/ProfilePage.css
  modified:   ecommerce-app-Nars/src/pages/ProfilePage.jsx
  modified:   ecommerce-app-Nars/src/pages/__tests__/AdminProductsPage.test.jsx
  modified:   ecommerce-app-Nars/src/pages/__tests__/CartPage.test.jsx
  modified:   ecommerce-app-Nars/src/pages/__tests__/CheckoutPage.test.jsx
  modified:   ecommerce-app-Nars/src/pages/__tests__/LoginPage.test.jsx
  modified:   ecommerce-app-Nars/src/pages/__tests__/ProfilePage.test.jsx
  modified:   ecommerce-app-Nars/src/services/orderService.js
  modified:   ecommerce-app-Nars/src/services/productService.js
  modified:   ecommerce-app-Nars/src/services/userService.js
  modified:   ecommerce-app-Nars/src/utils/formValidators.js

Untracked files:
  Prompt Unificacion de Tareas.docx
  Requerimientos a Corregir.docx
  docs/... multiples archivos historicos y carpetas nuevas ...
  ecommerce-api-Nars/src/app.js
  ecommerce-api-Nars/src/config/cloudinary.js
  ecommerce-api-Nars/src/controllers/uploadController.js
  ecommerce-api-Nars/src/middlewares/uploadMiddleware.js
  ecommerce-api-Nars/src/routes/uploadRoutes.js
  ecommerce-app-Nars/cypress/e2e/checkoutAddressModes.cy.js
  ecommerce-app-Nars/src/api/uploadApi.js
  ecommerce-app-Nars/src/pages/__tests__/AdminCategoriesPage.test.jsx
  ecommerce-app-Nars/src/pages/__tests__/ConfirmationPage.test.jsx
  ecommerce-app-Nars/src/pages/__tests__/HomePage.test.jsx
  ecommerce-app-Nars/src/pages/__tests__/OrderDetailPage.test.jsx
  opencode/... prompts y slides ...
```

### Creacion de archive + movimientos

```text
powershell -NoProfile -Command '& { New-Item -ItemType Directory -Force -Path "...\docs\archive" | Out-Null; New-Item -ItemType Directory -Force -Path "...\docs\release" | Out-Null; New-Item -ItemType Directory -Force -Path "...\docs\archive\legacy-docs" | Out-Null; New-Item -ItemType Directory -Force -Path "...\docs\archive\legacy-specs" | Out-Null; ... Move-Item ... }'
```

```text
powershell -NoProfile -Command '& { Get-ChildItem ... | Where-Object { $_.Extension -in @(".log",".err") } | Remove-Item -Force; ... Remove-Item screenshots ... }'
```

### Suite completa backend

```text
> ecommerce-api@1.0.0 test
> vitest

Test Files  27 passed (27)
Tests       163 passed (163)
Duration    29.62s
```

### Suite completa frontend — primera corrida

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run

FAIL src/pages/__tests__/CheckoutPage.test.jsx
Error: Test timed out in 5000ms.

Test Files  1 failed | 15 passed (16)
Tests       2 failed | 85 passed (87)
Duration    38.68s
```

### Revalidacion puntual CheckoutPage

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run src/pages/__tests__/CheckoutPage.test.jsx

Test Files  1 passed (1)
Tests       17 passed (17)
Duration    24.31s
```

### Suite completa frontend — segunda corrida

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run

Test Files  16 passed (16)
Tests       87 passed (87)
Duration    23.86s
```

### Build frontend

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

vite v6.4.1 building for production...
✓ 208 modules transformed.
✓ built in 9.01s
```

### Suite E2E completa

```text
npx cypress run

All specs passed!                        04:44       33       33        -        -        -
```

### Estado final de `docs/`

```text
architecture.md
archive/
audit/
endpoints.md
fixes/
qa/
README.md
release/
specs/
```

## 9. Conclusion

- El repositorio quedo mas claro y presentable.
- La documentacion canónica minima necesaria ya existe.
- El historico se preservo en `docs/archive/` sin contaminar la entrega principal.
- La basura real fue removida.
- El proyecto sigue funcionando y pasando validaciones clave tras la limpieza.
