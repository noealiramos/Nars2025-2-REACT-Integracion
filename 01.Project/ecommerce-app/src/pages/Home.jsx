import { useEffect, useState } from "react";
import BannerCarousel from "../components/BannerCarousel";
import List from "../components/List/List";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading";
import homeImages from "../data/homeImages.json";
import { getProducts } from "../services/productService";
import Button from "../components/common/Button";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [display, setDisplay] = useState("grid");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsData = await getProducts();
        console.log(productsData);
        setProducts(productsData.products);
      } catch (err) {
        setError("No se pudieron cargar los productos. Intenta más tarde.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page]);

  const toggleDisplay = () => {
    // if (display ==="grid") {
    //   setDisplay("list-vertical");
    // }else{
    //   setDisplay('grid');
    // }

    display === "grid" ? setDisplay("list-vertical") : setDisplay("grid");
  };

  return (
    <div>
      <BannerCarousel banners={homeImages} />
      {loading ? (
        <Loading>Cargando productos...</Loading>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : products.length > 0 ? (
        <div>
          <Button onClick={toggleDisplay}>{display}</Button>
          <List
            title="Productos recomendados"
            products={products}
            layout={display}
          />
        </div>
      ) : (
        <ErrorMessage>No hay productos en el catálogo</ErrorMessage>
      )}
    </div>
  );
}
