Actúa como Senior Frontend Engineer (React + Vite + TailwindCSS).

CONTEXTO:
Proyecto ecommerce-app-Nars.
En la pantalla principal (Home), el bloque tipo "hero" donde aparece el texto:
"Colección Ramdi Jewelry"
NO está ocupando todo el ancho disponible.
Actualmente existe un espacio vacío del lado derecho (probablemente reservado para una imagen o columna que ya no se usa).

OBJETIVO:
Lograr que el bloque de texto se expanda correctamente y utilice TODO el ancho disponible del contenedor, manteniendo diseño limpio y responsive.

IMPORTANTE:
- NO romper estilos existentes
- NO afectar otros componentes
- NO eliminar clases sin entender su impacto
- Aplicar cambios mínimos y controlados

FASE 1 — DIAGNÓSTICO (OBLIGATORIO, NO MODIFICAR AÚN)
1. Localiza el componente del hero (Home, Landing, HeroSection o similar)
2. Identifica:
   - Si hay uso de grid (grid-cols-2, md:grid-cols-2)
   - Si hay flex con justify-between
   - Si existe un contenedor derecho vacío (imagen/avatar eliminado)
   - Si el texto tiene restricciones como:
     - max-w-*
     - w-1/2, w-2/3
     - col-span-1
3. Determina la causa EXACTA del espacio vacío

ENTREGABLE:
- Explicación clara del problema
- Código relevante detectado
- Conclusión técnica

NO AVANZAR SIN CONFIRMACIÓN.

---

FASE 2 — PLAN DE SOLUCIÓN (SIN IMPLEMENTAR)
Proponer la mejor solución entre:

OPCIÓN A:
Convertir layout a una sola columna (grid-cols-1)

OPCIÓN B:
Mantener grid pero hacer que el texto use:
- col-span-full
- grid-column: 1 / -1

OPCIÓN C:
Eliminar restricciones como max-w-2xl / max-w-3xl

El plan debe incluir:
- Qué archivo(s) se modificarán
- Qué clases exactas se cambiarán
- Impacto esperado
- Validación responsive (mobile/tablet/desktop)

ENTREGABLE:
Plan paso a paso listo para ejecutar

NO IMPLEMENTAR SIN AUTORIZACIÓN.

---

FASE 3 — IMPLEMENTACIÓN (SOLO TRAS APROBACIÓN)
1. Aplicar cambios mínimos necesarios
2. Mantener consistencia con Tailwind
3. No introducir nuevas dependencias

VALIDACIONES:
- El texto ahora ocupa todo el ancho disponible
- No hay espacios vacíos a la derecha
- No se rompió layout en mobile
- No afecta otros componentes

---

FASE 4 — EVIDENCIA (OBLIGATORIO)
Generar documento en:

docs/fixes/YYYY-MM-DD-HHMM-hero-width-fix.md

Debe incluir:
- Problema detectado
- Causa raíz
- Código antes/después
- Justificación técnica
- Resultados

IMPORTANTE:
INCLUIR SÍ O SÍ:
- Output completo de terminal
- Archivos modificados
- Evidencia de ejecución

---

REGLAS SSDLC:
- No hardcodear valores innecesarios
- Mantener escalabilidad
- Seguir buenas prácticas de UI/UX
- Código limpio y consistente

---

CRITERIO DE ÉXITO:
El hero debe verse como un bloque completo, sin huecos, aprovechando todo el ancho disponible y manteniendo diseño profesional.