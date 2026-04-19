PROMPT – FASE 4 DESPLIEGUE CONTROLADO (BACKEND + FRONTEND)

Actúa como Senior Full-Stack Engineer + DevOps Engineer + QA Lead + Documentador SSDLC.

CONTEXTO

El proyecto ya cuenta con lo siguiente:

FASE 3 de endurecimiento de entorno completada
configuración centralizada
.env.example en backend y frontend
validación E2E real completada
limpieza total de Cypress completada
suite E2E limpia con allowCypressEnv: false
33/33 tests passing en corrida real
backend, frontend y Cypress ya validados localmente

Ahora se requiere ejecutar la:

FASE 4 – Preparación y despliegue controlado a servicios web

OBJETIVO

Preparar y/o ejecutar el despliegue del proyecto de forma segura y documentada, contemplando:

backend desplegable en servicio web
frontend desplegable en servicio web
variables de entorno correctas por entorno
conexión con base de datos remota
validación post-despliegue
no romper entorno local
no exponer secretos
dejar documentación completa de lo realizado
ALCANCE

Debes revisar, evaluar, planear y ejecutar únicamente lo necesario para dejar el proyecto listo para despliegue o desplegado, según lo que el repositorio y configuración permitan actualmente.

Considera como objetivo preferente:

Backend: Render
Frontend: Vercel o Netlify
Base de datos: MongoDB Atlas

Si detectas que aún faltan prerequisitos para desplegar, no improvises: documenta claramente qué falta, qué sí quedó listo y qué siguiente acción concreta se requiere.

REGLAS CRÍTICAS
NO romper el entorno local actual
NO exponer secretos reales en código, docs o commits
NO inventar variables de entorno
NO asumir valores que no existan en .env.example o en la configuración real del proyecto
NO modificar lógica de negocio salvo que sea estrictamente necesario para despliegue
NO declarar éxito de despliegue sin validación real
TODO debe quedar documentado
TODO output de terminal debe quedar incluido completo
si una acción requiere credenciales, accesos o decisiones del usuario, DETENTE y documenta exactamente qué hace falta
ENFOQUE DE TRABAJO

Trabaja en este orden:

Diagnóstico de readiness para deploy
Plan de despliegue
Ajustes mínimos necesarios
Preparación de variables por entorno
Configuración de build/start
Despliegue o preparación exacta para despliegue
Validación post-deploy
Documentación completa
DOCUMENTACIÓN OBLIGATORIA

Genera un archivo en:

/docs/bitacora/

Con nombre EXACTO:

YYYY-MM-DD_HH-MM_FASE4_DEPLOY.md

Ejemplo:
2026-04-19_15-10_FASE4_DEPLOY.md

ESTRUCTURA OBLIGATORIA DEL DOCUMENTO
1. Encabezado
Fecha y hora exacta
Fase: FASE 4 – Deploy
Objetivo
2. Diagnóstico inicial
estado actual del backend para deploy
estado actual del frontend para deploy
estado actual de variables de entorno
estado actual de scripts de build/start
estado actual de conexión a base de datos
riesgos iniciales detectados
3. Estrategia de despliegue
plataforma objetivo para backend
plataforma objetivo para frontend
estrategia para variables de entorno
estrategia para validación
justificación técnica
4. Cambios aplicados

Por cada archivo modificado:

ruta completa
antes / después
motivo
riesgo
5. Variables de entorno requeridas

Separar claramente:

Backend
variables obligatorias
variables opcionales
variables de pruebas
cuáles NO deben subirse al repo
Frontend
variables obligatorias
variables opcionales
cuáles NO deben subirse al repo
6. Output de Terminal

Crear sección:

Output de Terminal

Y pegar TODO el output completo de:

inspecciones
build
validaciones
despliegue
errores
warnings
reruns
pruebas post deploy

SIN RESUMIR
SIN OMITIR
TEXTO COMPLETO

7. Validación post-despliegue
backend responde o no
frontend responde o no
conectividad frontend-backend
catálogo carga o no
auth básica responde o no
health check responde o no
evidencia usada
8. Riesgos detectados
técnicos
de seguridad
de configuración
de disponibilidad
de costo / free tier / cold starts
9. Resultado final

Clasifica el estado final exactamente como uno de estos:

Deploy OK
Deploy OK con observaciones
Deploy NO OK
Ready for Deploy (si no fue posible desplegar por falta de accesos o secretos)
10. Siguientes pasos concretos
pasos exactos, accionables y ordenados
sin generalidades
indicar qué depende del usuario
REVISIÓN TÉCNICA OBLIGATORIA

Revisa y valida al menos lo siguiente:

Backend
package.json
script de arranque de producción
uso correcto de PORT
conexión Mongo remota compatible con Atlas
CORS para frontend desplegado
PUBLIC_API_URL o equivalente
health check
Swagger si aplica
variables necesarias para JWT, DB y servicios externos
Frontend
package.json
script de build
uso de VITE_API_URL
compatibilidad con dominio backend desplegado
rutas y consumo API
comportamiento en producción
Infra / Deploy
si existe archivo o configuración específica de plataforma
si hacen falta ajustes de build/start
si el proyecto requiere archivos tipo render.yaml, configuración manual o documentación adicional
EJECUCIÓN ESPERADA

Haz lo siguiente:

diagnostica readiness real de deploy
identifica gaps exactos
corrige solo lo mínimo necesario
deja claras las variables de entorno por plataforma
ejecuta build/validaciones necesarias
si es posible desplegar, despliega y valida
si no es posible desplegar por accesos/secretos, deja el proyecto listo para deploy y documenta exactamente qué falta
CRITERIOS DE ÉXITO

Solo se considera éxito si ocurre uno de estos casos:

Caso A – Deploy completo
backend desplegado y respondiendo
frontend desplegado y respondiendo
frontend conectado al backend real
validación mínima post deploy exitosa
Caso B – Ready for Deploy real
proyecto preparado sin huecos importantes
variables identificadas correctamente
scripts validados
plataforma objetivo definida
pasos exactos listos para ejecutar por el usuario
sin secretos expuestos
PROHIBICIONES
NO publicar secretos
NO hardcodear URLs productivas en archivos de desarrollo
NO romper local para favorecer deploy
NO eliminar fallback/local config útil sin justificación
NO declarar deploy exitoso solo porque build pasó
NO hacer cambios cosméticos únicamente
NO saltarte la validación post deploy si el despliegue se ejecuta
NOTA FINAL

Prioriza este orden:

seguridad
estabilidad
claridad de configuración
validación real
comodidad operativa

Si necesitas detenerte por falta de credenciales, secretos o acceso a plataforma, hazlo de forma controlada y deja el repositorio/documentación en estado Ready for Deploy con instrucciones exactas para continuar.