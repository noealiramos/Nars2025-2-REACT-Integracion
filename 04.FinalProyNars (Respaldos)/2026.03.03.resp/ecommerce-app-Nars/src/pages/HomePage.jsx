import { useProducts } from "../hooks/useProducts";
import { ProductList } from "../components/organisms/ProductList";
import { useCart } from "../contexts/CartContext";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import "./HomePage.css";

export function HomePage() {
  const { products, loading, error } = useProducts();
  const { addItem } = useCart();

  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  return (
    <div className="home-page">
      <section className="home-hero">
        <Heading level={1}>Colección Ramdi Jewerly</Heading>
        <Text className="home-hero__text">
          Joyería de moda y accesorios para mujeres, hombres y niños. Piezas con baño de
          oro, plata, resina y pedrería de alta calidad a precios accesibles.
        </Text>
      </section>

      <section className="home-products">
        {loading && <p className="page__status">Cargando productos...</p>}
        {error && <p className="page__status page__status--error">{error}</p>}
        {!loading && !error && (
          <ProductList products={products} onAddToCart={handleAddToCart} />
        )}
      </section>
    </div>
  );
}