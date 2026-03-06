import { Skeleton } from "../atoms/Skeleton";
import "./ProductCardSkeleton.css";

/**
 * ProductCardSkeleton Molecule
 * Sigue el patrón de Atomic Design como una Molecule.
 * Representa el estado de carga de una tarjeta de producto.
 */
export function ProductCardSkeleton() {
    return (
        <div className="product-card-skeleton">
            <Skeleton height="230px" className="product-card-skeleton__image" />
            <div className="product-card-skeleton__body">
                <Skeleton width="80%" height="1.2rem" className="product-card-skeleton__title" />
                <Skeleton width="40%" height="0.8rem" className="product-card-skeleton__meta" />
                <Skeleton width="30%" height="1.1rem" className="product-card-skeleton__price" />
                <div className="product-card-skeleton__actions">
                    <Skeleton width="100%" height="2.5rem" borderRadius="999px" />
                </div>
            </div>
        </div>
    );
}
