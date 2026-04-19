Actúa como Senior Backend + Frontend Engineer + DevOps + Security Reviewer.

CONTEXTO:
Proyecto full stack ecommerce:
- Backend: ecommerce-api-Nars
- Frontend: ecommerce-app-Nars

Estado actual:
- tests backend: PASS (163/163)
- tests frontend: PASS
- Cypress E2E: PASS (33/33)
- repo limpio y documentado
- listo para iniciar despliegue (Render + MongoDB Atlas)

OBJETIVO:
Ejecutar FASE 1 DE ENV HARDENING:
- eliminar URLs hardcodeadas
- asegurar uso correcto de variables de entorno
- preparar `.env.example`
- asegurar configuración lista para producción

---

## 🔴 REGLAS CRÍTICAS

1. NO romper funcionalidad
2. NO modificar lógica de negocio
3. NO eliminar archivos sin justificación
4. NO exponer secretos reales
5. TODO cambio debe documentarse
6. TODO output de terminal debe documentarse
7. NO avanzar sin confirmación entre fases

---

## 📄 DOCUMENTACIÓN OBLIGATORIA

Crear desde el inicio:

docs/release/YYYY-MM-DD-HHMM-env-hardening.md

Debe documentarse en tiempo real:
- hallazgos
- decisiones
- cambios
- evidencia de terminal

---

## FASE 0 — PRE-CHECK

Ejecutar:
```bash
git status