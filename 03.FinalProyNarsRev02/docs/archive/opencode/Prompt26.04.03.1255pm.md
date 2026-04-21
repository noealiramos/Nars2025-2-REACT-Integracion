Ejecuta MP-02 en modo controlado e incremental.

Objetivo:
Implementar `ProfilePage` real con datos de `GET /api/users/me`, agregar la ruta protegida `/profile` y exponer acceso desde `SiteHeader`, sin romper contratos existentes.

REGLAS ESTRICTAS:

1. Ejecuta SOLO MP-02.
2. NO hagas cambios big-bang.
3. Implementa EXACTAMENTE en este orden:

   Paso 1:
   - crear `src/services/userService.js`

   Paso 2:
   - crear `src/pages/ProfilePage.jsx`
   - crear `ProfilePage.css` SOLO si es necesario

   Paso 3:
   - registrar `/profile` en `src/App.jsx` usando `PrivateRoute`

   Paso 4:
   - agregar enlace de perfil en `src/components/organisms/SiteHeader.jsx`

   Paso 5:
   - crear `src/pages/__tests__/ProfilePage.test.jsx`
   - ajustar `src/components/organisms/__tests__/SiteHeader.test.jsx`

   Paso 6:
   - actualizar `docs/iteraciones/iteracion-1-YYYY-MM-DD-HHmm.md`
     (usar fecha y hora actual en el nombre del archivo)

--------------------------------------------------

DESPUÉS DE CADA PASO:

1. Ejecuta:
   - npm test
   - npm run build

2. Reporta SIEMPRE:

   - archivos modificados (ruta completa)
   - impacto en contratos:
     - auth
     - cart
     - checkout
   - resultado REAL de tests (no simulado)
   - resultado REAL de build

3. Si hay error:
   - detente
   - explica causa raíz
   - propone solución antes de continuar

--------------------------------------------------

REGLA CRÍTICA DE TRAZABILIDAD (NUEVA):

Al finalizar TODA la ejecución:

1. Genera un archivo .md en:
   docs/Resultado_MP-02-EXEC-[timestamp].md

2. El archivo DEBE incluir:

   a) Resumen de implementación
   b) Lista completa de archivos creados/modificados
   c) Validación de contratos (auth/cart/checkout)
   d) Resultados de testing por paso
   e) Resultados de build por paso
   f) Riesgos detectados (si hubo)

3. SECCIÓN OBLIGATORIA FINAL:

   ## Registro textual de terminal

   - Copia EXACTAMENTE (texto literal) todo lo que mostraste en la terminal
   - NO resumir
   - NO reinterpretar
   - NO omitir líneas relevantes

4. El contenido del .md debe ser un reflejo fiel de la ejecución real.

--------------------------------------------------

CONDICIONES DE ACEPTACIÓN:

- `/profile` existe y está protegida
- `SiteHeader` enlaza al perfil autenticado
- la página consume `GET /api/users/me` sin cambiar backend
- tests en verde
- build exitoso
- sin warnings críticos

--------------------------------------------------

REGLA FINAL:

NO avances a MP-03.
DETENTE completamente al terminar.