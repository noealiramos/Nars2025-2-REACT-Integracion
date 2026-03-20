import { ProductCard } from "../molecules/ProductCard";
import "./ProductList.css";

export function ProductList({ products, onAddToCart }) {
  if (!products?.length) {
    return (
      <p className="product-list__empty">
        No hay productos disponibles en este momento.
      </p>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}