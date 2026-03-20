import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import { STORAGE_KEYS } from "../utils/storageHelpers";
import "./ConfirmationPage.css";

export function ConfirmationPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.lastOrder);
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
      } catch {
        setOrder(null);
      }
    }
  }, []);

  const formatMoney = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value || 0);

  return (
    <main className="page container confirmation-page">
      <div className="confirmation-page__icon-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="confirmation-icon"
          aria-hidden="true"
        >
          <path d="M8.25 2.25h7.5a3 3 0 0 1 2.12.88l3 3a3 3 0 0 1 .88 2.12v7.5a3 3 0 0 1-.88 2.12l-3 3a3 3 0 0 1-2.12.88h-7.5a3 3 0 0 1-2.12-.88l-3-3A3 3 0 0 1 2.25 15.75v-7.5a3 3 0 0 1 .88-2.12l3-3A3 3 0 0 1 8.25 2.25Zm7.03 6.47a.75.75 0 0 0-1.06-1.06L11 10.88 9.78 9.66a.75.75 0 1 0-1.06 1.06l1.75 1.75a.75.75 0 0 0 1.06 0l3.75-3.75Z" />
        </svg>
      </div>

      <Heading level={2} align="center">
        ¡Gracias por tu compra!
      </Heading>
      <Text className="confirmation-page__intro">
        Hemos registrado tu pedido en Ramdi Jewerly. A continuación verás un
        resumen simulado de la compra realizada.
      </Text>

      {order ? (
        <section className="order-summary">
          {/* Datos generales */}
          <div className="order-summary__section">
            <div className="order-summary__row order-summary__row--small">
              <span>ID de orden</span>
              <span>{order.id}</span>
            </div>
            {order.user && (
              <div className="order-summary__row order-summary__row--small">
                <span>Cliente</span>
                <span>
                  {order.user.name} ({order.user.email})
                </span>
              </div>
            )}
            <div className="order-summary__row order-summary__row--small">
              <span>Dirección de envío</span>
              <span>{order.shippingAddress}</span>
            </div>
            {order.paymentMethodSummary && (
              <div className="order-summary__row order-summary__row--small">
                <span>Método de pago</span>
                <span>{order.paymentMethodSummary}</span>
              </div>
            )}
          </div>

          {/* Productos */}
          <div className="order-summary__section">
            <h3 className="order-summary__subtitle">Productos</h3>

<ul className="order-summary__items">
  {order.items.map((item) => (
    <li key={item.id} className="order-summary__item">
      <span className="order-summary__item-left">
        <span className="order-summary__bullet">•</span>
        <span className="order-summary__item-name">{item.name}</span>
      </span>

      <span className="order-summary__item-qtyprice">
        {item.quantity} = {formatMoney(item.price * item.quantity)}
      </span>
    </li>
  ))}
</ul>



          </div>
          {/* Totales */}
          <div className="order-summary__section order-summary__section--totals">
            <div className="order-summary__row">
              <span>Subtotal</span>
              <span>{formatMoney(order.subtotal)}</span>
            </div>
            <div className="order-summary__row order-summary__row--muted">
              <span>IVA (16%)</span>
              <span>{formatMoney(order.iva)}</span>
            </div>
            <div className="order-summary__row order-summary__row--muted">
              <span>Envío</span>
              <span>{formatMoney(order.shippingCost)}</span>
            </div>

            {/* Separador antes del total */}
            <div className="order-summary__separator"></div>

            <div className="order-summary__row order-summary__row--total">
              <span>Total pagado</span>
              <span>{formatMoney(order.total)}</span>
            </div>
          </div>
        </section>
      ) : (
        <p className="confirmation-page__intro confirmation-page__intro--center">
          No se encontró información de la última compra. Es posible que hayas limpiado tu
          navegador.
        </p>
      )}

      <div className="confirmation-page__actions">
        <Link to="/" className="confirmation-page__button">
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}
