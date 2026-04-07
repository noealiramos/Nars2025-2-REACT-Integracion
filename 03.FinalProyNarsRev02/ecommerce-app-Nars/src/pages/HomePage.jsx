import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, searchProducts } from "../services/productService";
import { ProductList } from "../components/organisms/ProductList";
import { useCart } from "../contexts/CartContext";
import { useUI } from "../contexts/UIContext";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import "./HomePage.css";

export function HomePage() {
  const { addItem } = useCart();
  const { dispatch } = useUI();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const { data: products = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["products", searchQuery || "all"],
    queryFn: () => (searchQuery ? searchProducts(searchQuery) : fetchProducts()),
  });

  const isEmpty = !isLoading && !isError && products.length === 0;

  useEffect(() => {
    if (isLoading) {
      dispatch({ type: "START_LOADING" });
      return () => dispatch({ type: "STOP_LOADING" });
    }
    return undefined;
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (isError) {
      dispatch({
        type: "SHOW_MESSAGE",
        payload: { type: "error", text: "No se pudieron cargar los productos." },
      });
    }
  }, [dispatch, isError]);

  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  return (
    <main className="page">
      <section className="home-hero container">
        <Heading level={1}>Colección Ramdi Jewerly</Heading>
        <Text className="home-hero__text">
          Joyería de moda y accesorios para mujeres, hombres y niños. Piezas con baño de
          oro, plata, resina y pedrería de alta calidad a precios accesibles.
        </Text>
      </section>

      <section className="home-products container">
        {isLoading && (
          <section className="home-feedback home-feedback--loading" data-testid="home-loading">
            <p className="page__status">Cargando productos...</p>
            <p className="home-feedback__text">Consultando catálogo en tiempo real.</p>
          </section>
        )}
        {isError && (
          <section className="home-feedback home-feedback--error" data-testid="home-error">
            <p className="page__status page__status--error">No se pudieron cargar los productos.</p>
            <Button type="button" variant="secondary" onClick={() => refetch()} data-testid="home-retry">
              Reintentar
            </Button>
          </section>
        )}
        {isEmpty && (
          <section className="home-feedback home-feedback--empty" data-testid="home-empty">
            <p className="page__status">No encontramos productos para esta búsqueda.</p>
            <p className="home-feedback__text">Prueba con otra palabra clave o vuelve al catálogo general.</p>
          </section>
        )}
        {!isLoading && !isError && !isEmpty && (
          <ProductList products={products} onAddToCart={handleAddToCart} />
        )}
      </section>
    </main>
  );
}
