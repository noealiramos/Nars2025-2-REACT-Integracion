import { useState, useEffect } from "react";
import { fetchProducts, getProductById } from "../services/productService";

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        fetchProducts()
            .then((data) => {
                if (mounted) setProducts(data);
            })
            .catch((err) => {
                if (mounted) setError(err.message || "Error al cargar productos");
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    return { products, loading, error };
}

export function useProduct(id) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        let mounted = true;
        setLoading(true);

        getProductById(id)
            .then((data) => {
                if (!mounted) return;
                if (!data) {
                    setError("Producto no encontrado");
                } else {
                    setProduct(data);
                }
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
