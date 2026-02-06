# Sprint 2 — Autenticación y contexto

## Semana 4 – Theme Switcher (Context)

📌 Antes de empezar
- ¡Respira! Context parece complejo al inicio, pero es más sencillo de lo que imaginas. 🎯
- Orden recomendado: Concepto → Esquema → Pasos 1–5 → Recursos.
- Clave: Context evita pasar props nivel por nivel (prop drilling). Es un atajo global.
- Consejo: trabaja en bloques pequeños (20–30 min), usa React DevTools para ver el Provider. 🔍

🎯 Objetivo + Concepto (por qué + analogía)
- Objetivo: Compartir estado global (tema claro/oscuro) sin pasar props por múltiples niveles usando **Context API**. 🚀
- La metáfora del sistema de altavoces:
  - Sin Context = pasar el mensaje persona por persona (prop drilling). Se distorsiona.
  - Con Context = sistema de altavoces: hablas una vez (Provider) y todos escuchan (useContext).
  - createContext = instalas el sistema.
  - Provider = el micrófono donde hablas.
  - useContext = los altavoces en cada componente que necesita escuchar.
- Resultado: componentes profundos acceden al tema sin props intermedios. ✨

📋 Esquema de código (estructura incompleta)
- Plantilla con huecos para completar —sin soluciones completas—.

```jsx
// filepath: src/contexts/ThemeContext.jsx (estructura incompleta)
import { createContext } from 'react';

// Tarea: crea el contexto y expórtalo
export const ThemeContext = createContext();

// Opcional: puedes crear un Provider personalizado aquí
// o usar directamente ThemeContext.Provider en App
```

```jsx
// filepath: src/App.jsx (estructura incompleta)
import { useState } from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import Layout from './Layout';

export default function App() {
  // Tarea: crea un estado theme con valores 'light' o 'dark'

  return (
    <ThemeContext.Provider value={{/* pasa theme y setTheme */}}>
      <Layout />
    </ThemeContext.Provider>
  );
}
```

```jsx
// filepath: src/components/BotonSwitch.jsx (estructura incompleta)
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export default function BotonSwitch() {
  // Tarea: usa useContext para obtener theme y setTheme

  const toggleTheme = () => {
    // Tarea: cambia entre 'light' y 'dark'
  };

  return (
    <button onClick={toggleTheme}>
      {/* Muestra el tema actual o un ícono */}
    </button>
  );
}
```

👇 Tu viaje — Pasos 1–5 (cada paso: concepto, tarea, verificación, tiempo)

Paso 1: Crea el contexto
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- `createContext()` = instalas el sistema de altavoces (todavía no hablas ni escuchas).
Tarea:
- Crea `ThemeContext.jsx` en una carpeta `contexts/`.
- Exporta el contexto creado con `createContext()`.
Verificación:
- Importa el contexto en `App.jsx`. ¿No da error de importación?
Pista:
- `export const ThemeContext = createContext();` es suficiente para empezar.

Paso 2: Crea el Provider en App
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- Provider = el micrófono. Lo que pones en `value` es lo que todos pueden escuchar.
Tarea:
- En `App.jsx`, crea un estado `theme` (inicializado en `'light'`).
- Envuelve tu app con `<ThemeContext.Provider value={{ theme, setTheme }}>`.
Verificación:
- Abre React DevTools → Components. ¿Ves el Provider en el árbol?
Pista:
- Si no ves cambios visuales aún, es normal: el Provider solo "habla", no escucha.

Paso 3: Crea jerarquía de componentes (sin prop drilling)
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- Jerarquía = App → Layout → Header → BotonSwitch (3+ niveles).
- Los componentes intermedios NO reciben props de tema.
Tarea:
- Crea `Layout.jsx`, `Header.jsx` y `BotonSwitch.jsx`.
- NO pases props de tema entre ellos.
Verificación:
- Revisa que Layout y Header no tengan props relacionados con theme.
Pista:
- Si algún componente intermedio necesita pasar props, estás haciendo prop drilling. Usa Context en el destino final.

Paso 4: Consume el contexto con useContext
⏱️ Tiempo estimado: 20 min
Conceptos clave:
- `useContext(ThemeContext)` = conectas un altavoz. Escuchas lo que dice el Provider.
Tarea:
- En `BotonSwitch.jsx`, usa `useContext(ThemeContext)` para obtener `theme` y `setTheme`.
- Crea un botón que cambie entre `'light'` y `'dark'`.
Verificación:
- Al hacer clic en el botón, usa `console.log(theme)`. ¿Cambia el valor en la consola?
Pista:
- Si `theme` es `undefined`, verifica que el Provider esté envolviendo el componente.

Paso 5: Aplica estilos según el tema
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- Cambia clases CSS o inline styles según `theme`.
Tarea:
- En `App.jsx` o `Layout.jsx`, aplica `className={theme}` o `style` dinámico.
- Define estilos CSS para `.light` y `.dark`.
Verificación:
- Al hacer clic en el botón, ¿cambia el color de fondo de la app?
Pista:
- Usa DevTools → Elements para ver si la clase cambia en el DOM.

🎓 Después de terminar (reflexión)
- Escribe 2–3 frases: ¿qué diferencia viste entre pasar props y usar Context?
- ¿En qué casos usarías Context vs props normales?

🚀 Si quieres ir más allá (opcional)
- Añade más temas (ej: 'auto' que detecta preferencia del sistema).
- Persiste el tema en localStorage para que se mantenga al recargar.
- Crea un custom hook `useTheme()` que encapsule `useContext(ThemeContext)`.
- Añade transiciones CSS suaves entre temas.

📚 Recursos útiles
- React docs: Context API
- React docs: useContext hook
- React DevTools: inspeccionar Providers
- MDN: window.matchMedia (para tema del sistema)

✅ Entregable (lista)
- [ ] `ThemeContext.jsx` exporta el contexto creado con `createContext()`.
- [ ] `App.jsx` tiene un Provider que envuelve la app con estado `theme`.
- [ ] Existe jerarquía de 3+ niveles sin prop drilling.
- [ ] `BotonSwitch` usa `useContext` para cambiar el tema.
- [ ] Los estilos de la app cambian según el tema actual.

🎉 Celebración: si el tema cambia sin pasar props intermedios, ¡dominaste Context! ✨
