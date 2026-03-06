import { ProductCard } from "../molecules/ProductCard";
import { ProductCardSkeleton } from "../molecules/ProductCardSkeleton";
import "./ProductList.css";

/**
 * ProductList Organism
 * Sigue el patrón de Atomic Design como un Organism.
 * Muestra una rejilla de productos o esqueletos de carga.
 */
export function ProductList({ products, onAddToCart, loading, skeletonCount = 8 }) {
  if (loading) {
    return (
      <div className="product-list">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <ProductCardSkeleton key={`skeleton-${idx}`} />
        ))}
      </div>
    );
  }

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