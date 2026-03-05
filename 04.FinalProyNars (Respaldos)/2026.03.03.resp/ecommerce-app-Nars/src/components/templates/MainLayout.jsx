import { SiteHeader } from "../organisms/SiteHeader";

export function MainLayout({ children }) {
    return (
        <div className="app-root">
            <SiteHeader />
            <main className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
                {children}
            </main>
            <footer className="container" style={{ marginTop: "auto", padding: "2rem 1rem", borderTop: "1px solid var(--border)", textAlign: "center", color: "var(--muted)" }}>
                <p>&copy; {new Date().getFullYear()} Ramdi Jewerly. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}
