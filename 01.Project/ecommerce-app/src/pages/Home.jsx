import { useEffect, useState } from "react";
import BannerCarousel from "../components/BannerCarousel";
import List from "../components/List/List";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading";
import homeImages from "../data/homeImages.json";
import { getProducts } from "../services/productService";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [name,setName]= useState('');
  
  

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

  return (
    <div>
      <BannerCarousel banners={homeImages} />
      {loading ? (
        <Loading>Cargando productos...</Loading>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : products.length > 0 ? (
        <List
          title="Productos recomendados"
          products={products}
          layout="grid"
        />
      ) : (
        <ErrorMessage>No hay productos en el catálogo</ErrorMessage>
      )}
    </div>
  );
}
