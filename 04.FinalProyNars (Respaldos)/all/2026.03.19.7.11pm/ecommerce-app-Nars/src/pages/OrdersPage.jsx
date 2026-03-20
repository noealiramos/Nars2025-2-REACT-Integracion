import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heading } from "../components/atoms/Heading";
import { Button } from "../components/atoms/Button";
import { useAuth } from "../contexts/AuthContext";
import { getOrdersByUser } from "../services/orderService";
import "./OrdersPage.css";

const formatMoney = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value || 0);

const formatDate = (value) => {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalResults: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getOrdersByUser(user.id, {
          page,
          limit: 5,
          sort: "createdAt",
          order: "desc",
        });

        if (!active) return;

        setOrders(data.orders);
        setPagination(data.pagination);
      } catch (requestError) {
        if (!active) return;
        setError(requestError.response?.data?.message || requestError.response?.data?.error || "No pudimos cargar tus órdenes.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, [page, user?.id]);

  return (
    <main className="page container orders-page" data-cy="orders-page">
      <div className="orders-page__header">
        <div>
          <Heading level={2}>Mis órdenes</Heading>
          <p className="orders-page__intro">Consulta tus compras recientes y abre el detalle de cada pedido.</p>
        </div>
        <Link to="/" className="orders-page__browse-link" data-cy="orders-browse-link">
          Seguir comprando
        </Link>
      </div>

      {loading && <p className="orders-page__status" data-cy="orders-loading">Cargando órdenes...</p>}

      {!loading && error && <p className="orders-page__status orders-page__status--error" data-cy="orders-error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <section className="orders-empty" data-cy="orders-empty">
          <p className="orders-empty__title">Todavía no tienes órdenes registradas.</p>
          <p className="orders-empty__text">Cuando completes tu primera compra la verás aquí con su total, estado y fecha.</p>
          <Link to="/" className="orders-empty__action" data-cy="orders-empty-action">
            Explorar catálogo
          </Link>
        </section>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="orders-list" data-cy="orders-list">
            {orders.map((order) => (
              <article key={order.id} className="orders-card" data-cy="order-card">
                <div className="orders-card__top">
                  <div>
                    <p className="orders-card__label">Orden</p>
                    <p className="orders-card__id" data-cy="order-id">#{order.id}</p>
                  </div>
                  <span className="orders-card__status" data-cy="order-status">{order.status}</span>
                </div>

                <div className="orders-card__grid">
                  <div>
                    <p className="orders-card__label">Fecha</p>
                    <p>{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="orders-card__label">Productos</p>
                    <p>{order.itemCount}</p>
                  </div>
                  <div>
                    <p className="orders-card__label">Pago</p>
                    <p>{order.paymentStatus}</p>
                  </div>
                  <div>
                    <p className="orders-card__label">Total</p>
                    <p className="orders-card__price">{formatMoney(order.totalPrice)}</p>
                  </div>
                </div>

                <div className="orders-card__actions">
                  <Link to={`/orders/${order.id}`} className="orders-card__link" data-cy="order-view-detail">
                    Ver detalle
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="orders-pagination" data-cy="orders-pagination">
            <Button type="button" variant="secondary" onClick={() => setPage((current) => current - 1)} disabled={!pagination.hasPrev} data-cy="orders-prev-page">
              Anterior
            </Button>
            <span className="orders-pagination__text" data-cy="orders-pagination-text">
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>
            <Button type="button" variant="secondary" onClick={() => setPage((current) => current + 1)} disabled={!pagination.hasNext} data-cy="orders-next-page">
              Siguiente
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
