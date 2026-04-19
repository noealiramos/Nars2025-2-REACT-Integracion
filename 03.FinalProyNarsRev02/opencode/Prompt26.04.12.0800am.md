# MASTER PLAN DEFINITIVO — CIERRE TOTAL E-COMMERCE (130/130)

Entra en modo **PLAN MAESTRO + IMPLEMENTACIÓN AUTÓNOMA CONTROLADA + CERO REGRESIONES + CUMPLIMIENTO TOTAL DE RÚBRICA**.

---

# ⚠️ AUTORIZACIÓN EXPLÍCITA (MUY IMPORTANTE)

Tienes autorización para:

✅ Tomar decisiones técnicas
✅ Implementar cambios necesarios
✅ Crear/modificar archivos
✅ Corregir errores que encuentres
✅ Ajustar frontend y backend

🚫 SIN pedir confirmación en ningún momento

---

# 🧠 CONDICIONES OBLIGATORIAS

1. SIEMPRE respetar el plan que tú mismo generes
2. NO hacer cambios innecesarios
3. NO romper funcionalidad existente
4. NO cambiar contratos del backend
5. SI algo implica riesgo → resuélvelo de forma conservadora
6. TODO debe ser incremental y validado
7. SI detectas inconsistencia → corrígela dentro del flujo

---

# 🎯 OBJETIVO GLOBAL

Cerrar completamente el proyecto e-commerce para lograr:

✅ Flujo end-to-end funcional
✅ CRUDs completos en UI
✅ Integración real frontend-backend
✅ UX consistente
✅ Imágenes funcionales (Cloudinary + URL manual)
✅ Cumplimiento total de rúbrica (130/130)

---

# 🧾 CONTEXTO REAL (OBLIGATORIO RESPETAR)

* Direcciones → `ShippingAddress` (CRUD backend OK)
* Pagos → `PaymentMethod` (CRUD backend OK)
* Profile → backend soporta `PATCH /users/me`, frontend no lo usa
* Imágenes → `imagesUrl` (URL manual actual)
* Cloudinary → instalado, no integrado
* Estilos → CSS plano, bug en textarea por variable no definida

👉 Backend está listo
👉 Trabajo principal = frontend + integración

---

# 🚫 REGLAS CRÍTICAS (NO ROMPER NADA)

* NO eliminar soporte de URL manual
* NO refactor masivo
* NO cambiar rutas existentes
* NO romper flujo actual ni pruebas existentes
* Mantener compatibilidad total

---

# 🧭 FASE 1 — PLAN MAESTRO

Genera y documenta:

## 1. Módulos a intervenir

* checkout (direcciones / pagos)
* profile
* admin products (imagen)
* admin categories (UI)
* backend upload (Cloudinary)

## 2. Orden de ejecución JUSTIFICADO

## 3. Riesgos por módulo

## 4. Estrategia anti-regresión

## 5. Mapeo contra rúbrica

---

# 🚀 FASE 2 — IMPLEMENTACIÓN CONTROLADA

## 🔹 BLOQUE 1 — FIX UI

* Resolver textarea blanco
* Ajustar `--surface-elevated` o background directo
* Validar visualmente sin romper estilos existentes

---

## 🔹 BLOQUE 2 — PROFILE EDIT

* Crear formulario editable en `/profile`
* Conectar con `PATCH /users/me`
* Manejar estados: loading / error / success

---

## 🔹 BLOQUE 3 — DIRECCIONES CRUD

* Editar dirección (PUT/PATCH)
* Eliminar dirección (DELETE)
* Refrescar lista correctamente

---

## 🔹 BLOQUE 4 — PAGOS CRUD

* Editar método
* Eliminar (soft delete)
* Mantener lógica de default

---

## 🔹 BLOQUE 5 — CLOUDINARY BACKEND

* Configurar Cloudinary usando variables de entorno
* Middleware `multer`
* Endpoint `POST /api/upload`
* Validaciones:

  * tipo archivo
  * tamaño

### Respuesta esperada:

{
"imageUrl": "...",
"publicId": "..."
}

---

## 🔹 BLOQUE 6 — IMÁGENES FRONTEND

* Permitir:

  * subir archivo → obtener URL
  * o ingresar URL manual
* Guardar SIEMPRE como `imagesUrl`

---

# 🧪 FASE 3 — VALIDACIÓN GLOBAL

Validar:

* Flujo completo: login → productos → carrito → checkout → confirmación
* Profile editable
* CRUD direcciones funcionando
* CRUD pagos funcionando
* Admin productos funcional
* Imágenes funcionando (upload + URL)

---

# 📊 FASE 4 — VALIDACIÓN RÚBRICA (GENERAL)

Verificar cumplimiento:

* Flujo completo funcional
* Integración real con backend
* CRUD completo
* UX consistente

---

# 🧾 VALIDACIÓN EXPLÍCITA CONTRA RÚBRICA (OBLIGATORIO)

Evalúa el proyecto contra la rúbrica oficial:

Archivo:
rubrica-evaluacion.pdf

Debes generar una evaluación HONESTA, criterio por criterio:

## I. Requisitos Generales

* I.1 Consumo backend → OK / FAIL + evidencia
* I.2 Flujo completo → OK / FAIL + evidencia
* I.3 Despliegue → OK / FAIL + estado actual

## II. Flujo Funcional

* II.1 Auth
* II.2 Productos
* II.3 Carrito
* II.4 Checkout
* II.5 User Pages

## III. Técnico

* Context API
* React Query
* Axios Interceptors
* Protected Routes
* Custom Hooks
* Forms Validation
* Lazy Loading
* Loading/Error States

## IV. Calidad

* Responsive
* Unit Tests
* E2E Tests

## V. Extra

* Admin Panel
* CRUD completo
* Modelo adicional (si aplica)

Para cada punto:

* estado: OK / PARCIAL / FAIL
* evidencia concreta
* impacto en puntaje

## RESULTADO FINAL:

* Puntaje real estimado: X / 130
* Justificación honesta

---

# 📄 FASE 5 — DOCUMENTACIÓN FINAL

Genera:

`docs/MASTER_PLAN_EXECUTION_YYYY-MM-DD-HHmm.md`

Debe incluir EXACTAMENTE:

# MASTER PLAN EXECUTION

## 1. Plan inicial

## 2. Orden ejecutado

## 3. Cambios por módulo

## 4. Validaciones realizadas

## 5. Cumplimiento de rúbrica

## 6. Evidencia real

## 7. Problemas encontrados

## 8. Soluciones aplicadas

## 9. Estado final del sistema

## 10. Puntaje estimado (honesto)

## 11. Riesgos residuales

## 12. Dictamen final (¿listo para entrega?)

---

# 🧾 SALIDA FINAL EN TERMINAL

RESULTADO FINAL:

* Checkout: OK / FAIL
* Profile: OK / FAIL
* Direcciones CRUD: OK / FAIL
* Pagos CRUD: OK / FAIL
* Imágenes upload: OK / FAIL
* Flujo completo: OK / FAIL
* Puntaje estimado: X/130

---

# 🏁 CRITERIO DE ÉXITO

✅ Nada roto
✅ CRUD completo
✅ Upload funcionando
✅ Flujo estable
✅ Documentación completa
✅ Evaluación de rúbrica generada
✅ Proyecto listo para evaluación

---

# ⚙️ FORMA DE TRABAJO

1. Planear
2. Ejecutar por bloques
3. Validar cada bloque
4. Continuar
5. Documentar

---

EJECUTA TODO SIN DETENERTE Y SIN PEDIR CONFIRMACIÓN.
