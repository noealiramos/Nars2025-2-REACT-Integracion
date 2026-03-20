import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import "./SiteHeader.css";

export function SiteHeader() {
  // 👇 ahora también traemos clearCart
  const { totalItems, clearCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link to="/" className="site-header__brand">
          <img
            src="/LogoPrincipaldePagina.png"
            alt="Ramdi Jewerly"
            className="site-header__logo"
          />
          <div className="site-header__brand-text">
            <span className="site-header__brand-name">Ramdi Jewerly</span>
            <span className="site-header__brand-tagline">
              Joyería elegante y accesible
            </span>
          </div>
        </Link>

        <nav className="site-header__nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              "site-header__link" + (isActive ? " site-header__link--active" : "")
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              "site-header__link site-header__link--icon" +
              (isActive ? " site-header__link--active" : "")
            }
          >
            <span className="site-header__icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="site-header__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M2.25 3a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .73.57L5.53 5.5H20.25a.75.75 0 0 1 .73.94l-2 7.5a.75.75 0 0 1-.73.56H8.03l-.3 1.2h11.02a.75.75 0 0 1 0 1.5H7.25a.75.75 0 0 1-.73-.94l.6-2.36-2.1-8.37H3a.75.75 0 0 1-.75-.75Z" />
                <path d="M8.25 19.5A1.75 1.75 0 1 0 10 21.25 1.75 1.75 0 0 0 8.25 19.5Zm8.25 0A1.75 1.75 0 1 0 18.25 21.25 1.75 1.75 0 0 0 16.5 19.5Z" />
              </svg>
              <span>Carrito</span>
              {totalItems > 0 && (
                <span className="site-header__cart-badge">{totalItems}</span>
              )}
            </span>
          </NavLink>

          {isAuthenticated ? (
            <div className="site-header__user">
              <span className="site-header__user-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="site-header__icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.25a9.75 9.75 0 1 0 9.75 9.75A9.76 9.76 0 0 0 12 2.25Zm0 4.5A3 3 0 1 1 9 9.75 3 3 0 0 1 12 6.75Zm0 11.4a7.2 7.2 0 0 1-4.95-1.98 4.72 4.72 0 0 1 4.95-3.27 4.72 4.72 0 0 1 4.95 3.27A7.2 7.2 0 0 1 12 18.15Z" />
                </svg>
                <span>
                  Hola,{" "}
                  <span className="site-header__user-name">{user?.name}</span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  // 🔥 al cerrar sesión también limpiamos el carrito
                  clearCart();
                  logout();
                }}
                className="site-header__logout"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                "site-header__link" + (isActive ? " site-header__link--active" : "")
              }
            >
              Iniciar sesión
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
