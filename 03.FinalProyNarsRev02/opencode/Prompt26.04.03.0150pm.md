Entra en modo PRE-IMPLEMENTACIÓN DETALLADA para MP-03.

NO implementes nada todavía.

Objetivo de MP-03:
Continuar con el hardening y estabilidad del flujo de usuario sin romper contratos existentes (auth, cart, checkout), priorizando robustez y cobertura.

REGLAS ESTRICTAS:

1) Enfoque incremental (NO big-bang)
2) No modificar backend
3) No romper contratos existentes
4) No usar mocks/stubs en E2E críticos
5) Mantener compatibilidad total con lo ya validado en MP-02
6) Generar SOLO UN archivo de documentación (NO duplicados)

---

NECESITO QUE DEFINAS:

## 1. Alcance exacto de MP-03
- qué se va a atacar
- qué NO se va a tocar (explícito)

## 2. Riesgos potenciales
- técnicos
- de regresión
- de contratos

## 3. Archivos a modificar o crear
- rutas completas
- indicar si son nuevos o existentes

## 4. Estrategia técnica
- qué problema resuelve cada cambio
- por qué es necesario
- qué pasaría si no se hace

## 5. Estrategia de validación
- tests unitarios (si aplica)
- E2E (qué escenarios EXACTOS)
- cómo se valida que no se rompe nada

## 6. Plan de ejecución paso a paso
- orden exacto de implementación
- checkpoints de validación

---

FORMATO DE RESPUESTA:

- claro
- estructurado
- sin código todavía
- sin ejecutar nada

---

AL TERMINAR:

Genera automáticamente el siguiente prompt:
👉 MP-03-EXEC

Ese prompt debe:

- ejecutar exactamente el plan definido
- validar en cada paso (test + E2E + build)
- generar UN SOLO archivo:

docs/Resultado_MP-03-YYYY-MM-DD-HHMM.md

El archivo debe incluir:

1) Resumen ejecutivo
2) Alcance
3) Archivos modificados
4) Implementación
5) Validación completa
6) Contratos
7) Riesgos
8) Evidencia REAL de terminal
9) Decisión final

---

IMPORTANTE:

NO avances a implementación.
DETENTE después de generar el plan + el prompt MP-03-EXEC.