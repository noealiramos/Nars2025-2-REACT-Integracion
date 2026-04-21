Lee las instrucciones y ejecuta en MODO CONTROLADO la siguiente fase: MP-02.

ANTES de implementar cualquier cambio:

ENTRA en modo PRE-IMPLEMENTACIÓN DETALLADA.

NO implementes nada todavía.

Necesito que me muestres exactamente qué vas a hacer para MP-02 con este nivel de detalle:

---

1) ARCHIVOS A MODIFICAR
- Lista completa de archivos
- Ruta absoluta
- Indicar si son:
  - nuevos
  - modificados
  - eliminados (si aplica)

---

2) IMPACTO EN CONTRATOS (CRÍTICO)
Analiza explícitamente si MP-02 afecta:

- auth
- cart
- checkout

Para cada uno:
- confirmar si hay cambios o no
- justificar técnicamente
- indicar riesgo de regresión (alto / medio / bajo)

---

3) PLAN DE IMPLEMENTACIÓN (PASO A PASO)
- Desglose en pasos pequeños (no big-bang)
- Orden exacto de ejecución
- Qué se valida después de cada paso

---

4) ESTRATEGIA DE TESTING
- Qué tests existentes podrían romperse
- Qué nuevos tests (si aplica)
- Nivel de aislamiento vs integración
- Riesgo de falsos positivos

---

5) RIESGOS TÉCNICOS
- posibles regresiones
- dependencias sensibles
- puntos de acoplamiento
- efectos secundarios ocultos

---

6) CRITERIOS DE VALIDACIÓN
Debes ejecutar al final de cada paso:

- npm test
- npm run build

Y confirmar:
- tests en verde
- build exitoso
- sin warnings críticos

---

7) SALIDA ESPERADA (IMPORTANTE)
NO implementes aún.

Entrega primero:
- el plan completo
- análisis técnico
- riesgos

Y DETENTE.

---

CUANDO TERMINES:

Genera automáticamente el siguiente prompt (MP-02-EXEC) para ejecutar la implementación,
siguiendo el mismo enfoque incremental y seguro.

NO avances hasta que ese siguiente prompt sea ejecutado.

---

REGLAS ESTRICTAS:

- NO modificar código de producción sin justificar impacto
- NO romper contratos existentes
- NO usar mocks innecesarios
- NO hacer cambios tipo "big-bang"
- TODO debe ser incremental y verificable

---

OBJETIVO:

Mantener estabilidad total del sistema mientras avanzamos en la rúbrica.

NOTAS IMPORTANTES:
-Documenta el resultado incluyendo lo que arrojes en la terminal en D:\MyDocuments\2025.Inadaptados\Nars2025-2-REACT-Integracion\03.FinalProyNarsRev02\docs\Resultado_Prompt26.04.03.1233pm.md.
-Imprescindible que todo lo que muestres en la terminal se incluya al final del achivo ya mencionado. 
