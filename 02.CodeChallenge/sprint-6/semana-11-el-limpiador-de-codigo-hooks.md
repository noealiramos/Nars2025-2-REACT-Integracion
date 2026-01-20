# Sprint 6 — Hardening

## Semana 11 – El limpiador de código (custom hooks)

📌 Antes de empezar
- ¡Respira! Los custom hooks son simplemente funciones que empiezan con `use` y usan otros hooks. 🧹
- Orden recomendado: Concepto → Esquema → Pasos 1–5 → Recursos.
- Clave: extraer lógica repetitiva (fetch, estados, efectos) a funciones reutilizables.
- Consejo: empieza identificando código duplicado en varios componentes. 🔍

🎯 Objetivo + Concepto (por qué + analogía)
- Objetivo: Refactorizar componentes para extraer lógica repetitiva a **custom hooks**, logrando código más limpio y reutilizable. ♻️
- La metáfora del armario organizado (del caos a las cajas etiquetadas):
  - Componente "espagueti" = armario con ropa mezclada (invierno + verano + deportiva).
  - Custom hook = caja etiquetada "Ropa de invierno" (separas lo relacionado).
  - `useEffect` + `fetch` + `useState` = prendas que van juntas (lógica de datos).
  - Componente refactorizado = armario limpio (solo lo necesario para renderizar).
  - `const data = useFetch(url)` = abrir la caja cuando la necesitas.
  - Reutilización = usas la misma caja en diferentes componentes sin reescribir.
- Resultado: componentes de <10 líneas, lógica compartida en un solo lugar. ✨

📋 Esquema de código (estructura incompleta)
- Plantilla con huecos para completar —sin soluciones completas—.

```jsx
// filepath: src/hooks/useUser.js (custom hook)
import { useState, useEffect } from 'react';

export const useUser = (id) => {
  // Tarea: declara estados para user y loading
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tarea: implementa fetch para obtener usuario por id
    // URL: `https://jsonplaceholder.typicode.com/users/${id}`
    // Pasos:
    // 1. setLoading(true) al inicio
    // 2. fetch → .then(r => r.json())
    // 3. setUser(data)
    // 4. setLoading(false) al final
  }, [id]); // Tarea: ¿qué dependencia necesita el useEffect?

  // Tarea: ¿qué debe devolver el hook? { user, loading }
  return { user, loading };
};
```

```jsx
// filepath: src/components/UserDetail.jsx (ANTES de refactorizar)
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!user) return null;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};
```

```jsx
// filepath: src/components/UserDetail.jsx (DESPUÉS de refactorizar)
import { useParams } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const UserDetail = () => {
  const { id } = useParams();
  // Tarea: llama al custom hook useUser con el id
  const { user, loading } = useUser(id);

  // Tarea: renderiza el estado de carga y los datos
  if (loading) return <div>Cargando...</div>;
  if (!user) return null;

  return (
    <div>
      <h1>{/* muestra user.name */}</h1>
      <p>{/* muestra user.email */}</p>
    </div>
  );
};
```

👇 Tu viaje — Pasos 1–5 (cada paso: concepto, tarea, verificación, tiempo)

Paso 1: Identifica lógica repetitiva en tu componente
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- Código candidato: `useEffect` con `fetch`, estados relacionados (`loading`, `data`, `error`).
- Si copias/pegas esta lógica en varios componentes, necesitas un hook.
Tarea:
- Abre tu componente `UserDetail` de la semana 2.
- Identifica: `useState` para `user` y `loading`, `useEffect` con `fetch`.
- Marca mentalmente: "esta lógica se puede extraer".
Verificación:
- ¿Tu componente tiene más de 15 líneas de lógica (sin contar JSX)?
- ¿Hay un `useEffect` con fetch que podrías reutilizar?
Pista:
- La lógica de fetch es casi idéntica en cualquier componente que carga datos.

Paso 2: Crea el archivo del custom hook
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- Custom hooks = funciones que empiezan con `use` (convención obligatoria).
- Pueden usar otros hooks (`useState`, `useEffect`, etc.).
- Se ubican en carpeta `src/hooks/` por convención.
Tarea:
- Crea carpeta `src/hooks/` si no existe.
- Crea archivo `useUser.js`.
- Copia la lógica de `useState`, `useEffect` y `fetch` desde tu componente.
- Convierte esa lógica en una función `useUser(id)` que devuelve `{ user, loading }`.
Verificación:
- ¿El hook recibe `id` como parámetro?
- ¿Devuelve un objeto con `user` y `loading`?
- ¿El `useEffect` tiene `[id]` como dependencia?
Pista:
- El hook debe ser independiente del componente (no usar `useParams` dentro).

Paso 3: Refactoriza el componente para usar el hook
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- Reemplaza lógica interna por una llamada al hook.
- El componente queda "tonto" (solo renderiza, sin lógica compleja).
Tarea:
- En `UserDetail.jsx`, elimina `useState`, `useEffect` y `fetch`.
- Importa: `import { useUser } from '../hooks/useUser'`.
- Llama: `const { user, loading } = useUser(id)`.
- Mantén el mismo JSX de antes.
Verificación:
- ¿El componente tiene menos de 10 líneas de lógica?
- ¿Sigue funcionando igual que antes?
Pista:
- Si falla, verifica que el hook devuelve correctamente `{ user, loading }`.

Paso 4: Prueba que el componente funciona igual
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- Refactorizar = cambiar estructura interna sin cambiar comportamiento.
- Debe verse idéntico para el usuario.
Tarea:
- Ejecuta `npm run dev`.
- Navega a `/users/1`, `/users/2`, etc.
- Verifica que muestra spinner mientras carga.
- Verifica que los datos aparecen correctamente.
Verificación:
- ¿El spinner aparece al inicio?
- ¿Los datos del usuario se muestran después?
- ¿Puedes cambiar de usuario sin errores?
Pista:
- Abre DevTools → Console. ¿Hay errores?

Paso 5: Reutiliza el hook en otro componente
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- El verdadero poder de custom hooks = reutilización.
- Mismo hook en múltiples componentes sin duplicar código.
Tarea:
- Crea un componente nuevo `UserCard.jsx`.
- Usa `useUser(1)` para obtener datos del primer usuario.
- Renderiza el nombre en una tarjeta simple.
Verificación:
- ¿El nuevo componente usa el mismo hook sin copiar código?
- ¿Funciona correctamente?
Pista:
- Acabas de evitar duplicar 10+ líneas de código. Esto escala.

🎓 Después de terminar (reflexión)
- Escribe 2–3 frases: ¿qué ventajas viste en extraer lógica a custom hooks?
- ¿En qué otros escenarios podrías usar custom hooks? (forms, localStorage, etc.)

🚀 Si quieres ir más allá (opcional)
- Añade manejo de errores al hook: devuelve `{ user, loading, error }`.
- Crea `useFetch(url)` genérico que funcione con cualquier endpoint.
- Implementa `useLocalStorage(key, initialValue)` para persistencia.
- Crea `useDebounce(value, delay)` para optimizar búsquedas.
- Implementa `useForm(initialValues)` para gestionar formularios.
- Añade tests unitarios para el custom hook (sin componentes).
- Crea `useWindowSize()` que devuelva `{ width, height }` en tiempo real.

📚 Recursos útiles
- React Docs: Building Your Own Hooks
- React Docs: Reusing Logic with Custom Hooks
- usehooks.com: Collection of useful React hooks
- Blog: When to Create Custom Hooks
- GitHub: react-use library (ejemplos de hooks avanzados)

✅ Entregable (lista)
- [ ] Carpeta `src/hooks/` con archivo `useUser.js`.
- [ ] Hook exporta función que recibe `id` y devuelve `{ user, loading }`.
- [ ] Componente `UserDetail` refactorizado con menos de 10 líneas de lógica.
- [ ] Aplicación funciona exactamente igual que antes.
- [ ] Opcional: hook reutilizado en al menos dos componentes diferentes.

🎉 Celebración: si tu componente pasó de 20+ líneas a <10 sin perder funcionalidad, ¡dominaste custom hooks! 🧹✨
