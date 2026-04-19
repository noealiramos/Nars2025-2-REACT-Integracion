import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import "./ConfirmationPage.css";

const formatShippingAddress = (shippingAddress) => {
  if (!shippingAddress) return "Sin dirección registrada";
  if (typeof shippingAddress === "string") return shippingAddress;

  return [
    shippingAddress.name,
    shippingAddress.address,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
};

const formatPaymentMethod = (order) => {
  if (order.paymentMethodSummary) return order.paymentMethodSummary;
  if (!order.paymentMethod) return null;
  if (typeof order.paymentMethod === "string") return order.paymentMethod;

  return [order.paymentMethod.brand, order.paymentMethod.last4 ? `**** ${order.paymentMethod.last4}` : ""]
    .filter(Boolean)
    .join(" ");
};

const normalizeOrderItems = (order) =>
  Array.isArray(order.products)
    ? order.products.map((product) => ({
        ...product,
        name: product.productId?.name || product.name || "Producto",
        price: Number(product.price || 0),
        quantity: Number(product.quantity || 0),
        id: product.productId?._id || product.productId || product.id,
      }))
    : Array.isArray(order.items)
      ? order.items.map((item) => ({
          ...item,
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 0),
          id: item.id || item.productId || `${item.name}-${item.quantity}`,
        }))
      : [];

export function ConfirmationPage() {
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (location.state?.order) {
      const o = location.state.order;
      const items = normalizeOrderItems(o);
      const subtotal = Number(o.subtotal || 0);
      const shippingCost = Number(o.shippingCost || 0);

      setOrder({
        ...o,
        id: o._id || o.id,
        total: Number(o.totalPrice || o.total || 0),
        subtotal,
        shippingCost,
        shippingAddressLabel: formatShippingAddress(o.shippingAddress),
        paymentMethodLabel: formatPaymentMethod(o),
        items,
      });
    }
  }, [location.state]);

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
        Hemos registrado tu pedido en Ramdi Jewerly. A continuación verás el
        resumen real de la compra realizada.
      </Text>

      {order ? (
        <section className="order-summary" data-testid="order-summary">
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
                  {order.user.displayName || order.user.name} ({order.user.email})
                </span>
              </div>
            )}
            <div className="order-summary__row order-summary__row--small">
              <span>Dirección de envío</span>
              <span>{order.shippingAddressLabel}</span>
            </div>
            {order.paymentMethodLabel && (
              <div className="order-summary__row order-summary__row--small">
                <span>Método de pago</span>
                <span>{order.paymentMethodLabel}</span>
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
