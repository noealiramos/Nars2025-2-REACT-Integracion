Actúa como Senior Full-Stack Engineer (React + Node + MongoDB) bajo enfoque SSDLC estricto.

CONTEXTO:
Proyecto ecommerce monorepo.
Módulo objetivo:
- Frontend: Admin categorías
- URL: /admin/categories

YA EXISTE un diagnóstico y plan aprobado para paginación en Admin Categorías.
Conclusiones del diagnóstico:
- Backend YA soporta paginación en GET /api/categories
- NO tocar backend salvo hallazgo crítico real
- El problema está en frontend
- Riesgo principal: `parentOptions` no debe depender de la página visible
- Actualmente el hook/listado usa `limit=100`

OBJETIVO:
EJECUTAR la implementación de paginación para “Admin categorías” con cambios mínimos, seguros y controlados, SIN romper CRUD, estilos, navegación ni selector de categoría padre.

REGLAS CRÍTICAS:
- Priorizar cambios mínimos y aislados
- NO refactorizar de más
- NO tocar backend si no es indispensable
- NO romper:
  * crear categoría
  * editar categoría
  * eliminar categoría
  * selector de categoría padre
  * layout actual
- Mantener consistencia con patrones existentes del proyecto
- Documentar todo
- TODO lo que salga en terminal debe incluirse SÍ o SÍ en el documento final
- El documento final debe llevar fecha y hora visible
- Si aparece un riesgo nuevo, documentarlo claramente
- Si necesitas desviarte del plan, justificarlo antes en el documento final

----------------------------------------
ALCANCE DE IMPLEMENTACIÓN
----------------------------------------

1) LISTADO PAGINADO
Implementar paginación real para la lista visible de categorías usando el backend existente.

Usar parámetros como:
- page
- limit
- sort=name
- order=asc

Mostrar solo la página activa en el listado principal.

2) CONTROLES DE PAGINACIÓN
Agregar controles simples y seguros:
- Botón "Anterior"
- Texto "Página X de Y"
- Botón "Siguiente"

Reglas:
- "Anterior" deshabilitado si no hay página previa
- "Siguiente" deshabilitado si no hay página siguiente
- Mostrar controles solo si totalPages > 1
- No introducir selector de tamaño de página en esta fase

3) PARENT OPTIONS SEGURO
MUY IMPORTANTE:
El selector de categoría padre NO debe depender solo de la página visible.

Implementar una estrategia segura de menor riesgo, por ejemplo:
- Mantener una carga separada para opciones de categoría padre con dataset completo razonable
  o
- una query dedicada que preserve todas las opciones necesarias

La solución debe asegurar que:
- al crear categoría
- al editar categoría
- al cambiar de página

... el selector de categoría padre siga mostrando las opciones correctas.

4) EDGE CASES
Cubrir explícitamente:
- loading
- empty state
- última página
- primera página
- delete del último elemento visible en la página actual

Si después de borrar una categoría la página actual queda vacía y existe una anterior:
- ajustar automáticamente a la página previa

5) TESTS / VALIDACIÓN
Agregar al menos validación mínima razonable del módulo afectado.
Si no existe test del módulo:
- crear cobertura mínima enfocada en:
  * render de lista
  * paginación visible
  * navegación prev/next
  * comportamiento básico tras delete si aplica

Si no conviene crear test formal por alguna limitación técnica inmediata:
- documentar exactamente por qué
- ejecutar validación manual clara y reproducible

----------------------------------------
ESTRATEGIA DE CAMBIO RECOMENDADA
----------------------------------------

Aplicar cambios mínimos en:
- página AdminCategoriesPage
- hook useAdminCategories (solo si realmente conviene)
- estilos mínimos para paginación
- tests mínimos si aplica

Evitar cambios innecesarios en:
- backend
- contratos globales
- otros módulos

----------------------------------------
SECUENCIA DE TRABAJO OBLIGATORIA
----------------------------------------

1. Revisar archivos específicos a tocar
2. Implementar cambios mínimos
3. Ejecutar validaciones técnicas
4. Ejecutar pruebas razonables
5. Documentar resultado final

----------------------------------------
VALIDACIONES OBLIGATORIAS
----------------------------------------

Verifica y documenta:
- que el listado de categorías ahora pagine realmente
- que CRUD siga funcionando
- que el selector de categoría padre siga correcto
- que no se rompa el layout
- que los botones se deshabiliten correctamente
- que borrar en última página no deje vista rota
- si hubo o no impacto en tests existentes

----------------------------------------
FORMATO DEL DOCUMENTO FINAL (OBLIGATORIO)
----------------------------------------

Genera un documento final con:
- Fecha y hora (formato YYYY-MM-DD HH:mm)
- Resumen ejecutivo
- Archivos modificados
- Cambios realizados
- Evidencia de terminal COMPLETA
- Pruebas ejecutadas
- Resultado de pruebas
- Riesgos / observaciones
- Estado final:
  * OK
  * OK con observaciones
  * Pendiente

IMPORTANTE:
- Incluir TODO el output relevante de terminal
- No omitir errores aunque luego hayan sido corregidos
- No resumir de más la terminal: incluirla
- Indicar claramente si se tocó backend o no

----------------------------------------
CRITERIO DE ÉXITO
----------------------------------------

La tarea se considera exitosa solo si:
- Admin categorías pagina correctamente
- CRUD sigue operativo
- parentOptions no se rompe
- no hay regresiones visibles
- la documentación final queda completa con fecha/hora y terminal

EJECUTA AHORA.