# Sprint 3 — Formularios y lógica

## Semana 5 – Generador de pizzas

📌 Antes de empezar
- ¡Respira! Manejar arrays en el estado puede parecer complicado, pero con práctica se vuelve natural. 🍕
- Orden recomendado: Concepto → Esquema → Pasos 1–5 → Recursos.
- Clave: siempre copia el estado anterior (no lo mutes directamente). Usa spread operator `[...]`.
- Consejo: trabaja en bloques pequeños (20–30 min), usa console.log para verificar el estado. 🔍

🎯 Objetivo + Concepto (por qué + analogía)
- Objetivo: Manejar estados complejos (arrays y strings) con formularios controlados (checkboxes y radio buttons). 🚀
- La metáfora del funcionario estricto:
  - Input controlado = funcionario que revisa cada cambio antes de escribirlo.
  - Estado (array) = el registro oficial donde anota cada ingrediente seleccionado.
  - Checkbox marcado = añade a la lista. Desmarcado = elimina de la lista.
  - Radio button = solo una opción permitida (reemplaza el valor anterior).
  - Validación = el funcionario verifica que tengas todo antes de aprobar el pedido.
- Resultado: formulario reactivo que valida y muestra resumen en tiempo real. ✨

📋 Esquema de código (estructura incompleta)
- Plantilla con huecos para completar —sin soluciones completas—.

```jsx
// filepath: src/components/GeneradorPizzas.jsx (estructura incompleta)
import { useState } from 'react';

export default function GeneradorPizzas() {
  // Tarea: crea dos estados:
  // - ingredientes: array vacío []
  // - tamano: string vacío ''

  const handleIngrediente = (e) => {
    const valor = e.target.value;
    const checked = e.target.checked;

    // Tarea: si checked es true, agrega valor al array
    // Si es false, elimina valor del array (usa filter)
  };

  const handleTamano = (e) => {
    // Tarea: actualiza el estado tamano con e.target.value
  };

  const confirmarPedido = () => {
    // Tarea: muestra el resumen (ingredientes + tamaño)
  };

  return (
    <div>
      <h2>Arma tu pizza 🍕</h2>

      <h3>Ingredientes:</h3>
      <label>
        <input
          type="checkbox"
          value="Peperoni"
          onChange={handleIngrediente}
        />
        Peperoni
      </label>
      {/* Añade más checkboxes para Piña y Champiñones */}

      <h3>Tamaño:</h3>
      <label>
        <input
          type="radio"
          name="tamano"
          value="Chica"
          onChange={handleTamano}
        />
        Chica
      </label>
      {/* Añade más radio buttons para Mediana y Grande */}

      <p>Ingredientes: {/* muestra el array */}</p>
      <p>Tamaño: {/* muestra el tamaño */}</p>

      <button
        onClick={confirmarPedido}
        disabled={/* valida: al menos 1 ingrediente Y un tamaño */}
      >
        Confirmar pedido
      </button>
    </div>
  );
}
```

👇 Tu viaje — Pasos 1–5 (cada paso: concepto, tarea, verificación, tiempo)

Paso 1: Crea los estados y checkboxes de ingredientes
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- Array en estado = lista que crece o se reduce según marcas/desmarcas checkboxes.
- Spread operator `[...array]` = copia el array sin mutarlo.
Tarea:
- Crea estado `ingredientes` (array vacío inicial).
- Añade 3 checkboxes: Peperoni, Piña, Champiñones.
- Crea función `handleIngrediente` que agregue o elimine del array.
Verificación:
- Usa `console.log(ingredientes)` dentro de handleIngrediente. ¿Se actualiza el array?
- Abre React DevTools → Components. ¿Ves el estado actualizarse?
Pista:
- Para agregar: `setIngredientes([...ingredientes, valor])`.
- Para eliminar: `setIngredientes(ingredientes.filter(item => item !== valor))`.

Paso 2: Muestra los ingredientes seleccionados en pantalla
⏱️ Tiempo estimado: 10 min
Conceptos clave:
- JSON.stringify() = convierte el array en texto legible.
Tarea:
- Muestra el contenido del array con `<p>{JSON.stringify(ingredientes)}</p>`.
Verificación:
- Al marcar/desmarcar checkboxes, ¿se actualiza la lista en pantalla inmediatamente?
Pista:
- Si no se actualiza, verifica que uses el estado correctamente en el JSX.

Paso 3: Añade radio buttons para el tamaño
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- Radio buttons = solo uno seleccionado a la vez (mismo atributo `name`).
- Estado simple (string) = guarda el valor del radio seleccionado.
Tarea:
- Crea estado `tamano` (string vacío inicial).
- Añade 3 radio buttons: Chica, Mediana, Grande (mismo `name="tamano"`).
- Crea función `handleTamano` que actualice el estado.
Verificación:
- Muestra el tamaño con `<p>Tamaño: {tamano}</p>`. ¿Cambia al seleccionar?
- ¿Solo puedes tener un radio button activo a la vez?
Pista:
- Todos los radio buttons deben tener el mismo `name` para ser mutuamente excluyentes.

Paso 4: Valida y habilita el botón de confirmación
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- Atributo `disabled` = bloquea el botón si no se cumplen las condiciones.
- Validación: al menos 1 ingrediente Y un tamaño seleccionado.
Tarea:
- Añade botón con `disabled={ingredientes.length === 0 || tamano === ''}`.
Verificación:
- ¿El botón está deshabilitado (gris) al inicio?
- Al seleccionar 1 ingrediente Y un tamaño, ¿se habilita?
- Si desmarcar todos los ingredientes, ¿se deshabilita de nuevo?
Pista:
- Usa DevTools → Elements para ver el atributo `disabled` en el botón.

Paso 5: Confirma el pedido y muestra resumen
⏱️ Tiempo estimado: 15 min
Conceptos clave:
- Función onClick = se ejecuta al hacer clic si el botón no está disabled.
Tarea:
- Crea función `confirmarPedido` que muestre un `alert()` con el resumen.
- Muestra ingredientes separados por comas y el tamaño.
Verificación:
- Al hacer clic en "Confirmar pedido", ¿aparece el alert con el resumen correcto?
Pista:
- Usa `ingredientes.join(', ')` para convertir el array en texto separado por comas.

🎓 Después de terminar (reflexión)
- Escribe 2–3 frases: ¿qué diferencia viste entre manejar un array y un string en el estado?
- ¿Qué pasó cuando intentaste mutar el array directamente sin copiarlo?

🚀 Hay que ir más allá
- Añade un campo de texto para el nombre del cliente (input controlado).
- Crea un contador de precio que sume según ingredientes y tamaño.
- Guarda el pedido en un array de "pedidos confirmados" y muéstralos en una lista.
- Añade botón "Limpiar" que reinicie todos los estados a sus valores iniciales.
- Implementa validación: máximo 5 ingredientes.

📚 Recursos útiles
- React docs: Forms (Controlled Components)
- MDN: input type="checkbox" y type="radio"
- JavaScript: Array.filter() y spread operator
- React DevTools: inspeccionar estado en tiempo real

✅ Entregable (lista)
- [ ] Estado `ingredientes` (array) se actualiza con checkboxes.
- [ ] Estado `tamano` (string) se actualiza con radio buttons.
- [ ] Ingredientes seleccionados se muestran en pantalla en tiempo real.
- [ ] Botón "Confirmar pedido" está disabled según validación.
- [ ] Al confirmar, se muestra resumen del pedido.

🎉 Celebración: si el botón se habilita solo cuando cumples las condiciones, ¡dominaste formularios controlados! ✨
