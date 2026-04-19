PROMPT – FASE 3 ENV HARDENING

Actúa como Senior Full-Stack Engineer + Tech Lead + QA + Documentador SSDLC.

CONTEXTO

Se autoriza continuar con la implementación de:

FASE 3 – Centralización de configuración y endurecimiento de entorno

Con las siguientes restricciones obligatorias:

Mantener fallback controlado en frontend (NO eliminar completamente)
NO romper entorno de desarrollo actual
Priorizar .env.example como referencia base
Centralizar URLs sin duplicación (una sola fuente de verdad)
REGLAS CRÍTICAS (OBLIGATORIAS)
NO ejecutar cambios sin documentar
NO romper funcionalidades existentes
NO duplicar configuración
TODO debe quedar documentado
TODO output de terminal debe incluirse en el documento (SIN EXCEPCIÓN)
NOMBRE DEL DOCUMENTO (OBLIGATORIO)

Debes generar un archivo en:

/docs/bitacora/

Con el siguiente formato EXACTO:

YYYY-MM-DD_HH-MM_FASE3_ENV_HARDENING.md

Ejemplo:
2026-04-19_14-35_FASE3_ENV_HARDENING.md

ESTRUCTURA DEL DOCUMENTO (OBLIGATORIA)
1. Encabezado
Fecha y hora exacta de ejecución
Fase: FASE 3
Objetivo
2. Diagnóstico inicial
Estado actual del manejo de variables
Problemas detectados (duplicación, hardcode, inconsistencias)
3. Plan de implementación
Lista clara de pasos
Archivos a modificar
Justificación técnica
4. Cambios realizados (DETALLADO)

Por cada archivo:

Ruta completa
Antes / Después
Explicación clara del cambio
5. Output de Terminal (OBLIGATORIO)

Crear sección:

Output de Terminal

Y pegar TODO lo que arroje Antigravity en consola, por ejemplo:

npm install
npm run dev:test
errores
logs
warnings

Reglas:

SIN RESUMIR
SIN OMITIR
TEXTO COMPLETO
6. Validaciones realizadas
Backend levanta correctamente
Frontend consume variables correctamente
No hay hardcode de URLs
Cypress / pruebas siguen funcionando (si aplica)
7. Riesgos detectados
Qué podría romperse
Qué quedó pendiente
8. Resultado final
Estado del sistema después de FASE 3
Nivel de estabilidad
PROHIBICIONES
NO borrar fallback del frontend
NO hardcodear URLs
NO modificar lógica de negocio
NO omitir logs de terminal
EJECUCIÓN
Analiza el estado actual
Genera plan
Ejecuta cambios de forma segura
Documenta TODO en el archivo indicado
Incluye salida completa de terminal
ENTREGABLE FINAL
Archivo .md creado correctamente en /docs/bitacora/
Nombre con timestamp exacto
Documentación completa + terminal incluida
NOTA FINAL

Si detectas algo crítico que pueda romper el sistema:

DETENTE
Documenta
Solicita validación antes de continuar