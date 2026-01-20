# Sprint 3 — Formularios y lógica

## Semana 6 – El presupuestador (reduce)

📌 Antes de empezar
- ¡Respira! `reduce` parece intimidante al principio, pero es solo una calculadora que recorre un array. 💰
- Orden recomendado: Concepto → Esquema → Pasos 1–4 → Recursos.
- Clave: reduce "aplasta" un array en un solo valor. Acumulador + elemento actual = nuevo acumulador.
- Consejo: trabaja en bloques pequeños (20–30 min), usa console.log en el reduce para ver cada paso. 🔍

🎯 Objetivo + Concepto (por qué + analogía)
- Objetivo: Usar `reduce` para calcular totales de forma declarativa en un presupuesto con gastos dinámicos. 🚀
- La metáfora de la calculadora automática:
  - Array de gastos = lista de recibos apilados.
  - `reduce` = calculadora que recorre cada recibo sumándolo al total.
  - Acumulador (acc) = el subtotal que va creciendo.
  - Elemento actual (item) = el recibo que estás sumando ahora.
  - Valor inicial (0) = desde dónde empiezas a contar.
- Resultado: total actualizado automáticamente al agregar o eliminar gastos. ✨

📋 Esquema de código (estructura incompleta)
- Plantilla con huecos para completar —sin soluciones completas—.

```jsx
// filepath: src/components/Presupuestador.jsx (estructura incompleta)
import { useState } from 'react';

export default function Presupuestador() {
  // Tarea: crea tres estados:
  // - gastos: array vacío []
  // - concepto: string vacío ''
  // - monto: string vacío '' o número 0

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tarea: crea un objeto gasto con id único, concepto y monto
    // Agrégalo al array de gastos
    // Limpia los inputs
  };

  const eliminarGasto = (id) => {
    // Tarea: usa filter para crear un nuevo array sin el gasto con ese id
  };

  // Tarea: usa reduce para calcular el total
  const total = gastos.reduce((acc, gasto) => {
    // retorna acc + gasto.monto
  }, 0);

  return (
    <div>
      <h2>Presupuestador 💰</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Concepto"
          value={concepto}
          onChange={(e) => {/* actualiza concepto */}}
        />
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => {/* actualiza monto */}}
        />
        <button type="submit">Agregar gasto</button>
      </form>

      <h3>Lista de gastos:</h3>
      <ul>
        {gastos.map((gasto) => (
          <li key={gasto.id}>
            {gasto.concepto}: ${gasto.monto}
            <button onClick={() => eliminarGasto(gasto.id)}>X</button>
          </li>
        ))}
      </ul>

      <h3>Total: ${total}</h3>
    </div>
  );
}
```

👇 Tu viaje — Pasos 1–4 (cada paso: concepto, tarea, verificación, tiempo)

Paso 1: Crea el formulario con inputs controlados
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- Input controlado = el valor viene del estado y se actualiza con onChange.
- type="number" = permite solo números (aunque devuelve string).
Tarea:
- Crea estados `concepto`, `monto` y `gastos` (array vacío).
- Crea 2 inputs controlados conectados a sus estados.
- Crea botón de submit (aún sin funcionalidad).
Verificación:
- Escribe en los inputs. ¿Se actualizan los valores en React DevTools?
- ¿Los inputs se limpian o mantienen el texto?
Pista:
- Para número, usa `Number(e.target.value)` o `parseFloat()` al guardar.

Paso 2: Agrega gastos al array
⏱️ Tiempo estimado: 20 min
Conceptos clave:
- ID único = identifica cada gasto para poder eliminarlo después.
- `e.preventDefault()` = evita que el formulario recargue la página.
Tarea:
- Crea función `handleSubmit` que agregue un nuevo gasto al array.
- Usa `Date.now()` para generar id único.
- Limpia los inputs después de agregar (resetea estados).
Verificación:
- Agrega 2 gastos. ¿Aparecen en la lista?
- Usa console.log(gastos) después de agregar. ¿El array crece?
Pista:
- Recuerda copiar el array: `setGastos([...gastos, nuevoGasto])`.

Paso 3: Calcula el total con reduce
⏱️ Tiempo estimado: 20 min
Conceptos clave:
- reduce(función, valorInicial) = recorre el array acumulando valores.
- acc (acumulador) = el subtotal hasta ahora.
- item (elemento actual) = el gasto que estás procesando.
Tarea:
- Usa `gastos.reduce((acc, gasto) => acc + gasto.monto, 0)` para calcular total.
- Muestra el total en un `<h3>Total: ${total}</h3>`.
Verificación:
- Agrega un gasto de $10 y otro de $20. ¿El total muestra $30?
- Agrega `console.log(acc, gasto.monto)` dentro del reduce para ver cada paso.
Pista:
- Si el total sale NaN, verifica que monto sea número, no string.

Paso 4: Elimina gastos y actualiza el total automáticamente
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- filter() = crea un nuevo array sin el elemento que cumple la condición.
- React recalcula automáticamente cuando el estado cambia.
Tarea:
- Crea función `eliminarGasto(id)` que use filter para quitar ese gasto.
- Añade botón "X" en cada elemento de la lista que llame a eliminarGasto.
Verificación:
- Agrega 3 gastos. Elimina uno. ¿Desaparece de la lista?
- ¿El total se actualiza automáticamente sin hacer nada extra?
Pista:
- `gastos.filter(gasto => gasto.id !== id)` devuelve todos menos el que buscas.

🎓 Después de terminar (reflexión)
- Escribe 2–3 frases: ¿qué hace reduce exactamente? ¿Por qué el total se actualiza solo?
- ¿Qué pasaría si olvidas el valor inicial (0) en reduce?

🚀 Si quieres ir más allá (opcional)
- Añade validación: no permitir montos negativos o concepto vacío.
- Crea un presupuesto inicial y muestra el saldo restante (presupuesto - total).
- Añade categorías a los gastos y calcula totales por categoría.
- Ordena gastos por monto (mayor a menor) con sort().
- Persiste los gastos en localStorage para que no se pierdan al recargar.
- Añade gráfica simple con barras CSS mostrando porcentaje de cada gasto.

📚 Recursos útiles
- MDN: Array.reduce()
- JavaScript: Array.filter()
- React docs: Lists and Keys
- React docs: Forms (Controlled Components)

✅ Entregable (lista)
- [ ] Formulario con inputs controlados (`concepto` y `monto`).
- [ ] Array de gastos se actualiza al agregar nuevos elementos.
- [ ] Lista renderiza todos los gastos con botón de eliminar.
- [ ] Total se calcula con `reduce` y se muestra en pantalla.
- [ ] Total se actualiza automáticamente al agregar o eliminar gastos.

🎉 Celebración: si el total se recalcula solo al cambiar gastos, ¡entendiste reduce y reactividad! ✨
