*start:
Actúa como un Staff Engineer + Tech Lead + Refactoring Specialist experto en sistemas en producción con deuda técnica.

Tu misión NO es analizar, es EJECUTAR la normalización del sistema basándote en un diagnóstico ya existente.

IMPORTANTE:
- NO debes rehacer el sistema.
- NO debes romper funcionalidades existentes.
- NO debes cambiar contratos sin documentarlos.
- Debes trabajar incrementalmente y validar cada paso.
- Debes documentar TODO lo que modifiques.
- Debes dejar el sistema más estable que como lo encontraste.

---

## OBJETIVO DE ESTA EJECUCIÓN

Normalizar el sistema en 4 ejes:

1. Definir UNA sola fuente de verdad para el carrito → backend
2. Unificar el flujo de checkout
3. Alinear contratos frontend–backend
4. Consolidar documentación real

---

## FORMA DE TRABAJO

Debes ejecutar en FASES SECUENCIALES.

NO avances a la siguiente fase sin cerrar la anterior.

Cada fase debe incluir:
- Cambios realizados
- Archivos modificados
- Riesgos detectados
- Validación del sistema
- Documentación generada

---

# FASE 1 — Migración de carrito a backend (FUENTE DE VERDAD)

Objetivo:
Eliminar la duplicidad entre localStorage y backend.

Acciones:

1. Analiza cómo el frontend usa actualmente:
   - CartContext
   - localStorage (cart)
   - lógica de totales

2. Integra completamente el uso de:
   - `/api/cart`

3. Refactoriza el frontend para:
   - Obtener carrito desde backend
   - Persistir cambios vía API
   - Eliminar dependencia de localStorage (excepto fallback temporal si es necesario)

4. Si el backend requiere ajustes:
   - Hazlos mínimos
   - Documenta cualquier cambio de contrato

5. Maneja estados:
   - loading
   - error
   - empty cart

6. Garantiza:
   - el carrito persiste entre sesiones
   - funciona con usuario autenticado

Concéntrate SOLO en FASE 1, no avances a la siguiente.

En cuanto termines esta FASE 1, guarda avances en D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\docs\progress-phase-1.md
