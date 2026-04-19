Actúa como Senior Frontend Engineer + UX Engineer + QA.

CONTEXTO:
Proyecto ecommerce full-stack:
- Frontend: React (Vite)
- Backend: Node.js + Express + MongoDB
- Página: Perfil de usuario (`/profile`)

REQUERIMIENTO:
El campo "Avatar (URL)" ya NO debe mostrarse en la interfaz de usuario.

OBJETIVOS:
1. Evaluar si se puede ocultar el campo sin romper funcionalidad
2. Identificar riesgos técnicos o de datos
3. Aplicar el cambio de forma segura
4. Ajustar layout para redistribuir el espacio

IMPORTANTE:
NO ejecutar cambios directamente sin primero analizar.

---

FASE 1: AUDITORÍA

Revisar:

- `ecommerce-app-Nars/src/pages/ProfilePage.jsx`
- componentes relacionados con edición de perfil
- hooks/formularios usados (useState, react-hook-form, etc.)

Identificar:

1. ¿El campo avatar es obligatorio en backend?
2. ¿Se usa en algún otro lugar? (navbar, órdenes, etc.)
3. ¿Se valida en frontend o backend?
4. ¿Se envía en requests aunque esté vacío?
5. ¿Existe dependencia visual (ej: imagen de usuario)?

---

FASE 2: RESPONDER (ANTES DE CAMBIAR)

Responder claramente:

1. ¿Se puede ocultar el campo sin romper nada? (sí/no)
2. Riesgos detectados (si existen)
3. Impacto en:
   - frontend
   - backend
   - UX
4. ¿Se requiere ajuste backend o solo frontend?

NO avanzar sin dejar este diagnóstico.

---

FASE 3: IMPLEMENTACIÓN (CAMBIO MÍNIMO)

Si el diagnóstico es seguro:

1. Ocultar/eliminar campo:
   - label "Avatar (URL)"
   - input correspondiente

2. Asegurar:
   - no enviar `avatar` en payload si no es necesario
   - o enviar null/undefined de forma controlada

3. NO eliminar soporte backend
   (solo ocultar visualmente)

---

FASE 4: REDISTRIBUCIÓN DE LAYOUT

Ajustar UI:

- El espacio del avatar debe reutilizarse
- Mejorar distribución vertical
- Mantener alineación y spacing consistente

Validar:
- responsive
- no queden espacios vacíos
- no se rompa grid/flex layout

---

FASE 5: VALIDACIÓN

Probar:

- editar perfil
- guardar cambios
- recargar página
- verificar que:
   - no hay errores
   - datos siguen guardando correctamente

---

FASE 6: TESTS

- Ajustar tests si validaban el campo avatar
- NO eliminar cobertura innecesariamente

---

FASE 7: DOCUMENTACIÓN

Crear archivo:
docs/specs/[fecha]-hide-avatar-field-profile.md

Debe incluir:
- análisis de riesgos
- decisión
- cambios realizados
- evidencia de pruebas
- impacto en sistema

IMPORTANTE:
Incluir también lo que se imprima en terminal durante el proceso.

---

SALIDA ESPERADA:

1. Diagnóstico claro (sí/no + riesgos)
2. Implementación segura
3. UI limpia sin campo avatar
4. Layout ajustado correctamente
5. Evidencia funcional