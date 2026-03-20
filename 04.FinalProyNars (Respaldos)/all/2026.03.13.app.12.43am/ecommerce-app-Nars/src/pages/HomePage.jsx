import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import { ProductList } from "../components/organisms/ProductList";
import { useCart } from "../contexts/CartContext";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import "./HomePage.css";

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .catch(() => {
        if (mounted) setError("No se pudieron cargar los productos.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

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
        {loading && <p className="page__status">Cargando productos...</p>}
        {error && <p className="page__status page__status--error">{error}</p>}
        {!loading && !error && (
          <ProductList products={products} onAddToCart={handleAddToCart} />
        )}
      </section>
    </main>
  );
}