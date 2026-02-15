import { useMemo, useState } from 'react'
import './GeneradorPizzas.css'

const INGREDIENTES = [
  { label: 'Peperoni', value: 'Peperoni', price: 15 },
  { label: 'Piña', value: 'Piña', price: 10 },
  { label: 'Champiñones', value: 'Champiñones', price: 12 },
]

const TAMANOS = [
  { label: 'Chica', value: 'Chica', price: 80 },
  { label: 'Mediana', value: 'Mediana', price: 110 },
  { label: 'Grande', value: 'Grande', price: 140 },
]

export default function GeneradorPizzas() {
  // Estados base del reto
  const [ingredientes, setIngredientes] = useState([])
  const [tamano, setTamano] = useState('')

  // "Ir más allá"
  const [cliente, setCliente] = useState('')
  const [pedidos, setPedidos] = useState([])
  const [error, setError] = useState('')

  const handleIngrediente = (e) => {
    const valor = e.target.value
    const checked = e.target.checked

    setIngredientes((prev) => {
      if (checked) {
        if (prev.includes(valor)) return prev

        // Validación: máximo 5 ingredientes
        if (prev.length >= 5) {
          setError('Máximo 5 ingredientes.')
          return prev
        }

        setError('')
        return [...prev, valor]
      }

      setError('')
      return prev.filter((item) => item !== valor)
    })
  }

  const handleTamano = (e) => {
    setTamano(e.target.value)
  }

  const puedeConfirmar = ingredientes.length > 0 && tamano !== ''

  const resumenTexto = useMemo(() => {
    const ing = ingredientes.length ? ingredientes.join(', ') : '(ninguno)'
    const size = tamano || '(sin tamaño)'
    return `Cliente: ${cliente.trim() || '(sin nombre)'} | Tamaño: ${size} | Ingredientes: ${ing}`
  }, [cliente, tamano, ingredientes])

  const precioTotal = useMemo(() => {
    const sizeObj = TAMANOS.find((t) => t.value === tamano)
    const base = sizeObj ? sizeObj.price : 0

    const extra = ingredientes.reduce((acc, ing) => {
      const obj = INGREDIENTES.find((i) => i.value === ing)
      return acc + (obj ? obj.price : 0)
    }, 0)

    return base + extra
  }, [tamano, ingredientes])

  const confirmarPedido = () => {
    if (!puedeConfirmar) return

    const nuevo = {
      id: crypto.randomUUID(),
      cliente: cliente.trim() || '(sin nombre)',
      tamano,
      ingredientes: [...ingredientes],
      precio: precioTotal,
      fecha: new Date().toLocaleString(),
    }

    setPedidos((prev) => [nuevo, ...prev])

    alert(
      `✅ Pedido confirmado\n\nCliente: ${nuevo.cliente}\nTamaño: ${nuevo.tamano}\nIngredientes: ${nuevo.ingredientes.join(
        ', ',
      )}\nTotal: $${nuevo.precio} MXN`,
    )
  }

  const limpiar = () => {
    setCliente('')
    setIngredientes([])
    setTamano('')
    setError('')
  }

  return (
    <div className="pizza-card">
      <h2 className="title">Arma tu pizza 🍕</h2>
      <p className="subtitle">Formulario controlado con arrays (checkbox) y string (radio).</p>

      <div className="section">
        <h3 className="sectionTitle">Nombre del cliente</h3>
        <input
          className="textInput"
          type="text"
          placeholder="Ej. Ali"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
      </div>

      <div className="grid">
        <div className="section">
          <h3 className="sectionTitle">Ingredientes (máx. 5)</h3>

          <div className="options">
            {INGREDIENTES.map((i) => (
              <label key={i.value} className="option">
                <input
                  type="checkbox"
                  value={i.value}
                  onChange={handleIngrediente}
                  checked={ingredientes.includes(i.value)}
                />
                <span>
                  {i.label} <em className="muted">(+${i.price})</em>
                </span>
              </label>
            ))}
          </div>

          {error ? <p className="error">{error}</p> : null}
        </div>

        <div className="section">
          <h3 className="sectionTitle">Tamaño</h3>

          <div className="options">
            {TAMANOS.map((t) => (
              <label key={t.value} className="option">
                <input
                  type="radio"
                  name="tamano"
                  value={t.value}
                  onChange={handleTamano}
                  checked={tamano === t.value}
                />
                <span>
                  {t.label} <em className="muted">(${t.price})</em>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="section summary">
        <h3 className="sectionTitle">Resumen en tiempo real</h3>

        <p className="row">
          <span className="label">Ingredientes:</span>
          <span className="value">{ingredientes.length ? ingredientes.join(', ') : '(ninguno)'}</span>
        </p>

        <p className="row">
          <span className="label">Tamaño:</span>
          <span className="value">{tamano || '(sin tamaño)'}</span>
        </p>

        <p className="row">
          <span className="label">Total:</span>
          <span className="value">${precioTotal} MXN</span>
        </p>

        <p className="muted small">{resumenTexto}</p>
      </div>

      <div className="actions">
        <button className="btn secondary" type="button" onClick={limpiar}>
          Limpiar
        </button>

        <button
          className="btn primary"
          type="button"
          onClick={confirmarPedido}
          disabled={!puedeConfirmar}
          title={!puedeConfirmar ? 'Selecciona al menos 1 ingrediente y un tamaño' : 'Listo'}
        >
          Confirmar pedido
        </button>
      </div>

      <div className="section">
        <h3 className="sectionTitle">Pedidos confirmados</h3>

        {pedidos.length === 0 ? (
          <p className="muted">Aún no hay pedidos.</p>
        ) : (
          <ul className="orders">
            {pedidos.map((p) => (
              <li key={p.id} className="orderItem">
                <div className="orderTop">
                  <strong>{p.cliente}</strong>
                  <span className="muted small">{p.fecha}</span>
                </div>
                <div className="orderDetails">
                  <span>Tamaño: {p.tamano}</span>
                  <span>Ingredientes: {p.ingredientes.join(', ')}</span>
                  <span className="price">Total: ${p.precio} MXN</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
