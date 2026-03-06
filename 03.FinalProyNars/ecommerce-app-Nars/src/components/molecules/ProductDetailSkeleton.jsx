import { Skeleton } from "../atoms/Skeleton";
import "./ProductDetailSkeleton.css";

/**
 * ProductDetailSkeleton Molecule
 * Sigue el patrón de Atomic Design como una Molecule.
 * Representa el estado de carga del detalle de un producto.
 */
export function ProductDetailSkeleton() {
    return (
        <div className="product-detail-skeleton">
            <div className="product-detail-skeleton__media">
                <Skeleton height="400px" />
            </div>
            <div className="product-detail-skeleton__info">
                <Skeleton width="60%" height="2.5rem" className="mb-4" />
                <Skeleton width="100%" height="1rem" className="mb-2" />
                <Skeleton width="100%" height="1rem" className="mb-2" />
                <Skeleton width="80%" height="1rem" className="mb-8" />

                <div className="product-detail-skeleton__meta">
                    <Skeleton width="40%" height="0.8rem" className="mb-2" />
                    <Skeleton width="35%" height="0.8rem" className="mb-2" />
                    <Skeleton width="45%" height="0.8rem" className="mb-2" />
                </div>

                <Skeleton width="30%" height="2rem" className="my-8" />

                <div className="product-detail-skeleton__actions">
                    <Skeleton width="200px" height="3rem" borderRadius="var(--radius)" />
                </div>
            </div>
        </div>
    );
}
