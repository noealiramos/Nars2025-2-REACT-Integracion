import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heading } from "../components/atoms/Heading";
import { Button } from "../components/atoms/Button";
import { useCart } from "../contexts/CartContext";
import { getWishlist } from "../services/wishlistService";
import { useWishlistActions } from "../hooks/useWishlistActions";
import "./WishlistPage.css";

const formatMoney = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value || 0);

export function WishlistPage() {
  const { addItem } = useCart();
  const { removeFromWishlist, clearUserWishlist, moveToCartFromWishlist, isMutating } = useWishlistActions();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  const products = data?.products || [];
  const hasProducts = products.length > 0;
  const totalSaved = useMemo(() => products.reduce((acc, product) => acc + product.price, 0), [products]);

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleMoveToCart = async (product) => {
    await moveToCartFromWishlist(product.id);
    addItem(product, 1);
  };

  const handleClear = async () => {
    await clearUserWishlist();
  };

  return (
    <main className="page container wishlist-page">
      <header className="wishlist-page__hero">
        <div>
          <Heading level={2}>Mi wishlist</Heading>
          <p className="wishlist-page__intro">Guarda productos reales del catálogo para revisarlos y decidir después.</p>
        </div>
        {hasProducts && <Button type="button" variant="secondary" onClick={handleClear} data-testid="wishlist-clear" disabled={isMutating}>Limpiar wishlist</Button>}
      </header>

      {isLoading && (
        <section className="wishlist-feedback wishlist-feedback--loading" data-testid="wishlist-loading">
          <p className="page__status">Cargando wishlist...</p>
          <p className="wishlist-feedback__text">Estamos sincronizando tus productos guardados.</p>
        </section>
      )}
      {isError && (
        <section className="wishlist-feedback wishlist-feedback--error" data-testid="wishlist-error">
          <p className="page__status page__status--error">No pudimos cargar tu wishlist.</p>
          <p className="wishlist-feedback__text">Verifica tu sesión o vuelve a intentar más tarde.</p>
        </section>
      )}

      {!isLoading && !isError && !hasProducts && (
        <section className="wishlist-empty" data-testid="wishlist-empty">
          <p className="wishlist-empty__title">Todavía no has guardado productos.</p>
          <p className="wishlist-empty__text">Agrega productos desde el catálogo para consultarlos después.</p>
        </section>
      )}

      {!isLoading && !isError && hasProducts && (
        <>
          <section className="wishlist-summary">
            <p><strong>Productos guardados:</strong> {products.length}</p>
            <p><strong>Valor acumulado:</strong> {formatMoney(totalSaved)}</p>
          </section>

          <section className="wishlist-grid" data-testid="wishlist-list">
            {products.map((product) => (
              <article className="wishlist-card" key={product.id} data-testid={`wishlist-item-${product.id}`}>
                <div className="wishlist-card__media">
                  {product.image ? <img src={product.image} alt={product.name} className="wishlist-card__image" /> : <span className="wishlist-card__placeholder">Sin imagen</span>}
                </div>
                <div className="wishlist-card__body">
                  <strong>{product.name}</strong>
                  <p>{formatMoney(product.price)}</p>
                  <p>Stock: {product.stock}</p>
                  <div className="wishlist-card__actions">
                    <Button type="button" variant="secondary" onClick={() => handleMoveToCart(product)} data-testid={`wishlist-move-${product.id}`} disabled={product.stock <= 0 || isMutating}>
                      Mover a carrito
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => handleRemove(product.id)} data-testid={`wishlist-remove-${product.id}`} disabled={isMutating}>
                      Quitar
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
