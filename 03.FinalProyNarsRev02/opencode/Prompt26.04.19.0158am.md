Actúa como Senior Backend + Frontend Engineer + DevOps + Security Reviewer.

CONTEXTO:
Proyecto full stack ecommerce:
- Backend: ecommerce-api-Nars
- Frontend: ecommerce-app-Nars

Estado:
- tests backend: PASS
- tests frontend: PASS
- Cypress: PASS
- repo limpio y documentado
- listo para deploy

OBJETIVO:
Ejecutar PASO 1 PRE-DEPLOY:
Hardening de variables de entorno + eliminación de configuraciones inseguras + preparación profesional para producción.

---

## 🔴 REGLAS CRÍTICAS

1. NO romper funcionalidad
2. NO modificar lógica de negocio
3. NO eliminar archivos sin justificar
4. NO exponer secretos
5. TODO cambio debe documentarse
6. TODO output de terminal debe documentarse
7. NO avanzar sin confirmación entre fases

---

## 📄 DOCUMENTACIÓN OBLIGATORIA (DESDE EL INICIO)

Crear documento desde el principio:

docs/release/YYYY-MM-DD-HHMM-env-hardening.md

IMPORTANTE:
- ir documentando paso a paso (NO al final)
- incluir decisiones, hallazgos y evidencia
- incluir TODO lo de terminal

---

## FASE 0 — PRE-CHECK

Ejecutar:
```bash
git status