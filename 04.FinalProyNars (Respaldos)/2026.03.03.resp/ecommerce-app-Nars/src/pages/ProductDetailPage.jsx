import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/atoms/Button";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import "./ProductDetailPage.css";

export function ProductDetailPage() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { addItem } = useCart();

  if (loading) {
    return (
      <div className="page-status-wrapper">
        <p className="page__status">Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-status-wrapper">
        <p className="page__status page__status--error">{error}</p>
      </div>
    );
  }

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(product.price);

  return (
    <div className="product-detail">
      <div className="product-detail__media">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-detail__image"
            loading="lazy"
          />
        ) : (
          <span className="product-detail__image-placeholder">Sin imagen</span>
        )}
      </div>
      <div className="product-detail__info">
        <Heading level={2}>{product.name}</Heading>
        <Text className="product-detail__description">{product.description}</Text>

        <div className="product-detail__meta">
          {product.material && (
            <p>
              Material: <span>{product.material}</span>
            </p>
          )}
          {product.design && (
            <p>
              Diseño: <span>{product.design}</span>
            </p>
          )}
          {product.stone && (
            <p>
              Piedra: <span>{product.stone}</span>
            </p>
          )}
          <p>Stock disponible: {product.stock}</p>
        </div>

        <p className="product-detail__price">{formattedPrice}</p>

        <div className="product-detail__actions">
          <Button type="button" onClick={() => addItem(product, 1)}>
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  );
}