import { useState, useEffect, useCallback } from "react";
import { fetchProducts, getProductById, getProductsByCategory } from "../services/productService";

export function useProducts(params = {}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Serializar params para el dependency array de useCallback
    const paramsKey = JSON.stringify(params);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProducts(params);
            setProducts(data);
        } catch (err) {
            setError(err.message || "Error al cargar los productos");
        } finally {
            setLoading(false);
        }
    }, [paramsKey]);

    const loadByCategory = useCallback(async (categoryId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProductsByCategory(categoryId);
            setProducts(data);
        } catch (err) {
            setError(err.message || "Error al cargar los productos de la categoría");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return {
        products,
        loading,
        error,
        loadProducts,
        loadByCategory
    };
}

export function useProduct(id) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        let mounted = true;
        setLoading(true);
        setError(null);

        getProductById(id)
            .then((data) => {
                if (mounted) setProduct(data);
            })
            .catch((err) => {
                if (mounted) setError(err.message || "Error al cargar el producto");
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [id]);

    return { product, loading, error };
}
