Entra en modo **AUDITORÍA DE DESCUBRIMIENTO + CERO CAMBIOS + RESPUESTAS CON EVIDENCIA**.

## OBJETIVO

Necesito que audites el proyecto real y respondas con evidencia concreta estas 5 preguntas técnicas antes de preparar un plan maestro de implementación.

**MUY IMPORTANTE:**

* **NO modifiques nada**
* **NO instales nada**
* **NO hagas refactor**
* **NO generes commits**
* **NO ejecutes cambios automáticos**
* Solo inspecciona, busca, correlaciona y responde con evidencia real

## CONTEXTO DEL PROYECTO

Ruta base del proyecto:

`D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02`

Apps esperadas:

* backend: `ecommerce-api-Nars`
* frontend: `ecommerce-app-Nars`

## LAS 5 DUDAS A RESOLVER

### 1) ¿Dónde se guardan actualmente las direcciones y métodos de pago?

Determina con evidencia si las direcciones de envío y los métodos de pago se guardan en:

* una colección propia en MongoDB
* embebidos dentro del modelo `User`
* otra entidad relacionada
* solo frontend / estado / localStorage
* o combinación híbrida

Debes localizar:

* modelos
* controladores
* rutas
* servicios frontend
* páginas/componentes del checkout
* cualquier uso de localStorage/sessionStorage relacionado

Y responder por separado:

* **Direcciones**
* **Métodos de pago**

---

### 2) ¿Cómo se llama realmente el campo de imágenes del producto?

Detecta en el backend y frontend cuál es el nombre real del campo usado para imágenes de producto.

Busca posibilidades como:

* `image`
* `imageUrl`
* `images`
* `imagesUrl`
* `mainImage`
* u otro

Debes identificar:

* nombre real en el modelo Mongoose
* nombre esperado en validaciones/controladores
* nombre usado en formularios frontend
* nombre mostrado en cards/detail pages
* si hay discrepancias entre backend y frontend

---

### 3) ¿Ya existe endpoint para actualizar perfil de usuario?

Debes comprobar si actualmente existe soporte real para editar perfil de usuario.

Investiga:

* rutas backend de usuarios/auth/profile
* controladores
* servicios frontend
* la pantalla `http://localhost:5173/profile` a nivel código

Responde claramente:

* si existe `GET`
* si existe `PUT/PATCH`
* si existe solo UI sin conexión
* si hay validación/auth asociada
* si el flujo está implementado parcial o totalmente

---

### 4) ¿Qué sistema de estilos usa realmente el frontend?

Necesito saber qué base de estilos usa el proyecto frontend para corregir inputs/textarea sin romper diseño.

Audita:

* `package.json`
* `tailwind.config.*`
* `postcss.config.*`
* archivos CSS globales
* uso de módulos CSS
* styled-components
* MUI / Chakra / Bootstrap / shadcn / u otro
* clases utilitarias visibles en componentes admin y checkout

Responde de forma concreta:

* stack real de estilos
* si es híbrido
* dónde conviene tocar para arreglar textarea/input blancos

---

### 5) ¿El flujo actual de imágenes funciona solo por URL manual?

Verifica el flujo actual de creación/edición de productos respecto a imágenes.

Necesito saber si hoy el flujo real es:

1. usuario escribe una URL manual
2. frontend la envía
3. backend la guarda en MongoDB
4. frontend la renderiza

Debes verificar:

* formulario de admin products
* payload real esperado
* controlador backend
* persistencia real
* render en frontend
* si existe ya algún upload o solo URLs
* si el campo “Imagen principal (URL)” realmente está conectado o solo está visualmente presente

---

## FORMA DE TRABAJO

Trabaja así:

### FASE 1. MAPEO

Inspecciona estructura real de:

* backend
* frontend
* modelos
* rutas
* controladores
* servicios
* componentes relevantes

### FASE 2. EVIDENCIA

Para cada respuesta, cita archivos concretos y explica:

* qué encontraste
* en qué archivo
* qué implica funcionalmente

### FASE 3. CONCLUSIONES

Responde de forma directa y separada las 5 preguntas.

### FASE 4. HALLAZGOS ADICIONALES

Si detectas inconsistencias relevantes que afecten un futuro “prompt maestro”, anótalas, pero **sin proponer todavía implementación grande**.

---

## ENTREGABLE OBLIGATORIO

Genera un único markdown final en:

`docs/AUDITORIA_5_DUDAS_MASTER_PLAN_YYYY-MM-DD-HHmm.md`

Debe incluir EXACTAMENTE estas secciones:

# AUDITORÍA DE 5 DUDAS PREVIAS AL MASTER PLAN

## 1. Objetivo

## 2. Estructura inspeccionada

## 3. Respuesta a la duda 1: direcciones y métodos de pago

## 4. Respuesta a la duda 2: campo real de imágenes de producto

## 5. Respuesta a la duda 3: actualización de perfil

## 6. Respuesta a la duda 4: sistema de estilos frontend

## 7. Respuesta a la duda 5: flujo actual de imágenes

## 8. Hallazgos adicionales relevantes

## 9. Resumen ejecutivo para preparar el prompt maestro

## 10. Evidencia consultada

## REGLAS PARA EL DOCUMENTO

* Debe ser honesto
* Debe distinguir claramente entre “confirmado” y “probable”
* Debe citar rutas/archivos concretos
* Debe decir explícitamente cuando algo **no fue encontrado**
* Debe evitar suposiciones sin evidencia

## SALIDA EN TERMINAL

Además del markdown final, imprime al final un bloque breve con este formato exacto:

RESULTADO FINAL:

1. Direcciones/metodos de pago: ...
2. Campo imagen producto: ...
3. Update profile: ...
4. Sistema de estilos: ...
5. Flujo actual de imágenes: ...

## CRITERIO DE ÉXITO

La tarea solo se considera bien hecha si:

* respondes las 5 dudas con evidencia real
* no hiciste cambios
* dejas listo el terreno para que luego se redacte un prompt maestro definitivo sin ambigüedad
