Actúa como QA Lead + Full Stack Engineer senior.

CONTEXTO:
Proyecto full stack de ecommerce:
- Frontend: ecommerce-app-Nars
- Backend: ecommerce-api-Nars

OBJETIVO DE ESTA FASE:
Ejecutar una validación funcional tipo SMOKE TEST del sistema actual, SIN hacer cambios de código todavía, para confirmar si hoy el proyecto está estable antes de pasar a auditoría, limpieza documental, revisión vs rúbrica y despliegue.

ALCANCE:
Quiero validar de forma rápida pero seria los flujos esenciales del sistema, priorizando funcionamiento real de integración front + back.

REGLAS IMPORTANTES:
1. NO modificar código en esta fase, salvo que yo lo autorice después.
2. NO inventar resultados.
3. NO asumir que algo funciona si no fue verificado.
4. SI detectas bloqueos, documéntalos claramente.
5. TODO lo que salga en terminal debe integrarse SÍ O SÍ en el documento final.
6. El documento generado debe llevar fecha y hora en el nombre.
7. Si detectas que para probar algo faltan datos, indícalo explícitamente.
8. Esta fase es de diagnóstico y validación, no de corrección.

TAREAS:
1. Identifica cómo levantar correctamente backend y frontend.
2. Verifica estado base del proyecto:
   - instalación de dependencias
   - build
   - arranque de backend
   - arranque de frontend
   - conexión front-back
3. Ejecuta SMOKE TEST sobre estos puntos mínimos:
   - carga de Home
   - carga/listado de productos
   - búsqueda de productos (si aplica)
   - login
   - registro (si aplica)
   - agregar producto al carrito
   - ver carrito
   - checkout
   - creación de orden
   - consulta de órdenes del usuario
   - navegación básica de páginas principales
4. Revisa si existen errores visibles en:
   - navegador
   - consola
   - terminal
   - respuestas API
5. Si existen pruebas automatizadas rápidas para esta validación, indícalas y ejecútalas solo si aportan valor inmediato a esta fase.
6. Genera un diagnóstico claro separando:
   - OK funcional
   - hallazgos
   - bloqueos
   - riesgos para demo/presentación

ENTREGABLE OBLIGATORIO:
Genera un documento en una ruta consistente, por ejemplo:
docs/qa/YYYY-MM-DD-HHMM-smoke-test-funcional.md

El documento debe incluir:
1. Objetivo de la revisión
2. Alcance
3. Entorno validado
4. Comandos ejecutados
5. Output COMPLETO de terminal
6. Resultado por flujo probado
7. Evidencia de errores o hallazgos
8. Riesgos detectados
9. Conclusión ejecutiva:
   - listo para seguir a auditoría
   - listo con observaciones
   - no listo

FORMATO DE RESULTADO ESPERADO:
Quiero que primero me compartas:
A) resumen ejecutivo corto
B) tabla o lista de flujos validados
C) bloqueos encontrados
D) recomendación de siguiente paso

NO HAGAS CORRECCIONES TODAVÍA.
SOLO DIAGNOSTICA, VALIDA Y DOCUMENTA.