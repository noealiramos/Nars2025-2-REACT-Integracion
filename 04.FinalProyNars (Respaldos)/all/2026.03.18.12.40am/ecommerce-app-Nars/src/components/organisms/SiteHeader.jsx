import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { Search } from "../molecules/Search";
import { Button } from "../atoms/Button";
import "./SiteHeader.css";

export function SiteHeader() {
  const { totalItems, clearCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (query) => {
    // Implementación futura: navegar a página de resultados
    console.log("Buscando:", query);
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

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

        <Search onSearch={handleSearch} />

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
              "site-header__link" + (isActive ? " site-header__link--active" : "")
            }
            data-testid="nav-cart"
          >
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
              <span className="site-header__cart-badge" data-testid="cart-badge">{totalItems}</span>
            )}
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
                  <span className="site-header__user-name">{user?.displayName}</span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  logout();
                }}
                className="site-header__logout"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  "site-header__link" + (isActive ? " site-header__link--active" : "")
                }
              >
                Inicia sesión
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  "site-header__link" + (isActive ? " site-header__link--active" : "")
                }
              >
                Regístrate
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
