import { useEffect, useMemo, useState } from 'react';
import './Presupuestador.css';

const STORAGE_KEY = 'presupuestador_gastos_v1';

function formatMoney(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function safeNumber(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num : 0;
}

export default function Presupuestador() {
  // Estados base del reto
  const [gastos, setGastos] = useState([]);
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  // Ir más allá
  const [categoria, setCategoria] = useState('General');
  const [presupuesto, setPresupuesto] = useState(1000);
  const [orden, setOrden] = useState('monto_desc'); // monto_desc | monto_asc | fecha_desc | fecha_asc
  const [error, setError] = useState('');

  // Cargar localStorage al iniciar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const normalized = parsed
          .filter(Boolean)
          .map((g) => ({
            id: g.id ?? Date.now(),
            concepto: String(g.concepto ?? ''),
            monto: safeNumber(g.monto),
            categoria: String(g.categoria ?? 'General'),
            createdAt: safeNumber(g.createdAt) || Date.now(),
          }));
        setGastos(normalized);
      }
    } catch (e) {
      // si hay basura en storage, lo ignoramos
      console.warn('No se pudo leer localStorage:', e);
    }
  }, []);

  // Guardar localStorage cada que cambie gastos
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gastos));
    } catch (e) {
      console.warn('No se pudo guardar localStorage:', e);
    }
  }, [gastos]);

  const total = useMemo(() => {
    return gastos.reduce((acc, gasto) => acc + safeNumber(gasto.monto), 0);
  }, [gastos]);

  const saldo = useMemo(() => {
    return safeNumber(presupuesto) - total;
  }, [presupuesto, total]);

  const totalesPorCategoria = useMemo(() => {
    // { "Comida": 120, "Transporte": 50, ... }
    return gastos.reduce((acc, gasto) => {
      const key = gasto.categoria || 'General';
      acc[key] = (acc[key] || 0) + safeNumber(gasto.monto);
      return acc;
    }, {});
  }, [gastos]);

  const categoriasOrdenadas = useMemo(() => {
    const entries = Object.entries(totalesPorCategoria);
    entries.sort((a, b) => b[1] - a[1]);
    return entries;
  }, [totalesPorCategoria]);

  const gastosOrdenados = useMemo(() => {
    const copy = [...gastos];

    const byMonto = (a, b) => safeNumber(a.monto) - safeNumber(b.monto);
    const byFecha = (a, b) => safeNumber(a.createdAt) - safeNumber(b.createdAt);

    switch (orden) {
      case 'monto_asc':
        copy.sort(byMonto);
        break;
      case 'monto_desc':
        copy.sort((a, b) => byMonto(b, a));
        break;
      case 'fecha_asc':
        copy.sort(byFecha);
        break;
      case 'fecha_desc':
        copy.sort((a, b) => byFecha(b, a));
        break;
      default:
        copy.sort((a, b) => byMonto(b, a));
    }

    return copy;
  }, [gastos, orden]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const conceptoTrim = concepto.trim();
    const montoNum = Number(monto);

    // Validaciones (ir más allá)
    if (!conceptoTrim) {
      setError('El concepto no puede ir vacío.');
      return;
    }
    if (!Number.isFinite(montoNum) || monto === '') {
      setError('Ingresa un monto válido.');
      return;
    }
    if (montoNum <= 0) {
      setError('El monto debe ser mayor a 0 (no negativos ni cero).');
      return;
    }

    const nuevoGasto = {
      id: Date.now(),
      concepto: conceptoTrim,
      monto: montoNum,
      categoria: categoria || 'General',
      createdAt: Date.now(),
    };

    setGastos((prev) => [...prev, nuevoGasto]);
    setConcepto('');
    setMonto('');
    setCategoria('General');
  };

  const eliminarGasto = (id) => {
    setGastos((prev) => prev.filter((gasto) => gasto.id !== id));
  };

  const limpiarTodo = () => {
    setGastos([]);
    setError('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const maxCategoria = categoriasOrdenadas[0]?.[1] ?? 0;

  return (
    <div className="presu">
      <header className="presu__header">
        <h2 className="presu__title">Presupuestador 💰</h2>

        <div className="presu__budget">
          <label className="field">
            <span className="field__label">Presupuesto inicial</span>
            <input
              className="input"
              type="number"
              min="0"
              step="1"
              value={presupuesto}
              onChange={(e) => setPresupuesto(safeNumber(e.target.value))}
            />
          </label>

          <div className="kpi">
            <div className="kpi__item">
              <span className="kpi__label">Total gastos</span>
              <span className="kpi__value">{formatMoney(total)}</span>
            </div>
            <div className={`kpi__item ${saldo < 0 ? 'kpi__item--bad' : 'kpi__item--good'}`}>
              <span className="kpi__label">Saldo</span>
              <span className="kpi__value">{formatMoney(saldo)}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="card">
        <h3 className="card__title">Agregar gasto</h3>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Concepto</span>
            <input
              className="input"
              type="text"
              placeholder="Ej. Gasolina"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field__label">Monto</span>
            <input
              className="input"
              type="number"
              placeholder="Ej. 250"
              min="0"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field__label">Categoría</span>
            <select
              className="input"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Comida">Comida</option>
              <option value="Transporte">Transporte</option>
              <option value="Casa">Casa</option>
              <option value="Servicios">Servicios</option>
              <option value="Salud">Salud</option>
              <option value="Ocio">Ocio</option>
              <option value="Otros">Otros</option>
            </select>
          </label>

          <div className="form__actions">
            <button className="btn btn--primary" type="submit">
              Agregar gasto
            </button>
            <button className="btn btn--ghost" type="button" onClick={limpiarTodo}>
              Limpiar todo
            </button>
          </div>

          {error ? <p className="error">{error}</p> : null}
        </form>
      </section>

      <section className="grid">
        <div className="card">
          <div className="card__head">
            <h3 className="card__title">Lista de gastos</h3>

            <label className="field field--inline">
              <span className="field__label">Orden</span>
              <select className="input" value={orden} onChange={(e) => setOrden(e.target.value)}>
                <option value="monto_desc">Monto (mayor → menor)</option>
                <option value="monto_asc">Monto (menor → mayor)</option>
                <option value="fecha_desc">Fecha (más reciente)</option>
                <option value="fecha_asc">Fecha (más antiguo)</option>
              </select>
            </label>
          </div>

          {gastosOrdenados.length === 0 ? (
            <p className="muted">Aún no hay gastos. Agrega el primero arriba 👆</p>
          ) : (
            <ul className="list">
              {gastosOrdenados.map((gasto) => (
                <li className="list__item" key={gasto.id}>
                  <div className="list__main">
                    <div className="list__top">
                      <span className="pill">{gasto.categoria}</span>
                      <span className="list__concepto">{gasto.concepto}</span>
                    </div>
                    <span className="list__monto">{formatMoney(gasto.monto)}</span>
                  </div>

                  <button className="btn btn--danger" onClick={() => eliminarGasto(gasto.id)}>
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3 className="card__title">Totales por categoría</h3>

          {categoriasOrdenadas.length === 0 ? (
            <p className="muted">Sin categorías aún.</p>
          ) : (
            <div className="cats">
              {categoriasOrdenadas.map(([cat, value]) => {
                const pct = maxCategoria > 0 ? (value / maxCategoria) * 100 : 0;
                return (
                  <div className="cat" key={cat}>
                    <div className="cat__row">
                      <span className="cat__name">{cat}</span>
                      <span className="cat__value">{formatMoney(value)}</span>
                    </div>
                    <div className="bar">
                      <div className="bar__fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="divider" />

          <h3 className="card__title">Gráfica simple</h3>
          <p className="muted">
            Barra proporcional al gasto de cada categoría (basado en la mayor).
          </p>
        </div>
      </section>
    </div>
  );
}
