import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { Heading } from "../atoms/Heading";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useWishlistActions } from "../../hooks/useWishlistActions";
import "./ProductCard.css";

export function ProductCard({ product, onAddToCart }) {
  const { isAuthenticated } = useAuth();
  const { addToWishlist, isMutating } = useWishlistActions();
  const navigate = useNavigate();
  const { name, price, image, material } = product;
  const productId = product.id || product._id;
  const parsedStock = Number(product.stock);
  const hasStock = Number.isFinite(parsedStock) && parsedStock > 0;
  const shouldShowAddToCart = isAuthenticated && hasStock;

  const formattedPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);

  const handleAddToCart = () => {
    if (!shouldShowAddToCart) {
      return;
    }

    onAddToCart(product);
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    await addToWishlist(productId);
  };

  return (
    <article className="product-card">
      <Link to={`/product/${productId}`} className="product-card__image-wrapper">
        {image ? (
          <img
            src={image}
            alt={name}
            className="product-card__image"
            loading="lazy"
          />
        ) : (
          <span className="product-card__image-placeholder">Sin imagen</span>
        )}
      </Link>

      <div className="product-card__body">
        <Heading level={3} className="product-card__name">
          {name}
        </Heading>

        {material && (
          <Text size="sm" className="product-card__material">
            Material: <span>{material}</span>
          </Text>
        )}

        <Text weight="bold" className="product-card__price">
          {formattedPrice}
        </Text>

        <div className="product-card__actions">
          {shouldShowAddToCart ? (
            <Button
              variant="primary"
              type="button"
              onClick={handleAddToCart}
              data-testid={`add-to-cart-${productId}`}
            >
              Agregar al carrito
            </Button>
          ) : !hasStock ? (
            <span className="product-card__stock-state" data-testid={`stock-state-${productId}`}>
              Agotado
            </span>
          ) : (
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate("/login")}
              data-testid={`login-to-buy-${productId}`}
            >
              Inicia sesion para comprar
            </Button>
          )}

          <Link to={`/product/${productId}`} className="product-card__link" data-testid={`view-detail-${productId}`}>
            Ver detalle
          </Link>
          <Button type="button" variant="secondary" onClick={handleAddToWishlist} data-testid={`add-to-wishlist-${productId}`} disabled={isMutating}>
            Wishlist
          </Button>
        </div>
      </div>
    </article>
  );
}
