import { useLocation } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductList } from "../components/organisms/ProductList";
import { useCart } from "../contexts/CartContext";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import "./HomePage.css";

/**
 * HomePage Page
 * Muestra el catálogo de productos con soporte para búsqueda y filtrado por categoría.
 */
export function HomePage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const categoryId = searchParams.get("category") || "";

  // Construir parámetros para el hook de productos
  const params = {};
  if (searchQuery) params.q = searchQuery;
  if (categoryId) params.categoryId = categoryId;

  const { products, loading, error } = useProducts(params);
  const { addItem } = useCart();

  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  return (
    <div className="home-page">
      <section className="home-hero">
        <Heading level={1}>
          {searchQuery
            ? `Resultados para: "${searchQuery}"`
            : categoryId
              ? "Explorando categoría"
              : "Colección Ramdi Jewerly"}
        </Heading>
        {!searchQuery && !categoryId && (
          <Text className="home-hero__text">
            Joyería de moda y accesorios para mujeres, hombres y niños. Piezas con baño de
            oro, plata, resina y pedrería de alta calidad a precios accesibles.
          </Text>
        )}
      </section>

      <section className="home-products">
        {error && !loading && (
          <p className="page__status page__status--error">{error}</p>
        )}

        {!error && (
          <>
            {!loading && products.length === 0 && (searchQuery || categoryId) && (
              <p className="page__status">
                No se encontraron productos para los criterios seleccionados.
              </p>
            )}
            <ProductList
              products={products}
              onAddToCart={handleAddToCart}
              loading={loading}
            />
          </>
        )}
      </section>
    </div>
  );
}