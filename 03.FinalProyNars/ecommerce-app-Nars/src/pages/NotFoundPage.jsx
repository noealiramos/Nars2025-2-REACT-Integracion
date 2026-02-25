import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export function NotFoundPage() {
  return (
    <main className="page notfound-page">
      <div className="container notfound-page__content">
        <h1>404</h1>
        <p>La página que buscas no existe en Ramdi Jewerly.</p>
        <Link to="/" className="notfound-page__button">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}