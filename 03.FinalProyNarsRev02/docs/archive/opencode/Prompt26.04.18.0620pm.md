Actúa como Senior Full-Stack Engineer (React + Node + MongoDB) bajo enfoque SSDLC estricto.

CONTEXTO:
Proyecto ecommerce monorepo.
Módulo objetivo:
- Frontend: Admin categorías
- URL: /admin/categories

PROBLEMA OBSERVADO:
En el formulario de categorías, el campo "Imagen (URL)" no puede quedar realmente vacío.
Aunque se intenta borrar manualmente, vuelve a aparecer una URL placeholder tipo `placehold.co` o se conserva el valor existente.
Además, actualmente NO existe un lugar útil donde se muestre la imagen de la categoría, por lo que por ahora necesito poder dejar ese campo limpio, en blanco, sin placeholder forzado.

OBJETIVO:
Realizar ÚNICAMENTE diagnóstico, revisión técnica, evaluación de riesgos y plan de corrección.
NO ejecutar cambios todavía.

----------------------------------------
REGLAS CRÍTICAS
----------------------------------------
- NO modificar código
- NO ejecutar cambios
- NO asumir que el problema está solo en frontend
- Revisar frontend y backend
- Identificar exactamente en qué capa nace o se repone el placeholder
- Si existen varios puntos involucrados, documentarlos todos
- Incluir evidencia técnica suficiente
- TODO lo mostrado en terminal debe integrarse SÍ o SÍ en el documento final
- El documento final debe tener fecha y hora visibles

----------------------------------------
FASE 1: DIAGNÓSTICO TÉCNICO
----------------------------------------
Revisar de forma puntual:

1. FRONTEND
- Componente/página de Admin categorías
- Estado inicial del formulario
- Input "Imagen (URL)"
- Flujo de edición de categoría
- Flujo de creación de categoría
- `value` del input
- `handleChange`
- `handleEdit`
- `handleSubmit` / `saveCategory`
- Mappers o normalizadores de datos
- Hooks involucrados
- Si existe lógica como:
  - `|| placeholder`
  - `?? placeholder`
  - `.trim() || placeholder`
  - valores default del form

2. BACKEND
- Modelo/schema de categorías
- Controlador create/update
- Services si existen
- DTOs / validadores / normalizadores
- defaults en schema
- sanitización que convierta vacío en placeholder
- comportamiento si `imageUrl` llega como:
  - `""`
  - `null`
  - `undefined`

3. DATOS REALES / COMPORTAMIENTO
- Confirmar si el placeholder ya está guardado en BD
- Confirmar si el problema ocurre:
  - al editar
  - al guardar
  - al recargar
  - al crear nuevo
- Identificar si reaparece por render o por persistencia

----------------------------------------
FASE 2: EVALUACIÓN
----------------------------------------
Entregar conclusión clara sobre:
- causa raíz exacta
- capa afectada:
  - frontend
  - backend
  - ambas
- nivel de riesgo del ajuste
- si permitir vacío es seguro o no
- si el placeholder actual realmente aporta algo o solo estorba

----------------------------------------
FASE 3: PLAN DE CORRECCIÓN
----------------------------------------
Generar un plan mínimo, seguro y específico para que:
- el campo pueda quedarse vacío realmente
- no se reponga placeholder automáticamente
- no se rompa crear/editar
- si no hay imagen, el sistema lo tolere
- no se rompan categorías existentes
- no se rompan otros módulos

El plan debe indicar:
- archivos probables a modificar
- cambios concretos a realizar
- riesgos
- validaciones posteriores necesarias

----------------------------------------
FASE 4: CHECKLIST OBLIGATORIO
----------------------------------------
Responder explícitamente:
- ¿El placeholder nace en frontend?
- ¿El placeholder nace en backend?
- ¿Ya está persistido en BD?
- ¿Permitir vacío rompe algo?
- ¿Hay impacto en tests?
- ¿Hay impacto en otros módulos?
- ¿Recomiendas quitar el placeholder por completo o solo dejar de forzarlo?

----------------------------------------
FORMATO DE SALIDA OBLIGATORIO
----------------------------------------
Generar documento con:

- Fecha y hora (YYYY-MM-DD HH:mm)
- 1. Diagnóstico
- 2. Evidencia técnica
- 3. Causa raíz
- 4. Plan de corrección
- 5. Riesgos
- 6. Checklist final
- 7. Estado

IMPORTANTE:
- Incluir TODO lo que salga en terminal
- No omitir errores
- No generar código final todavía
- No ejecutar cambios hasta recibir aprobación expresa del usuario

AL FINAL, cerrar con:
`Plan listo. No se ejecutó ningún cambio.`