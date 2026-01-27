# Sprint 2 — Autenticación y contexto

## Semana 3 – El club secreto

📌 Antes de empezar
- ¡Respira! Este reto introduce localStorage, que es más sencillo de lo que parece. 🔐
- Orden recomendado: Concepto → Esquema → Pasos 1–5 → Recursos.
- Clave: localStorage es persistencia, no magia. Los datos quedan grabados en el navegador.
- Consejo: trabaja en bloques pequeños (20–30 min), prueba en DevTools → Application → Local Storage. 🔍

🎯 Objetivo + Concepto (por qué + analogía)
- Objetivo: Aprender a persistir datos con **localStorage** y manejar autenticación simple para mostrar contenido condicionalmente. 🚀
- La metáfora del sello invisible:
  - Estado React = memoria volátil (desaparece al recargar).
  - localStorage = el sello/tatuaje que te marcan en el club (persiste incluso si sales y regresas).
  - Input controlado = la nota que escribes con la contraseña.
  - Condicional (if/else) = el portero que decide si entras o no.
- Resultado: al recargar, el usuario sigue "adentro" si tiene el sello válido. ✨

📋 Esquema de código (estructura incompleta)
- La idea es darte una plantilla con huecos para completar —sin soluciones completas—.

```jsx
// filepath: src/Login.jsx (estructura incompleta)
import { useState } from 'react';

export default function Login() {
  // Tarea: crea dos estados:
  // - password: para guardar lo que escribe el usuario
  // - isAuth: para saber si tiene el sello (lee localStorage al iniciar)

  const handleLogin = () => {
    // Tarea: valida si la contraseña es correcta
    // Si lo es, guarda el sello en localStorage y actualiza isAuth
  };

  const handleLogout = () => {
    // Tarea: elimina el sello de localStorage y actualiza isAuth
  };

  if (isAuth) {
    return (
      <div>
        <h1>Bienvenido al club secreto ✨</h1>
        {/* Contenido especial aquí */}
        <button onClick={handleLogout}>Salir</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Acceso restringido</h2>
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => {/* actualiza el estado */}}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
```

👇 Tu viaje — Pasos 1–5 (cada paso: concepto, tarea, verificación, tiempo)

Paso 1: Crea el componente Login y el estado de la contraseña
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- Input controlado = un campo de texto cuyo valor está sincronizado con el estado.
Tarea:
- Crea `Login.jsx` con un estado `password` (string vacío al inicio).
- Crea un `<input type="password">` conectado a ese estado con `onChange`.
Verificación:
- Abre la consola (F12 → Console) y escribe en el input: ¿el estado cambia cada vez que escribes?
Pista:
- Usa `onChange={(e) => setPassword(e.target.value)}` para sincronizar.

Paso 2: Añade un estado de autenticación
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- isAuth = la "memoria" que dice si el usuario tiene el sello o no.
Tarea:
- Crea un estado `isAuth` que inicie en `false`.
- Usa una condicional: si `isAuth` es true, muestra un mensaje "Bienvenido"; si no, muestra el formulario.
Verificación:
- Al cambiar manualmente `setIsAuth(true)` en la consola, ¿se muestra el mensaje?
Pista:
- Puedes usar `if (isAuth) { return ... }` antes del `return` principal.

Paso 3: Valida la contraseña y guarda el sello
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- localStorage = el grabador que guarda el sello. Se persiste incluso después de recargar.
Tarea:
- En el botón "Entrar", compara `password` con una contraseña correcta (ej: "react123").
- Si coincide, usa `localStorage.setItem('clave', 'valor')` para guardar el sello.
- Actualiza `isAuth` a true.
Verificación:
- Abre DevTools → Application → Local Storage. ¿Ves la clave que guardaste?
- En la consola, escribe `localStorage.getItem('tu-clave')` y verifica que devuelve el valor. ✅
Pista:
- Si la contraseña no coincide, puedes mostrar un error simple (ej: `alert()`).

Paso 4: Lee el sello al montar el componente
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- Al cargar la página, necesitas verificar si el sello ya existe en localStorage.
Tarea:
- Initializa `isAuth` leyendo `localStorage` en lugar de `false` directo.
- Usa `localStorage.getItem('tu-clave') === 'valor'` para la comparación.
Verificación:
- Inicia sesión, recarga la página (F5). ¿Se mantiene el mensaje "Bienvenido" sin pedir contraseña?
Pista:
- Si `localStorage.getItem()` devuelve `null`, significa que no hay sello aún.

Paso 5: Añade un botón para cerrar sesión
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- `localStorage.removeItem()` = borra el sello cuando sales del club.
Tarea:
- Crea un botón "Cerrar sesión" que elimine el sello y actualice `isAuth` a false.
- Usa `localStorage.removeItem('tu-clave')`.
Verificación:
- Al hacer clic en "Cerrar sesión", ¿desaparece el sello en DevTools y vuelve el formulario?
- Recarga la página: ¿vuelve a pedir contraseña?
Pista:
- Si el usuario navega sin un sello válido, siempre debe pedir la contraseña.

🎓 Después de terminar (reflexión)
- Escribe 2–3 frases en tu README: ¿qué diferencia viste entre estado volátil y localStorage?
- ¿Qué pasó cuando recargaste sin el sello?

🚀 Si quieres ir más allá (opcional)
- Guarda el nombre del usuario en localStorage y muéstralo en el mensaje de bienvenida.
- Añade un campo de nombre de usuario y valida ambos (usuario + contraseña).
- Implementa un contador de intentos fallidos y bloquea después de 3 intentos.
- Guarda la hora de último acceso en localStorage.

📚 Recursos útiles
- MDN: localStorage API
- React: useState hook
- DevTools: pestaña Application para inspeccionar localStorage

✅ Entregable (lista)
- [ ] `Login.jsx` tiene un input controlado conectado a un estado `password`.
- [ ] Existe un estado `isAuth` que controla qué mostrar (formulario o bienvenida).
- [ ] La contraseña se valida y el sello se guarda en localStorage.
- [ ] Al montar, se lee localStorage para mantener la sesión después de recargar.
- [ ] Existe un botón "Cerrar sesión" que elimina el sello.

🎉 Celebración: si recargaste y la sesión se mantuvo, ¡demostraste que entiendes persistencia! ✨
