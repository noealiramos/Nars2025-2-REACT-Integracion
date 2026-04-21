Actúa como Senior Full-Stack Engineer (React + Node + MongoDB) bajo enfoque SSDLC estricto.

CONTEXTO:
Proyecto ecommerce monorepo.
Módulo objetivo:
- Admin categorías
- URL: /admin/categories

YA EXISTE diagnóstico aprobado.
Conclusión del diagnóstico:
- El problema principal está en backend/modelo + datos persistidos.
- El frontend permite vacío visualmente, pero al guardar manda `undefined`.
- El modelo de categorías actualmente fuerza placeholder por default en `imageURL`.
- Hay categorías existentes con placeholder persistido, pero ESOS DATOS NO SE VAN A MIGRAR automáticamente en esta intervención.
- La limpieza de esos registros existentes se hará MANUALMENTE desde la aplicación después de corregir la lógica.

OBJETIVO:
Ejecutar únicamente la corrección lógica necesaria para que:
1. `imageURL` pueda quedar realmente vacío.
2. No se vuelva a forzar placeholder automáticamente.
3. Crear y editar categorías siga funcionando.
4. El sistema tolere categorías sin imagen.
5. NO se haga migración masiva ni script de limpieza de datos existentes.

REGLAS CRÍTICAS:
- Cambios mínimos y seguros
- No romper CRUD de categorías
- No romper backend
- No agregar nuevas funcionalidades
- No crear script de migración
- No limpiar automáticamente registros existentes
- Mantener el alcance solo a la lógica necesaria
- TODO lo mostrado en terminal debe incluirse SÍ o SÍ en el documento final
- El documento final debe llevar fecha y hora

----------------------------------------
ALCANCE DE IMPLEMENTACIÓN
----------------------------------------

1. FRONTEND
Ajustar el submit del formulario de categorías para que, cuando `imageURL` quede vacío, envíe una intención explícita de limpieza (`null` o `""`, según el contrato definido), y no `undefined`.

2. BACKEND CONTROLLER
Ajustar create/update para normalizar `imageURL` vacío de forma explícita y segura.
Si el usuario deja vacío el campo, debe persistirse como vacío real (`null` o equivalente acordado), no como placeholder.

3. MODELO CATEGORY
Eliminar la lógica de default placeholder en `imageURL` o dejar de forzarla, de modo que nuevas operaciones ya no generen `placehold.co`.

4. DATOS EXISTENTES
NO hacer migración.
NO hacer script de limpieza.
NO tocar masivamente categorías existentes.
Solo dejar la lógica lista para que el usuario limpie manualmente los registros desde la aplicación.

----------------------------------------
VALIDACIONES OBLIGATORIAS
----------------------------------------

Verificar y documentar:
- crear categoría nueva con `imageURL` vacío
- editar categoría existente y borrar `imageURL`
- guardar y recargar sin que reaparezca placeholder
- confirmar que una categoría con URL válida siga funcionando
- confirmar que no se rompió crear/editar
- confirmar si hubo o no impacto en tests/build

----------------------------------------
TESTS / VALIDACIÓN
----------------------------------------

Agregar o ajustar validaciones mínimas razonables si aplica.
Si no se crean tests nuevos, documentar validación manual clara.

----------------------------------------
FORMATO DEL DOCUMENTO FINAL
----------------------------------------

Generar documento con:
- fecha y hora
- resumen ejecutivo
- archivos modificados
- cambios realizados
- evidencia completa de terminal
- pruebas ejecutadas
- resultado de pruebas
- observaciones
- estado final

IMPORTANTE:
- incluir TODO el output relevante de terminal
- no omitir errores aunque luego se corrijan
- indicar claramente que NO se hizo migración de datos
- indicar claramente que la limpieza de placeholders existentes queda manual por decisión del usuario

EJECUTA AHORA.