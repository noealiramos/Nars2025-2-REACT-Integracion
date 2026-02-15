import Header from "./components/Header";
import useTheme from "./hooks/useTheme";

export default function Layout() {
  const { theme, themePreference } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <div className="layout">
        <Header />

        <main className="content">
          <h2>Theme Switcher (Context)</h2>
          <p>
            Tema actual (resuelto): <b>{theme}</b> — Preferencia:{" "}
            <b>{themePreference}</b>
          </p>

          <section className="card">
            <h3>Objetivo</h3>
            <p>
              Context API + localStorage + auto (prefiere el tema del sistema).
            </p>
          </section>
        </main>

        <footer className="footer">Hecho con React + Vite ✅</footer>
      </div>
    </div>
  );
}
