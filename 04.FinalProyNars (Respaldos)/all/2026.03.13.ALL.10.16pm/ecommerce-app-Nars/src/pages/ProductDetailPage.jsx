import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/atoms/Button";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import "./ProductDetailPage.css";

export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    getProductById(id)
      .then((data) => {
        if (!mounted) return;
        if (!data) {
          setError("Producto no encontrado.");
        } else {
          setProduct(data);
        }
      })
      .catch(() => {
        if (mounted) setError("Error al cargar el producto.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="page container">
        <p className="page__status">Cargando producto...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page container">
        <p className="page__status page__status--error">{error}</p>
      </main>
    );
  }

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(product.price);

  return (
    <main className="page container product-detail">
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
    </main>
  );
}