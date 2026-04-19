import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchProductsPaginated, searchProductsPaginated } from "../services/productService";
import { ProductList } from "../components/organisms/ProductList";
import { useCart } from "../contexts/CartContext";
import { useUI } from "../contexts/UIContext";
import { Heading } from "../components/atoms/Heading";
import { Button } from "../components/atoms/Button";
import { Text } from "../components/atoms/Text";
import "./HomePage.css";

export function HomePage() {
  const { addItem } = useCart();
  const { dispatch } = useUI();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const pageFromQuery = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;
  const pageSize = 10;

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products", searchQuery || "all", currentPage],
    queryFn: () => (searchQuery
      ? searchProductsPaginated(searchQuery, { page: currentPage, limit: pageSize })
      : fetchProductsPaginated({ page: currentPage, limit: pageSize })),
  });

  const products = data?.products || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalResults: products.length,
    hasNext: false,
    hasPrev: false,
  };

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

  const updatePage = (nextPage) => {
    const normalizedPage = Math.max(nextPage, 1);
    const nextParams = new URLSearchParams(searchParams);

    if (normalizedPage <= 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(normalizedPage));
    }

    setSearchParams(nextParams);
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
          <>
            <ProductList products={products} onAddToCart={handleAddToCart} />

            {pagination.totalPages > 1 && (
              <div className="home-pagination" data-testid="home-pagination">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => updatePage(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  data-testid="home-pagination-prev"
                >
                  Anterior
                </Button>
                <span className="home-pagination__text" data-testid="home-pagination-text">
                  Pagina {pagination.currentPage} de {pagination.totalPages}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => updatePage(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  data-testid="home-pagination-next"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
