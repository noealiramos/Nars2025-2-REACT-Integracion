# Sprint 4 — Testing

## Semana 8 – Simulador de fallos (mocks)

📌 Antes de empezar
- ¡Respira! Los mocks suenan complicados, pero son solo "dobles de acción" para tus funciones. 🎬
- Orden recomendado: Concepto → Esquema → Pasos 1–5 → Recursos.
- Clave: mockear = reemplazar temporalmente una función (como fetch) con una versión falsa controlada.
- Consejo: trabaja en bloques pequeños (20–30 min), prueba primero sin mock, luego añade el mock. 🔍

🎯 Objetivo + Concepto (por qué + analogía)
- Objetivo: Probar el manejo de errores usando **mocks** para simular fallos de API sin hacer peticiones reales. 🚀
- La metáfora del doble de acción:
  - Sin mocks = hacer peticiones reales en tests (lento, impredecible, depende de internet).
  - Con mocks = usar un "doble" que simula la respuesta instantáneamente.
  - `vi.spyOn(window, 'fetch')` = contratar al doble para reemplazar a fetch.
  - `mockRejectedValue()` = el doble simula un error específico.
  - `mockResolvedValue()` = el doble simula una respuesta exitosa.
  - Tests asincrónicos = esperas a que el componente reaccione al error/éxito.
- Resultado: tests rápidos, confiables e independientes de servicios externos. ✨

📋 Esquema de código (estructura incompleta)
- Plantilla con huecos para completar —sin soluciones completas—.

```jsx
// filepath: src/components/Pokedex.jsx (adaptado con manejo de errores)
import { useState, useEffect } from 'react';

export default function Pokedex() {
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/1')
      .then(res => res.json())
      .then(data => {
        setPokemon(data);
        setLoading(false);
      })
      .catch(err => {
        // Tarea: captura el error y actualiza el estado error
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>; // Muestra el error

  return <h1>{pokemon?.name}</h1>;
}
```

```jsx
// filepath: src/components/Pokedex.test.jsx (estructura incompleta)
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Pokedex from './Pokedex';

test('muestra mensaje de error cuando fetch falla', async () => {
  // Tarea: usa vi.spyOn para interceptar fetch
  // Tarea: mockea fetch para que rechace con un error
  const mockFetch = vi.spyOn(window, 'fetch').mockRejectedValue(
    new Error('Error de red')
  );

  // Tarea: renderiza el componente
  render(<Pokedex />);

  // Tarea: espera el mensaje de error con findByText (asíncrono)
  const errorMsg = await screen.findByText(/Error: Error de red/i);

  // Tarea: verifica que el mensaje está en el documento
  expect(errorMsg).toBeInTheDocument();

  // Limpieza: restaura fetch original
  mockFetch.mockRestore();
});

test('muestra el pokemon cuando fetch tiene éxito', async () => {
  // Tarea: mockea fetch para que resuelva con datos falsos
  const mockFetch = vi.spyOn(window, 'fetch').mockResolvedValue({
    json: async () => ({ name: 'pikachu' })
  });

  render(<Pokedex />);

  // Tarea: espera el nombre del pokemon
  const pokemonName = await screen.findByText(/pikachu/i);
  expect(pokemonName).toBeInTheDocument();

  mockFetch.mockRestore();
});
```

👇 Tu viaje — Pasos 1–5 (cada paso: concepto, tarea, verificación, tiempo)

Paso 1: Adapta el componente para manejar errores
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- `.catch()` = captura errores de fetch.
- Estado `error` = guarda el mensaje de error para mostrarlo en la UI.
Tarea:
- Añade estado `error` (inicialmente null).
- Añade `.catch()` al fetch que actualice `setError()` y `setLoading(false)`.
- Muestra mensaje condicional: si `error`, renderiza `<p>Error: {error}</p>`.
Verificación:
- Simula un error manualmente: cambia la URL a algo inválido. ¿Muestra el mensaje de error?
- Restaura la URL correcta. ¿Vuelve a funcionar?
Pista:
- Prueba manualmente antes de escribir tests. Asegúrate de que el componente maneja errores.

Paso 2: Crea el archivo de test y configura el mock
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- `vi.spyOn()` = intercepta una función existente sin romperla permanentemente.
- `mockRejectedValue()` = el mock simula un error (promesa rechazada).
Tarea:
- Crea `Pokedex.test.jsx`.
- Importa `vi` de Vitest: `import { vi } from 'vitest'`.
- Crea test vacío para familiarizarte con la sintaxis.
Verificación:
- Ejecuta `npm run test`. ¿Vitest detecta el archivo?
Pista:
- Si usas Jest, reemplaza `vi` con `jest`.

Paso 3: Mockea fetch para simular un error
⏱️ Tiempo estimado: 20 min
Conceptos clave:
- `vi.spyOn(window, 'fetch')` = intercepta fetch globalmente.
- `.mockRejectedValue(new Error('mensaje'))` = simula un rechazo.
Tarea:
- Dentro del test, añade: `vi.spyOn(window, 'fetch').mockRejectedValue(new Error('Error de red'))`.
- Renderiza el componente: `render(<Pokedex />)`.
Verificación:
- Ejecuta el test. Si no esperas asíncronamente, puede pasar o fallar erróneamente.
- Añade `console.log` en el componente dentro del `.catch()`. ¿Se ejecuta durante el test?
Pista:
- El mock reemplaza fetch SOLO durante ese test específico.

Paso 4: Espera el mensaje de error asíncronamente
⏱️ Tiempo estimado: 20 min
Conceptos clave:
- `findByText()` = busca y espera (asíncrono). Usa con `await`.
- `getByText()` = busca inmediatamente. Falla si no encuentra al instante.
Tarea:
- Usa `await screen.findByText(/Error: Error de red/i)`.
- Añade `expect(errorMsg).toBeInTheDocument()`.
- Restaura fetch al final: `mockFetch.mockRestore()`.
Verificación:
- Ejecuta el test. ¿Pasa en verde?
- Cambia el mensaje de error en el componente. ¿Falla el test?
Pista:
- Si el test falla con timeout, verifica que el componente actualice `error` correctamente.

Paso 5: Mockea fetch para simular éxito
⏱️ Tiempo estimado: 20 min
Conceptos clave:
- `mockResolvedValue()` = simula una promesa exitosa.
- Fetch devuelve un objeto con método `.json()`.
Tarea:
- Crea segundo test que mockee fetch exitoso.
- Usa `mockResolvedValue({ json: async () => ({ name: 'pikachu' }) })`.
- Espera el nombre del pokemon con `findByText(/pikachu/i)`.
Verificación:
- Ejecuta ambos tests. ¿Ambos pasan en verde?
- ¿Los mocks no interfieren entre sí? (gracias a `mockRestore()`).
Pista:
- Recuerda que fetch devuelve un objeto Response con método `.json()`, no los datos directamente.

🎓 Después de terminar (reflexión)
- Escribe 2–3 frases: ¿qué ventaja viste en mockear fetch vs hacer peticiones reales en tests?
- ¿Cómo te ayudan los mocks a probar casos extremos (errores, respuestas lentas)?

🚀 Si quieres ir más allá (opcional)
- Mockea una respuesta vacía (array vacío) y verifica que muestra "No hay datos".
- Simula un error de red específico (404, 500) y muestra mensajes personalizados.
- Usa `vi.useFakeTimers()` para probar timeouts o retrasos.
- Mockea `localStorage` para probar persistencia sin afectar el navegador real.
- Crea un mock de API completa con MSW (Mock Service Worker) para tests más realistas.
- Prueba el estado de loading: verifica que aparece "Cargando..." antes del resultado.

📚 Recursos útiles
- Vitest: Mocking (vi.spyOn, mockResolvedValue, mockRejectedValue)
- Testing Library: Async methods (findBy, waitFor)
- Jest: Mock Functions (si usas Jest)
- MSW: Mock Service Worker para mocks de API más avanzados

✅ Entregable (lista)
- [ ] Componente `Pokedex` adaptado con manejo de errores (catch, estado error).
- [ ] Archivo `Pokedex.test.jsx` con al menos 2 tests.
- [ ] Test 1: mockea fetch con error y verifica mensaje de error.
- [ ] Test 2: mockea fetch con éxito y verifica datos renderizados.
- [ ] Tests usan métodos asincrónicos (`findByText`, `await`).
- [ ] Mocks se restauran después de cada test (`mockRestore()`).

🎉 Celebración: si tus tests pasan simulando errores sin internet real, ¡dominaste mocking! 🎬✨
