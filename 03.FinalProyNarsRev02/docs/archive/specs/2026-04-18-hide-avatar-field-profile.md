# Hide avatar field in profile

## Analisis de riesgos

- Si se puede ocultar el campo `Avatar (URL)` sin romper el flujo principal.
- Riesgo tecnico: bajo.
- El backend mantiene soporte para `avatar`, pero no es obligatorio en `ecommerce-api-Nars/src/models/user.js`.
- En `ecommerce-api-Nars/src/controllers/userController.js`, `avatar` solo se actualiza si llega en el payload, asi que omitirlo desde el frontend no rompe la ruta.
- No se detecto una dependencia visual activa del avatar en la auditoria del frontend revisado para `/profile`.

## Decision

- Se aplica ajuste solo en frontend.
- Se oculta el input `Avatar (URL)` en `ProfilePage`.
- Se elimina su manejo del estado local, validacion y payload de actualizacion.
- No se toca soporte backend para mantener compatibilidad futura.

## Diagnostico tecnico previo

### Frontend

- `ecommerce-app-Nars/src/pages/ProfilePage.jsx` usaba `avatar` en:
  - `toProfileForm(...)`
  - `validateProfileForm(...)`
  - `hasChanges`
  - `handleSubmit`
  - el `TextInput` visual del formulario
- `ecommerce-app-Nars/src/pages/__tests__/ProfilePage.test.jsx` tenia pruebas y payloads que aun contemplaban `avatar`.

### Backend

- `ecommerce-api-Nars/src/models/user.js` define `avatar` como string opcional.
- `ecommerce-api-Nars/src/routes/userRoutes.js` valida `avatar` solo si viene presente.
- `ecommerce-api-Nars/src/controllers/userController.js` no exige `avatar`; solo lo escribe si existe en `req.body`.

## Cambios realizados

- `ecommerce-app-Nars/src/pages/ProfilePage.jsx`
  - se elimino `avatar` del estado del formulario;
  - se elimino la validacion local de URL de avatar;
  - se elimino la comparacion de cambios ligada a avatar;
  - se dejo de enviar `avatar` en `updateCurrentProfile(...)`;
  - se elimino el input visual `Avatar (URL)`.
- `ecommerce-app-Nars/src/pages/ProfilePage.css`
  - se agrego `align-items: start` a `profile-card__grid` para asegurar una distribucion limpia y sin huecos raros entre columnas.
- `ecommerce-app-Nars/src/pages/__tests__/ProfilePage.test.jsx`
  - se actualizaron expectations del payload;
  - se agrego cobertura para confirmar que el campo avatar ya no se renderiza.

## Impacto en el sistema

- Frontend: formulario mas simple y limpio; sin campo avatar visible.
- Backend: sin cambios requeridos.
- UX: menos ruido en la edicion de perfil y mejor continuidad visual del formulario.

## Evidencia de terminal

### Auditoria

```text
Found 16 matches
... ProfilePage.test.jsx:
  Line 35:       avatar: "https://example.com/avatar.jpg",
  Line 121:     await user.type(screen.getByTestId("input-profile-avatar"), "https://example.com/avatar.jpg");
... ProfilePage.jsx:
  Line 21:   avatar: profile?.avatar || "",
  Line 40:   if (form.avatar && !/^https?:\/\//i.test(form.avatar.trim())) return "El avatar debe ser una URL válida.";
  Line 197:             <TextInput id="profile-avatar" name="avatar" label="Avatar (URL)" value={form.avatar} onChange={handleFieldChange} placeholder="https://..." />
```

```text
Found 15 matches
... userController.js:
  Line 67:     const { displayName, phone, avatar } = req.body;
  Line 71:     if (typeof avatar !== 'undefined') update.avatar = avatar;
... userRoutes.js:
  Line 35:     body('avatar').optional().isURL().withMessage('avatar must be a valid URL'),
... user.js:
  Line 35:   avatar: {
```

### Pruebas

```text
> ramdi-jewelry-ecommerce-css@1.0.0 test
> vitest run src/pages/__tests__/ProfilePage.test.jsx

Test Files  1 passed (1)
Tests       6 passed (6)
```

```text
> ramdi-jewelry-ecommerce-css@1.0.0 build
> vite build

✓ built in 2.65s
```

## Resultado final

- La UI de `/profile` ya no muestra `Avatar (URL)`.
- Guardar perfil sigue funcionando con `displayName` y `phone`.
- El layout queda limpio y consistente tras remover el campo.
- No fue necesario cambiar backend.
