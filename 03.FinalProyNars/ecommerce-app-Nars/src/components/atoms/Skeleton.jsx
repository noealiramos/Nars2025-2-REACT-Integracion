import "./Skeleton.css";

/**
 * Skeleton Atom
 * Sigue el patrón de Atomic Design como un Atom.
 * Un bloque que parpadea para simular carga de contenido.
 */
export function Skeleton({ width, height, borderRadius, className = "", variant = "rect" }) {
    const styles = {
        width: width || "100%",
        height: height || "1rem",
        borderRadius: borderRadius || (variant === "circle" ? "50%" : "var(--r2)"),
    };

    return (
        <div
            className={`skeleton skeleton--${variant} ${className}`}
            style={styles}
            aria-hidden="true"
        />
    );
}
