# Sprint 1 — Consumo de datos y efectos

## Semana 2 – Navegador de usuarios

📌 Antes de empezar
- ¡Respira! No necesitas entenderlo todo a la primera. Este documento es un mapa, no un examen. ✅
- Orden recomendado de lectura: Concepto → Esquema de código → Pasos 1–6 → Recursos.
- Consejo práctico: trabaja por bloques cortos (20–30 min), prueba y sigue. Si te atascas, toma 5 minutos y vuelve con la consola abierta. 🔍

🎯 Objetivo + Concepto (por qué + analogía)
- Objetivo: Aprender a "levantar el teléfono" a una API desde React, usar la "memoria del componente" y reaccionar a cambios con efectos. 🚀
- Analogías rápidas:
  - Router = el portero que decide a qué puerta vas.
  - `useParams` = la nota con el número de la puerta.
  - Estado = la "memoria del componente".
  - `fetch` = levantas el teléfono para pedir información.
  - Promesas = el "cupón del restaurante" que recibes cuando tu pedido está listo.

📋 Esquema de código (estructura incompleta)
- La idea es darte una plantilla con huecos para completar —sin soluciones completas—.

```jsx
// filepath: src/App.jsx (estructura mínima)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import UserDetail from './UserDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

```jsx
// filepath: src/UserDetail.jsx (estructura incompleta)
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null); // memoria del componente
  const [isLoading, setIsLoading] = useState(true); // indicador de espera

  useEffect(() => {
    // Tarea: aquí "levanta el teléfono" a
    // https://jsonplaceholder.typicode.com/users/{id}
    // Usa fetch (o async/await), actualiza `user` y `isLoading`.
  }, [id]);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{/* Muestra el nombre: user.name */}</h1>
    </div>
  );
}
```

👇 Tu viaje — Pasos 1–6 (cada paso contiene: concepto, tarea, verificación y tiempo)

Paso 1: Configura React Router
⏱️ Tiempo estimado: 10–15 min
Conceptos clave:
- El Router es el portero; Routes es el mapa que relaciona URL y componentes.
Tarea:
- Instala `react-router-dom` y envuelve la app con `<BrowserRouter>` en `App.jsx`.
Verificación:
- ¿Al abrir `/` ves tu Home sin recargar la página?
Pista:
- Si la URL cambia pero la página se recarga, revisa si usas `<a>` en lugar de `<Link>`.

Paso 2: Crea Home con enlaces
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- `<Link>` actualiza la URL sin hacer una recarga completa (comportamiento SPA).
Tarea:
- En `Home`, añade enlaces como `Link to="/user/1"` y `Link to="/user/2"`.
Verificación:
- Al hacer clic, ¿la URL cambia a `/user/1` y la app no recarga por completo?
Pista:
- Abre DevTools → Network; si ves una petición completa a la página, revisa tu Link.

Paso 3: Crea `UserDetail` y muestra el `id`
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- `useParams` lee el parámetro de la URL —es la nota con el número de la puerta.
Tarea:
- Muestra `id` temporalmente en un `<h1>` para verificar que llega.
Verificación:
- ¿Ves el id correcto según la URL? (ej: `/user/2` → ver "2")
Pista:
- Si `id` es `undefined`, confirma que la ruta en `App.jsx` es `/user/:id`.

Paso 4: Levanta el teléfono (fetch) usando `id`
⏱️ Tiempo estimado: 20–30 min
Conceptos clave:
- `fetch` = levantas el teléfono y esperas la respuesta; las promesas son el cupón.
Tarea:
- En `useEffect`, pide `https://jsonplaceholder.typicode.com/users/{id}` y guarda la respuesta en `user`.
Verificación:
- En DevTools → Network deberías ver la petición; en Console puedes usar `console.log(user)` para inspeccionar.
Pista:
- Si recibes 404, revisa el `id` que pasas en la URL y la ruta usada en la petición.

Paso 5: Añade `isLoading` (memoria de espera)
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- `isLoading` controla qué mostrar mientras esperas la respuesta.
Tarea:
- Inicializa `isLoading` en `true`; cuando la petición finalice, ponla en `false`.
Verificación:
- Al recargar la página, ¿ves "Cargando..." antes del nombre del usuario durante un instante?
Pista:
- Incluso si la respuesta es rápida, el estado inicial debe mostrar la carga.

Paso 6: Manejo básico de errores y limpieza
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- Capturar errores y limpiar efectos evita actualizaciones en componentes desmontados.
Tarea:
- Añade un manejo sencillo de errores y (opcional) una limpieza en `useEffect`.
Verificación:
- Simula una petición fallida (ej: desconectar la red) y observa el comportamiento en la UI y la consola.
Pista:
- DevTools → Console suele mostrar el error exacto si falta `.catch` o try/catch.

🎓 Después de terminar (reflexión)
- Escribe 2–3 frases en tu README: ¿qué aprendiste sobre la "memoria del componente" y los efectos?
- ¿Qué fallo curioso encontraste?

🚀 Si quieres ir más allá (opcional)
- Añadir botones "Anterior / Siguiente" para cambiar el `id` y reutilizar `UserDetail`.
- Mostrar más campos del usuario sin bloquear la UI.
- Implementar un spinner CSS en lugar de texto.

📚 Recursos útiles
- React Router docs (Routes, useParams)
- MDN: fetch API
- DevTools: pestañas Network y Console

✅ Entregable (lista)
- [ ] `App.jsx` usa `BrowserRouter` y declara `/` y `/user/:id`.
- [ ] `Home` contiene `Link` que cambian la URL sin recargar.
- [ ] `UserDetail` usa `useParams` para leer `id`.
- [ ] `UserDetail` hace la petición a la API y muestra el nombre.
- [ ] Mientras `isLoading` es `true`, se muestra un indicador de carga.

🎉 ¡Buen trabajo! Si ves el nombre después de "Cargando...", celebra ese pequeño triunfo ✨
