import { useState, useEffect } from "react";
import { fetchCategories } from "../services/categoryService";

export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        fetchCategories()
            .then((data) => {
                if (mounted) setCategories(data);
            })
            .catch((err) => {
                if (mounted) setError(err.message || "Error al cargar categorías");
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    return { categories, loading, error };
}
