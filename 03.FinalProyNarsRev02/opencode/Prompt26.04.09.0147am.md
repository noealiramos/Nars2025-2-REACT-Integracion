Entra en modo IMPLEMENTACIÓN CONTROLADA + NO ROMPER CONTRATOS + DOCUMENTACIÓN FINAL.

OBJETIVO:
Integrar carga real de imágenes de productos usando Cloudinary en el proyecto backend `ecommerce-api-Nars`, de forma compatible con el ecommerce actual, manteniendo la persistencia de URLs en MongoDB y sin romper el CRUD existente de productos.

UBICACIÓN DEL BACKEND:
D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\ecommerce-api-Nars

CONTEXTO IMPORTANTE:
- Ya existen en `.env` las variables:
  - CLOUDINARY_CLOUD_NAME
  - CLOUDINARY_API_KEY
  - CLOUDINARY_API_SECRET
- El proyecto usa Node.js + Express + MongoDB/Mongoose
- NO guardar imágenes binarias en MongoDB
- SOLO guardar URL(s) resultantes de Cloudinary
- Debe conservarse compatibilidad con el modelo/productos actual
- La implementación debe ser profesional pero incremental
- NO hagas big-bang refactor
- NO rompas rutas ni contratos ya funcionales
- NO elimines soporte de creación/edición por URL si ya existe; agrega soporte de upload real como mejora compatible

REGLAS ESTRICTAS:
1) Primero AUDITA la estructura real del backend antes de cambiar nada
2) Identifica:
   - modelo de Product
   - controller(s) de productos
   - rutas de productos
   - middlewares de auth/role
   - convención actual de manejo de errores
   - estructura de `src/`
3) Implementa de forma incremental y mínima
4) Si detectas diferencias con lo esperado, ADÁPTATE a la estructura real
5) Mantén compatibilidad hacia atrás:
   - si hoy `imagesUrl` acepta URLs manuales, eso debe seguir funcionando
6) La nueva subida debe devolver al frontend al menos:
   - `imageUrl`
   - y si es viable, `publicId`
7) Agrega validación de tipo de archivo
8) Agrega límite razonable de tamaño
9) Limpia archivos temporales si llegaran a crearse
10) No expongas secretos en código, logs, commits ni documentación
11) Al terminar, documenta TODO en un único markdown final

======================================================================
FASE 1. AUDITORÍA PREVIA
======================================================================

Antes de implementar:
- Revisa package.json
- Revisa estructura real del backend
- Localiza los archivos exactos a modificar o crear
- Confirma si el proyecto usa CommonJS o ES Modules
- Confirma cómo se registran rutas en Express
- Confirma el nombre real del campo de imágenes del producto:
  - `image`
  - `imageUrl`
  - `images`
  - `imagesUrl`
  - u otro

Muestra un PLAN BREVE y PRECISO con:
- Archivos a crear
- Archivos a modificar
- Impacto esperado
- Riesgo de ruptura
- Cómo se mantendrá compatibilidad hacia atrás

PERO NO TE DETENGAS AHÍ:
después del plan, ejecuta la implementación.

======================================================================
FASE 2. IMPLEMENTACIÓN BACKEND
======================================================================

Implementa lo necesario para soportar upload real a Cloudinary.

REQUERIMIENTOS TÉCNICOS:
A) Dependencias
- Instala solo si hacen falta:
  - cloudinary
  - multer
- Si ya existen, no reinstales innecesariamente

B) Configuración Cloudinary
Crea configuración reutilizable, por ejemplo en algo tipo:
- `src/config/cloudinary.js`
o la ubicación equivalente real del proyecto

Debe:
- leer de `process.env`
- validar presencia de variables necesarias
- exportar una instancia/config lista para usar
- no imprimir secretos

C) Middleware de upload
Implementa middleware para recibir imagen:
- usar `multer`
- restringir mime types razonables:
  - image/jpeg
  - image/jpg
  - image/png
  - image/webp
- tamaño máximo razonable (ej. 5MB o similar)
- manejar errores de archivo inválido con respuesta clara

D) Endpoint nuevo de upload
Crear endpoint nuevo, por ejemplo:
- `POST /api/upload`
o la ruta más consistente con la arquitectura real

Debe:
- requerir autenticación
- si la arquitectura ya tiene roles admin para alta de productos, protegerlo como admin
- recibir archivo en `multipart/form-data`
- subir a Cloudinary
- guardar en carpeta/namespace razonable, por ejemplo `products`
- retornar JSON consistente con algo como:
  {
    "message": "Imagen subida correctamente",
    "imageUrl": "...",
    "publicId": "..."
  }

E) Integración con productos
NO rompas la creación/edición actual.
Haz que el sistema permita:
- seguir recibiendo URLs manuales si ya existe ese comportamiento
- y además usar la URL retornada por `/api/upload`

Si corresponde, ajusta validaciones/controladores de productos para aceptar correctamente:
- una URL simple
- o arreglo de URLs
según el modelo real del proyecto

F) Manejo de errores
Integrar con el patrón real del proyecto:
- status codes correctos
- mensajes claros
- sin exponer stack traces innecesarias
- sin console.log innecesarios

G) Limpieza temporal
Si `multer` usa disco temporal:
- elimina archivo local después de subir a Cloudinary
Si usas memoria y luego stream/upload, mejor aún, siempre que sea consistente y seguro

======================================================================
FASE 3. COMPATIBILIDAD Y CALIDAD
======================================================================

Debes verificar explícitamente:
1) que no se rompió el CRUD de productos
2) que aún se pueden guardar URLs manuales, si ya era posible
3) que el nuevo endpoint funciona con imagen real
4) que las respuestas JSON sean coherentes con el frontend
5) que no haya secretos hardcodeados
6) que el backend siga arrancando correctamente

Si existe suite de tests backend:
- ejecuta los tests relevantes
Si no hay tests para esto:
- al menos ejecuta validación funcional real del servidor y documenta evidencia

======================================================================
FASE 4. PROPUESTA DE CONSUMO DESDE FRONTEND
======================================================================

SIN modificar aún el frontend salvo que sea estrictamente necesario, genera una PROPUESTA DE INTEGRACIÓN clara para `ecommerce-app-Nars`:

Explica brevemente cómo el frontend deberá trabajar:
1) seleccionar archivo
2) enviarlo a `/api/upload`
3) recibir `imageUrl`
4) usar `imageUrl` en create/update product

Incluye ejemplo de payload esperado para creación de producto según el campo real detectado:
- `imageUrl`
o
- `imagesUrl`

Si es útil, redacta un snippet de ejemplo de consumo con fetch o axios,
PERO solo como propuesta documentada si no toca backend.

======================================================================
FASE 5. DOCUMENTACIÓN FINAL OBLIGATORIA
======================================================================

Genera un único markdown final en:

docs/CLOUDINARY_INTEGRATION_YYYY-MM-DD-HHmm.md

Debe incluir EXACTAMENTE estas secciones:

# CLOUDINARY INTEGRATION

## 1. Objetivo
## 2. Estructura encontrada
## 3. Archivos creados
## 4. Archivos modificados
## 5. Decisiones técnicas tomadas
## 6. Compatibilidad hacia atrás preservada
## 7. Endpoint implementado
## 8. Validaciones y seguridad
## 9. Evidencia de prueba
## 10. Cómo consumirlo desde el frontend
## 11. Riesgos residuales
## 12. Siguiente paso exacto

En “Evidencia de prueba” incluye:
- comandos ejecutados
- resultados reales
- errores encontrados y cómo se resolvieron
- confirmación explícita de si el servidor arrancó o no
- confirmación explícita de si el endpoint quedó operativo o no

======================================================================
CRITERIO DE ÉXITO
======================================================================

Se considera exitoso solo si al final:
- existe integración real con Cloudinary en backend
- hay endpoint funcional de upload
- el proyecto sigue guardando URLs en MongoDB
- no se rompe el CRUD actual
- queda documentación final honesta
- queda claro el siguiente paso exacto para conectar el frontend

======================================================================
FORMA DE TRABAJO
======================================================================

Trabaja así:
1) audita
2) planea brevemente
3) implementa
4) valida
5) documenta

No te detengas a pedir confirmación.
No hagas cambios innecesarios.
No inventes estructura si no existe.
Adáptate al proyecto real.
Sé conservador con cambios, pero completa el objetivo.