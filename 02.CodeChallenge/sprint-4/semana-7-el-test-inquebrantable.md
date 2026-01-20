# Sprint 4 — Testing

## Semana 7 – El test inquebrantable

📌 Antes de empezar
- ¡Respira! Testing parece intimidante, pero es solo escribir instrucciones para un robot que prueba por ti. 🤖
- Orden recomendado: Concepto → Esquema → Pasos 1–6 → Recursos.
- Clave: los tests automatizan lo que harías manualmente (click, leer texto, verificar resultado).
- Consejo: trabaja en bloques pequeños (20–30 min), ejecuta tests frecuentemente para ver feedback. 🔍

🎯 Objetivo + Concepto (por qué + analogía)
- Objetivo: Escribir tests automatizados con **React Testing Library** que renderizan componentes, interactúan y verifican resultados. 🚀
- La metáfora del robot inspector:
  - Sin tests = pruebas manuales cada vez que cambias código (tedioso, lento, olvidable).
  - Con tests = robot que sigue instrucciones y prueba en milisegundos cada vez que guardas.
  - `render()` = el robot carga tu componente en memoria.
  - `screen.getByText()` = el robot busca texto en la página.
  - `fireEvent.click()` = el robot hace clic en un botón.
  - `expect()` = el robot verifica que algo sea verdad o falla y te avisa.
- Resultado: confianza para cambiar código sin romper funcionalidad. ✨

📋 Esquema de código (estructura incompleta)
- Plantilla con huecos para completar —sin soluciones completas—.

```jsx
// filepath: src/components/Saludo.jsx (estructura incompleta)
import { useState } from 'react';

export default function Saludo() {
  // Tarea: crea un estado mensaje con valor inicial "Hola Mundo"

  const cambiarMensaje = () => {
    // Tarea: cambia el mensaje a "Adiós"
  };

  return (
    <div>
      <h1>{/* muestra el mensaje */}</h1>
      <button onClick={cambiarMensaje}>Cambiar saludo</button>
    </div>
  );
}
```

```jsx
// filepath: src/components/Saludo.test.jsx (estructura incompleta)
import { render, screen, fireEvent } from '@testing-library/react';
import Saludo from './Saludo';

test('muestra el mensaje inicial', () => {
  // Tarea: renderiza el componente con render()
  // Tarea: busca el texto "Hola Mundo" con screen.getByText()
  // Tarea: verifica que está en el documento con expect().toBeInTheDocument()
});

test('cambia el mensaje al hacer clic en el botón', () => {
  // Tarea: renderiza el componente
  // Tarea: busca el botón con screen.getByText() o screen.getByRole()
  // Tarea: simula clic con fireEvent.click()
  // Tarea: verifica que ahora aparece "Adiós"
});
```

👇 Tu viaje — Pasos 1–6 (cada paso: concepto, tarea, verificación, tiempo)

Paso 1: Configura el entorno de testing
⏱️ Tiempo estimado: 15–20 min
Conceptos clave:
- Vitest/Jest = el corredor que ejecuta los tests.
- React Testing Library = herramientas para renderizar y buscar elementos.
Tarea:
- Instala dependencias: `npm install -D vitest @testing-library/react @testing-library/jest-dom`.
- Añade script en `package.json`: `"test": "vitest"`.
- Crea archivo `vitest.config.js` si es necesario (busca documentación oficial).
Verificación:
- Ejecuta `npm run test`. ¿El comando funciona aunque no tengas tests aún?
- Si da error, revisa la configuración de Vitest.
Pista:
- Si usas Vite, Vitest se integra fácilmente. Busca "vitest react setup" para guía rápida.

Paso 2: Crea el componente Saludo
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- Componente simple = perfecto para primer test.
Tarea:
- Crea `Saludo.jsx` con un estado `mensaje` (inicial: "Hola Mundo").
- Muestra el mensaje en un `<h1>`.
- Añade botón que cambie el mensaje a "Adiós" al hacer clic.
Verificación:
- Renderiza el componente en tu app. ¿Funciona manualmente?
- Al hacer clic, ¿cambia el texto?
Pista:
- Prueba primero manualmente antes de escribir tests. Asegúrate de que funcione.

Paso 3: Crea el archivo de test
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- Archivo `.test.jsx` = Vitest lo detecta automáticamente.
- Importaciones necesarias: render, screen, fireEvent, componente.
Tarea:
- Crea `Saludo.test.jsx` al lado de `Saludo.jsx`.
- Importa las herramientas de testing y tu componente.
- Crea un test vacío con `test('descripción', () => {})`.
Verificación:
- Ejecuta `npm run test`. ¿Vitest detecta tu archivo?
- ¿Sale el nombre del test aunque no tenga código?
Pista:
- Si no detecta el archivo, revisa que termine en `.test.jsx` o `.spec.jsx`.

Paso 4: Escribe el primer test (mensaje inicial)
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- `render()` = monta el componente en un DOM virtual.
- `screen.getByText()` = busca texto visible en la página.
- `expect().toBeInTheDocument()` = afirma que el elemento existe.
Tarea:
- Renderiza el componente con `render(<Saludo />)`.
- Busca "Hola Mundo" con `screen.getByText('Hola Mundo')`.
- Usa `expect(elemento).toBeInTheDocument()`.
Verificación:
- Ejecuta el test. ¿Pasa en verde (✓)?
- Cambia "Hola Mundo" a "Hola React" en el componente. ¿Falla el test (✗)?
Pista:
- Si falla con "not found", verifica el texto exacto. Es case-sensitive.

Paso 5: Escribe el segundo test (interacción)
⏱️ Tiempo estimado: 20 min
Conceptos clave:
- `fireEvent.click()` = simula un clic del usuario.
- Queries en orden: getByRole > getByLabelText > getByText.
Tarea:
- Renderiza el componente.
- Busca el botón con `screen.getByText('Cambiar saludo')`.
- Haz clic con `fireEvent.click(boton)`.
- Verifica que ahora aparece "Adiós" con `screen.getByText('Adiós')`.
Verificación:
- Ejecuta el test. ¿Pasa en verde?
- Comenta la línea del `fireEvent.click()`. ¿Falla el test porque no encuentra "Adiós"?
Pista:
- Si no encuentra el botón, usa `screen.getByRole('button', { name: /cambiar/i })`.

Paso 6: Experimenta rompiendo el test intencionalmente
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- Tests deben fallar cuando el comportamiento cambia (ese es su trabajo).
Tarea:
- Cambia el mensaje inicial del componente a "Hola React".
- Ejecuta los tests SIN modificarlos.
- Observa que el primer test falla.
- Actualiza el test para que refleje el nuevo comportamiento.
Verificación:
- ¿El test falló cuando cambiaste el componente?
- Después de actualizar el test, ¿vuelve a pasar?
Pista:
- Esto demuestra que los tests "vigilan" tu código y alertan cuando algo cambia.

🎓 Después de terminar (reflexión)
- Escribe 2–3 frases: ¿qué ventaja viste en tests automatizados vs probar manualmente?
- ¿Cómo te ayudarían los tests cuando trabajes en equipo?

🚀 Si quieres ir más allá (opcional)
- Añade un test para verificar que el botón existe en el documento.
- Usa `userEvent` en lugar de `fireEvent` (simula mejor el comportamiento real).
- Escribe tests para el componente del Presupuestador (agregar/eliminar gastos).
- Configura cobertura de tests (`vitest --coverage`) y apunta al 80%+.
- Añade tests de snapshot para verificar que el HTML no cambie inesperadamente.
- Practica TDD: escribe el test primero, luego el código que lo hace pasar.

📚 Recursos útiles
- React Testing Library docs (queries, firing events)
- Vitest docs (getting started, matchers)
- Testing Library: "Which query should I use?"
- Kent C. Dodds: Common mistakes with React Testing Library

✅ Entregable (lista)
- [ ] Vitest configurado con script `npm run test`.
- [ ] Componente `Saludo.jsx` con funcionalidad de cambio de mensaje.
- [ ] Archivo `Saludo.test.jsx` con al menos 2 tests.
- [ ] Test 1: verifica mensaje inicial.
- [ ] Test 2: simula clic y verifica cambio de mensaje.
- [ ] README explica cómo ejecutar los tests.

🎉 Celebración: si tus tests pasan en verde y fallan cuando rompes el código, ¡entendiste testing! 🤖✨
