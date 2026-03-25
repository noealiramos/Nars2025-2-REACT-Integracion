import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heading } from "../components/atoms/Heading";
import { useAuth } from "../contexts/AuthContext";
import { getOrderDetail } from "../services/orderService";
import "./OrderDetailPage.css";

const formatMoney = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value || 0);

const formatDate = (value) => {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
};

export function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getOrderDetail(id);

        if (!active) return;

        if (user?.id && data.user?._id && user.id !== data.user._id) {
          setError("No puedes ver el detalle de una orden de otro usuario.");
          return;
        }

        setOrder(data);
      } catch (requestError) {
        if (!active) return;
        setError(requestError.response?.data?.message || requestError.response?.data?.error || "No pudimos cargar el detalle de la orden.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [id, user?.id]);

  return (
    <main className="page container order-detail-page" data-cy="order-detail-page">
      <div className="order-detail-page__header">
        <div>
          <Heading level={2}>Detalle de orden</Heading>
          <p className="order-detail-page__intro">Revisa productos, entrega y método de pago asociado a esta compra.</p>
        </div>
        <Link to="/orders" className="order-detail-page__back" data-cy="order-detail-back">
          Volver a mis órdenes
        </Link>
      </div>

      {loading && <p className="order-detail-page__status" data-cy="order-detail-loading">Cargando orden...</p>}
      {!loading && error && <p className="order-detail-page__status order-detail-page__status--error" data-cy="order-detail-error">{error}</p>}

      {!loading && !error && order && (
        <section className="order-detail-card" data-cy="order-detail-card">
          <div className="order-detail-card__meta">
            <div>
              <p className="order-detail-card__label">ID</p>
              <p className="order-detail-card__value" data-cy="order-detail-id">#{order.id}</p>
            </div>
            <div>
              <p className="order-detail-card__label">Fecha</p>
              <p className="order-detail-card__value">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="order-detail-card__label">Estado</p>
              <p className="order-detail-card__value" data-cy="order-detail-status">{order.status}</p>
            </div>
            <div>
              <p className="order-detail-card__label">Pago</p>
              <p className="order-detail-card__value">{order.paymentStatus}</p>
            </div>
          </div>

          <div className="order-detail-card__section">
            <h3>Productos</h3>
            <div className="order-detail-items" data-cy="order-detail-items">
              {order.items.map((item) => (
                <article key={item.id} className="order-detail-item" data-cy="order-detail-item">
                  <div>
                    <p className="order-detail-item__name">{item.name}</p>
                    <p className="order-detail-item__meta">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="order-detail-item__price">{formatMoney(item.subtotal)}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="order-detail-card__columns">
            <div className="order-detail-card__section">
              <h3>Envío</h3>
              <p data-cy="order-detail-shipping">{order.shippingAddressLabel}</p>
            </div>
            <div className="order-detail-card__section">
              <h3>Pago</h3>
              <p data-cy="order-detail-payment">{order.paymentMethodLabel}</p>
            </div>
          </div>

          <div className="order-detail-total" data-cy="order-detail-total">
            <span>Total pagado</span>
            <strong>{formatMoney(order.totalPrice)}</strong>
          </div>
        </section>
      )}
    </main>
  );
}
