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
- Regla clave: NO inventar nada, NO romper contratos API, NO hardcodear datos falsos, NO meter mocks para simular que ya funciona

## FORMA DE TRABAJO OBLIGATORIA
Quiero que trabajes en 3 fases obligatorias y NO saltes a implementar hasta terminar la fase 2:

### FASE 1 — AUDITORÍA / REVISIÓN
Revisa y audita el código actual para identificar:
1. qué partes del requerimiento YA existen,
2. qué partes existen parcialmente,
3. qué partes NO existen,
4. qué archivos/componentes/rutas están involucrados,
5. si algún ajuste requiere tocar backend además de frontend,
6. si hay riesgos de romper contratos existentes, Cypress, flujo de checkout, auth o CRUD admin.

### FASE 2 — PLAN DE AJUSTES
Antes de ejecutar cambios, genera un plan detallado y explícito en markdown.
El plan debe incluir:
- diagnóstico por requerimiento,
- causa raíz probable,
- archivos a modificar,
- estrategia técnica,
- riesgos,
- validaciones,
- impacto esperado,
- si requiere cambio de frontend, backend o ambos.

DETENTE al terminar esta fase.
NO apliques cambios todavía.
Primero deja el plan listo para revisión humana.

### FASE 3 — EJECUCIÓN
Sólo después de que el plan quede claro, procederías a implementar.
Cuando llegue esa fase, aplica cambios mínimos, limpios, compatibles con el proyecto y sin romper nada existente.

## DOCUMENTACIÓN OBLIGATORIA
Genera y mantén actualizado este archivo:
docs/specs/2026-04-16-ui-fixes-ecommerce.md

Dentro del documento quiero:
1. Resumen ejecutivo
2. Evidencia de auditoría
3. Mapeo requerimiento -> archivos afectados
4. Hallazgos
5. Plan de implementación
6. Riesgos y mitigaciones
7. Validaciones manuales
8. Validaciones Cypress
9. Resultado final

Además:
- documenta también comandos ejecutados,
- resultados relevantes de terminal,
- hallazgos reales,
- sin inventar evidencia.

## RESTRICCIONES / POLÍTICAS
Cumple todo esto sin excepción:
- No inventes comportamiento que no exista.
- No cambies contratos de API sin justificarlo claramente.
- No rompas endpoints existentes.
- No rompas compatibilidad con frontend actual.
- No elimines funcionalidad útil sin verificar impacto.
- No metas mocks/stubs para aparentar que funciona.
- No cambies naming ni arquitectura sin necesidad real.
- No hagas refactors amplios si no son indispensables para resolver estos requerimientos.
- Si detectas deuda técnica, repórtala, pero no la mezcles con el alcance sin separarla.
- Conserva la línea visual actual del proyecto.
- Para colores/estilos, usa los tonos y la identidad visual ya presentes en el proyecto; NO metas una nueva paleta ajena.
- Si algo no está claro en código, inspecciona antes de asumir.

## REQUERIMIENTOS A AUDITAR Y PLANEAR

### REQ 1 — Home / bloque descriptivo principal
Auditar la pantalla principal donde aparece el bloque con:
“Colección Ramdi Jewelry”
y el texto descriptivo.

Solicitud:
- extender el texto / distribución visual para que aproveche mejor todo el recuadro disponible,
- mantener coherencia con el diseño actual,
- resolverlo sin romper responsive.

Entregable de auditoría:
- identificar componente y estilos responsables,
- explicar si el problema es layout, width, flex/grid, padding, max-width o distribución del contenedor.

### REQ 2 — Login
Auditar la pantalla de login.

Solicitudes:
a) retirar el texto tipo ayuda/demo que indica usar usuario de prueba.
b) limpiar los campos de correo y contraseña para que SIEMPRE aparezcan vacíos al entrar a la pantalla.

Importante:
- antes de quitarlo, verifica si ese texto o valores precargados existen por motivos de demo/test/dev.
- si afectan pruebas automáticas, documentarlo y proponer el ajuste compatible.
- preferencia funcional confirmada: dejar ambos campos vacíos por defecto.

Valida además:
- que esta decisión no afecte rúbrica ni flujo normal de autenticación,
- que login siga funcionando correctamente.

### REQ 3 — Perfil de usuario
Auditar pantalla de profile.

Solicitudes:
a) manejar tonos azules obscuros, no blancos, para resaltar mejor letras blancas/grises, PERO usando los tonos ya existentes en el proyecto.
b) ajustar el texto descriptivo para que quede solamente:
“Consulta tu información y actualiza los datos.”
Eliminar el resto de la oración.

Validar:
- contraste visual,
- consistencia con el tema existente,
- que los inputs, labels y botones sigan siendo legibles,
- que no se rompa responsive.

### REQ 4 — Cálculo de IVA / consistencia aritmética
Auditar de forma seria la lógica de carrito, checkout y confirmación.

Hallazgo reportado:
- en carrito la suma parece correcta,
- en confirmación no se está calculando ni sumando correctamente el IVA.

Necesito que:
1. audites de dónde sale subtotal, IVA, envío y total en cada pantalla,
2. identifiques si el error es de frontend, backend o ambos,
3. detectes duplicidad de lógica o inconsistencia de fuentes de verdad,
4. propongas una sola estrategia coherente.

Reglas:
- no cambies fórmulas a ciegas,
- primero identifica la fuente correcta,
- si backend ya calcula totales oficiales, frontend debe respetarlos,
- si frontend recalcula, documenta por qué y dónde,
- no rompas contrato de órdenes/pagos/confirmación.

Muy importante:
- este punto sí puede implicar frontend + backend si el diagnóstico real lo exige.

### REQ 5 — Checkout / direcciones de envío
Auditar pantalla checkout en la parte de direcciones.

Solicitudes:
a) adicionar botón “Guardar” para guardar la información después de editarla,
b) adicionar botón “Cancelar” para descartar cambios y que no se reflejen,
c) al presionar “Eliminar”, mostrar primero confirmación simple con window.confirm:
   “¿Está seguro?, esta acción no podrá deshacerse?”
d) reducir el tamaño visual / ancho excesivo de los rectángulos o contenedores marcados.

Muy importante:
- primero audita si la lógica de guardado ya existe en backend y/o frontend,
- confirma qué ya está y qué falta,
- no inventes endpoints nuevos si ya existe soporte,
- si algo no existe, documenta exactamente qué faltaría.

Además:
- la interacción de editar debe ser clara,
- cancelar debe restaurar estado previo real,
- eliminar debe seguir funcionando pero con confirmación previa,
- mantener consistencia visual y responsive.

### REQ 6 — Admin productos / estabilidad del layout + imagen por producto
Auditar pantalla:
/admin/products

Situación reportada:
- la pantalla base está bien,
- pero al dar click en “Editar” los cuadros/contenedores se expanden o se mueven,
- se desea que permanezcan en la misma posición y forma que antes de editar,
- además se quiere mostrar la imagen del producto junto a cada producto existente.

Solicitudes:
1. corregir el layout para que editar no deforme ni expanda la composición,
2. mantener forma y posición estable,
3. mostrar la imagen del producto en cada tarjeta/listado de producto actual.

Datos confirmados:
- las imágenes ya existen en Cloudinary,
- por ahora no faltan imágenes.

Validar:
- que el listado siga siendo usable,
- que editar no rompa ancho/alto del panel,
- que las imágenes no destruyan el layout,
- que el render use la información real existente del producto.

### REQ 7 — Admin productos / ocultar texto que no aporta
En la misma pantalla de admin productos, auditar el texto auxiliar que aparece abajo del formulario (por ejemplo texto sobre URL manual/lista u otros mensajes auxiliares visibles que no aportan al usuario final).

Solicitud:
- ocultar o retirar de la pantalla ese texto que no aporta valor al usuario.

Regla:
- no elimines lógica útil de carga si todavía se necesita,
- sólo limpia la UI visible si realmente es texto accesorio,
- documenta si conviene ocultarlo condicionalmente en vez de borrarlo.

### REQ 8 — Admin categorías / guardar y cancelar en modo edición
Auditar pantalla:
admin/categories

Solicitud:
- cuando se active el estado de edición, deben aparecer botones:
  - Guardar
  - Cancelar
- ambos deben tener funcionalidad real.

Validaciones:
- guardar debe persistir cambios reales,
- cancelar debe revertir cambios no guardados,
- sólo deben aparecer al entrar en modo edición,
- no romper CRUD existente.

## REVISIÓN TÉCNICA OBLIGATORIA
Durante la auditoría revisa explícitamente:
- componentes React involucrados,
- hooks/estado local,
- servicios API usados,
- shape de datos de productos, categorías, direcciones y órdenes,
- posibles problemas de CSS, flex, grid, widths, min/max widths, overflow,
- consistencia de cálculo subtotal/iva/envío/total,
- compatibilidad con rutas actuales,
- impacto en admin y customer flows.

## VALIDACIONES OBLIGATORIAS
Cuando termines auditoría + plan, incluye checklist de validación para después ejecutar:

### Validación manual mínima
- Home se ve bien y el texto aprovecha el recuadro.
- Login entra con campos vacíos.
- Login sigue autenticando normal.
- Profile mantiene mejor contraste y texto ajustado.
- Carrito, checkout y confirmación muestran subtotal, IVA, envío y total coherentes.
- En checkout editar/guardar/cancelar/eliminar funcionan correctamente.
- window.confirm aparece antes de eliminar dirección.
- Admin productos no deforma layout al editar.
- Admin productos muestra imagen por producto.
- Admin productos ya no muestra texto innecesario.
- Admin categorías muestra Guardar/Cancelar al editar.
- Cancelar en categorías realmente revierte cambios.

### Cypress
Incluye propuesta de revisión/ajuste de Cypress para asegurar que no rompimos:
- login,
- navegación principal,
- carrito,
- checkout,
- confirmación,
- admin productos,
- admin categorías.

Si alguna prueba existente falla por cambios visuales o selectores, documenta:
- cuál falla,
- por qué,
- cómo ajustar sin debilitar la prueba.

## FORMA DE RESPUESTA ESPERADA EN ESTA PRIMERA EJECUCIÓN
En esta corrida NO quiero implementación todavía.
Quiero únicamente:

1. Auditoría detallada del estado actual
2. Confirmación de qué ya existe y qué no existe
3. Hallazgos técnicos
4. Riesgos
5. Plan de ajustes por requerimiento
6. Archivos exactos que tocarías
7. Validaciones propuestas
8. Todo documentado en:
   docs/specs/2026-04-16-ui-fixes-ecommerce.md

## CRITERIO DE CALIDAD
Tu trabajo debe ser:
- honesto,
- específico,
- verificable,
- sin suposiciones gratuitas,
- sin parches rápidos,
- sin humo.

Si detectas que un requerimiento está incompleto o ambiguo, no inventes: documéntalo como observación y propón la ruta más segura.

Inicia ya con la FASE 1 y FASE 2 solamente.
NO implementes aún.