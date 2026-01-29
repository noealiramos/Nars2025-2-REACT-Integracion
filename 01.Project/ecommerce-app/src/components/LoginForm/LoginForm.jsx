import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Input from "../common/Input";
import "./LoginForm.css";

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(email, password);
      if (result) {
        onSuccess();
        window.location.reload();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        <form className="login-form" onSubmit={onSubmit}>
          <div className="form-group">
            <Input
              id="email"
              label="Email: "
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Ingresa tu email"
              required
            />
          </div>
          <div className="form-group">
            <Input
              id="password"
              label="Contraseña: "
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button disabled={loading} type="submit" variant="primary">
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
        <div className="login-footer">
          <Link to="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
