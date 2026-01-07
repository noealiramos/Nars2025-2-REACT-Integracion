# Sprint 1 — Consumo de datos y efectos

## Semana 1 – La Pokedex Minimalista
### 📌 Antes de empezar

**¡Respira!** Este documento tiene mucha información, pero no necesitas comprenderla toda de golpe. Es como recibir un mapa: primero harás un viaje pequeño (el Paso 1), luego entenderás mejor el resto.

**Cómo usar este documento:**
1. Lee el "Concepto" (analogía de la pizza)
2. Completa los **Pasos 1-6** en orden (son tu viaje principal)
3. Usa "Recursos y referencias" cuando necesites profundizar en algo específico
4. Las "Preguntas de reflexión" vienen al final, cuando ya hayas terminado

No necesitas memorizar todo ahora. Tu cerebro aprende mejor *haciendo*.

---
### Objetivo

Comprender cómo se cargan datos de una API en React utilizando `fetch`, `useState` y `useEffect` para gestionar peticiones asincrónicas y el estado del componente.

### El concepto — El pedido a domicilio

Imagina que haces un pedido de pizza a domicilio. Llamas a la pizzería (haces la petición), cuelgas el teléfono y sigues con tu vida; no esperas congelado en la puerta. Cuando el repartidor llega, abres la puerta y sirves la pizza en la mesa. Así funciona `fetch`: hace la petición y continúa el resto del código hasta que llegan los datos. `useEffect` es la manera de decirle a React: “haz el pedido cuando montes este componente” para no repetir la llamada en cada renderizado.

### Esquema de código (estructura de referencia)

⚠️ **Léelo cuando empieces el Paso 1.** Este es tu mapa: muestra cómo se vería el componente terminado, pero con espacios vacíos que TÚ debes llenar mientras haces los pasos.

Aquí está la estructura general que debes construir. **Los comentarios te indican qué ir llenando, pero el código no está completo:**

```jsx
// 1. Importa los hooks que necesitas
import { ___________, ___________ } from 'react';

const Pokedex = () => {
  // 2. Define el estado para guardar los Pokémon
  // Pregúntate: ¿Qué valor inicial necesita?
  const [________, setPokemons] = useState(___________);

  // 3. Define el efecto que se ejecuta UNA VEZ al montar
  // ¿Por qué el array de dependencias está vacío?
  useEffect(() => {
    // 4. Llama a fetch con la URL correcta
    fetch('https://pokeapi.co/api/v2/pokemon?limit=__')
      // 5. Primer .then(): recibe response y convierte a JSON
      .then(__________ => __________.json())
      // 6. Segundo .then(): recibe data y actualiza el estado
      .then(data => {
        console.log(data); // Observa la estructura
        // Extrae data._______ y actualiza el estado
      });
  }, []);

  // 7. En el return, renderiza una lista <ul>
  // 8. Usa .map() para transformar cada pokemon en <li>
  // 9. Recuerda el atributo 'key' y qué mostrar de cada pokemon
  return (
    <div>
      {/* Tu lista aquí */}
    </div>
  );
};

export default Pokedex;
```

**Notas importantes:**
- Los espacios `_________` son para que **TÚ llenes** con el código correcto.
- El `console.log(data)` te ayuda a entender la estructura de la API.
- No copies este código; úsalo como referencia de la estructura que necesitas.

### El flujo (teoría del qué sucede)

Mientras haces los pasos, tu componente hará esto. Por ahora solo léelo para tener contexto; lo entenderás mejor cuando practiques:

1. Al montar, ejecuta el efecto.
2. El efecto hace `fetch` a la API de Pokémon.
3. La respuesta se convierte a JSON (formato legible).
4. De los datos recibidos, extraes la propiedad que contiene la lista de Pokémon.
5. Guardas esos datos en el estado.
6. React detecta el cambio y vuelve a renderizar.
7. El componente ahora muestra una lista con los nombres de los Pokémon.

**Piensa en esto:**
- ¿En qué orden ocurren estos pasos?
- ¿Cuál es el primer renderizado que ve el usuario? ¿Está vacío o con datos?
- ¿Cuándo aparecen los datos en pantalla?

## 👇 Tu viaje: Guía paso a paso

**Desde aquí, sigue los Pasos 1-6 en orden.** Cada uno construye sobre el anterior. No saltes pasos.

---

## Guía de construcción paso a paso

### Paso 1: Crea el componente y su estado

**Conceptos clave que usarás aquí:**
- **Estado en React**: Es la "memoria" del componente. Cuando cambias el estado, React automáticamente vuelve a renderizar la pantalla.
- **`useState`**: Es el hook que te da esa memoria. Devuelve dos cosas: el valor actual del estado y una función para cambiarlo.

**⏱️ Tiempo estimado: 10 minutos**

**Tu tarea:**

1. Crea un archivo llamado `Pokedex.jsx` en la carpeta `components/`.
2. Importa `useState` desde React:
   ```jsx
   import { useState } from 'react';
   ```
3. Define un componente funcional llamado `Pokedex`.
4. Dentro, crea un estado para guardar la lista de Pokémon. **Pregúntate**:
   - ¿Qué valor inicial tiene sentido? (¿Una lista vacía? ¿Un objeto? ¿null?)
   - ¿Qué nombres descriptivos le darías a la variable de estado y su actualizador?

**✅ Verifica que funcionó:**
- Abre la consola del navegador (F12 → Console)
- Mira si tu `console.log()` imprime el valor inicial que esperabas
- Si ves `[]`, ¡vas bien!

**Si algo no funciona:** Lee el error de la consola. Generalmente te dice exactamente qué está mal.

---

### Paso 2: Usa `useEffect` para ejecutar código al inicio

**Conceptos clave que usarás aquí:**
- **Efectos secundarios**: Son cosas que pasan "fuera" de React (como pedir datos a un servidor). Los ponemos en `useEffect` para que no sucedan cada vez que se renderiza.
- **`useEffect`**: Es el hook que dice "ejecuta este código en este momento específico". Con `[]` vacío significa "solo una vez, cuando el componente aparece en pantalla".
- **Array de dependencias `[]`**: Es lo que controla cuándo se ejecuta. Vacío = una sola vez. Lleno = cada vez que esos valores cambien.

**⏱️ Tiempo estimado: 10 minutos**

**Tu tarea:**

1. Importa `useEffect`:
   ```jsx
   import { useEffect } from 'react';
   ```
2. Crea un `useEffect` con un array de dependencias **vacío**.
3. Dentro, escribe un comentario explicando **por qué** usas un array vacío en este caso.
4. Por ahora, solo coloca `console.log('El componente se montó')` dentro.

**✅ Verifica que funcionó:**
- Abre la consola y recarga la página
- ¿El mensaje "El componente se montó" aparece **una sola vez**?
- Ahora, prueba quitando el `[]` del `useEffect`. ¿Qué ves? (¿Se repite infinitamente?) Eso es el problema que queremos evitar. Vuelve a poner el `[]`.

---

### Paso 3: Pide datos a la API (fetch)

**Conceptos clave que usarás aquí:**
- **Promesas**: Son como un cupón del restaurante. Entregas el cupón, esperas, y después recibes tu comida. Las promesas son así: pides algo, y recibimos el resultado después (asincronía).
- **`fetch`**: Es la función que "levanta el teléfono" a un servidor y pide datos. Devuelve una promesa.
- **`.then()`**: Es lo que haces cuando llega la respuesta. Primero recibes la comida (response), luego la desempaquetas (`.json()`), luego la comes (usas los datos).

**⏱️ Tiempo estimado: 15 minutos**

**Tu tarea:**

1. En tu `useEffect`, llama a `fetch()` con esta URL: `https://pokeapi.co/api/v2/pokemon?limit=10`
2. El resultado de `fetch` es una promesa. Encadena un primer `.then()` que:
   - Reciba la respuesta (parámetro `response`)
   - Convierta esa respuesta a JSON llamando a `response.json()` (que también devuelve una promesa)
   - Retorne esa promesa para encadenarla

3. Encadena un segundo `.then()` que:
   - Reciba los datos (parámetro `data`)
   - Imprime `console.log(data)` para ver su estructura
   - **No actualices el estado todavía**, solo explora los datos.

**✅ Verifica que funcionó:**
- Abre la consola y busca el `console.log(data)`
- Debería mostrar un objeto con propiedades. ¿Ves `results`?
- Expande `data.results` haciendo clic. ¿Ves la lista de Pokémon?
- **Tarea detective**: ¿Cuál es la propiedad de cada Pokémon que contiene su nombre? (Pista: mira dentro de cada objeto en la lista)

**Nota importante**: Si ves un error, probablemente es que la API no respondió. Espera unos segundos y recarga la página.

---

### Paso 4: Guarda los datos en el estado

**Conceptos clave que usarás aquí:**
- **Actualizar estado en una promesa**: Cuando la promesa se resuelva (cuando lleguen los datos), puedes llamar a `setPokemons()` dentro del `.then()`. React lo entenderá y actualizará la pantalla automáticamente.

**⏱️ Tiempo estimado: 10 minutos**

**Tu tarea:**

1. En tu segundo `.then()` (donde tienes `console.log(data)`):
   - En lugar de solo imprimir, **actualiza el estado** con la función que creaste en el Paso 1.
   - Debes extraer la propiedad correcta de `data` (la que exploraste en la consola).

2. Mantén el `console.log()` de verificación por ahora.

**✅ Verifica que funcionó:**
- Abre React DevTools (extensión de Chrome). Ve a Components.
- Busca tu componente `Pokedex`. ¿Ves el estado?
- Al principio, ¿está vacío? ¿Después de unos segundos, ¿se llena de datos?
- Si ves el cambio, ¡perfecto! Significa que los datos llegaron y se guardaron en el estado.

---

### Paso 5: Muestra los datos en pantalla

**Conceptos clave que usarás aquí:**
- **`.map()`**: Es un método que dice "para cada Pokémon en la lista, crea un `<li>` con su nombre". Transforma un array en elementos React.
- **`key` prop**: Es una etiqueta que React usa para identificar cada item. Debe ser única. Si no la pones, React se confunde.
- **Renderizado automático**: Cuando el estado cambia, React automáticamente muestra la nueva lista. Magia ✨

**⏱️ Tiempo estimado: 10 minutos**

**Tu tarea:**

1. En el `return` de tu componente, crea una lista (`<ul>`).
2. Usa `.map()` en tu array de estado para transformar cada Pokémon en un `<li>`.
3. Asegúrate de:
   - Agregar un `key` prop único para cada `<li>`.
   - Mostrar el nombre del Pokémon dentro del `<li>`.

**🔍 Pistas para pensar:**
- ¿Cuál propiedad de cada Pokémon es única? (Pista: probablemente el nombre, porque dos Pokémon no se llaman igual)
- ¿Cuál propiedad debería mostrar el usuario? (¿El nombre? ¿Un ID? ¿Ambos?)

**✅ Verifica que funcionó:**
- Recarga la app en el navegador
- Primero debería verse una lista vacía (porque el estado está vacío)
- Después de 1-2 segundos, ¿aparecen 10 nombres de Pokémon?
- En la consola, ¿hay advertencias amarillas? Si hay sobre `key`, arregla eso.
- Si todo funciona, ¡acabas de hacer tu primer fetch en React! 🎉

---

### Paso 6: Limpia y termina

**⏱️ Tiempo estimado: 5 minutos**

**Tu tarea:**

1. Elimina todos los `console.log()` que usaste para probar
2. Abre la consola y asegúrate que **no hay errores ni advertencias** (puede haber advertencias sobre otras cosas, eso está bien)
3. Exporta tu componente con `export default Pokedex;` al final
4. Usa el componente en tu `App.jsx` para verlo funcionando

---

## 🎓 Después de terminar: Reflexiona

### Preguntas de reflexión

Cuando termines el Paso 6, intenta responder estas preguntas con tus propias palabras (sin mirar el código). Escribir tus respuestas ayuda a que tu cerebro las recuerde mejor.

1. **Dependencias**: ¿Por qué `useEffect` tiene `[]` como dependencia? ¿Qué pasaría si fuera `[pokemons]` o no tuviera array?

2. **Asincronía**: ¿Por qué no colocamos `fetch` directamente en la función del componente, sin `useEffect`?

3. **Orden de ejecución**: ¿En qué orden ocurren estos eventos?
   - El componente se renderiza por primera vez
   - `fetch` comienza su petición
   - El servidor responde con datos
   - El estado se actualiza
   - El componente se renderiza nuevamente

4. **El `response.json()`**: ¿Por qué necesitamos llamar a `.json()` en la respuesta? ¿Qué devuelve?

5. **Keys en `.map()`**: Si usaras el índice del array (`index`) como `key` en lugar del nombre del Pokémon, ¿qué podría salir mal si luego ordenas o filtras la lista?

---

## 🚀 Si quieres ir más allá

### Desafío extra (opcional)

Si ya terminaste y quieres seguir aprendiendo, intenta esto:

- Agregar un parámetro `limit` que permita solicitar diferente cantidad de Pokémon desde el componente padre.
- Mostrar el número de Pokémon cargados junto a la lista.
- Agregar un mensaje de "Cargando..." mientras esperas la respuesta de la API.

**💡 Pista**: Necesitarás un estado adicional (boleano) que sea `true` mientras se cargan datos y `false` cuando llegan.

---

## 📚 Si necesitas ayuda o quieres profundizar

### Recursos y referencias

- [API de Pokémon - Documentación](https://pokeapi.co/docs/v2)
- [React Hooks - useState (Documentación oficial)](https://react.dev/reference/react/useState)
- [React Hooks - useEffect (Documentación oficial)](https://react.dev/reference/react/useEffect)
- [Promesas en JavaScript (MDN Web Docs)](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [fetch() - Guía completa (MDN Web Docs)](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)

**Uso recomendado**:
- Mientras haces los pasos, si algo no entiendes, busca en esta lista el concepto y lee la documentación oficial.
- React es bueno aprendiendo *haciendo*, no solo leyendo. Así que primero intenta, luego busca ayuda si necesitas.

---

## ✅ Entregable

Sube tu código como repositorio en tu propia cuenta de github. Tu solución debe incluir:

- Un archivo `Pokedex.jsx` con el componente funcional.
- Uso adecuado de `useState` y `useEffect`.
- La petición a la API de Pokémon y la renderización de los diez nombres.
- Respuestas a las preguntas de reflexión (en un comentario dentro del código o en un archivo `REFLEXIONES.md`).