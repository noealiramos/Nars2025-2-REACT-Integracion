import { useLocation } from "react-router-dom";
import { SiteHeader } from "../organisms/SiteHeader";
import { CategoryBar } from "../molecules/CategoryBar";
import "./MainLayout.css";

/**
 * MainLayout Template
 * Sigue el patrón de Atomic Design como un Template.
 * Define la estructura global de la aplicación.
 */
export function MainLayout({ children }) {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <div className="main-layout">
            <SiteHeader />
            {/* Solo mostramos la barra de categorías en la Home para no distraer en Checkout/Login */}
            {isHomePage && <CategoryBar />}
            <main className="main-layout__content container">
                {children}
            </main>
            <footer className="main-layout__footer container">
                <p>&copy; {new Date().getFullYear()} Ramdi Jewerly. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}
