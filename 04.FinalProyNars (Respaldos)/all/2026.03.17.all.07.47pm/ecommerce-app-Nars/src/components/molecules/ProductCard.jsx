import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { Heading } from "../atoms/Heading";
import { Link } from "react-router-dom";
import "./ProductCard.css";

export function ProductCard({ product, onAddToCart }) {
  const { id, name, price, image, material } = product;

  const formattedPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);

  return (
    <article className="product-card">
      <Link to={`/product/${id}`} className="product-card__image-wrapper">
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
          <Button
            variant="primary"
            type="button"
            onClick={() => onAddToCart(product)}
            data-testid={`add-to-cart-${id}`}
          >
            Agregar al carrito
          </Button>

          <Link to={`/product/${id}`} className="product-card__link" data-testid={`view-detail-${id}`}>
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
