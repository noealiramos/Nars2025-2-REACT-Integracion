import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/auth";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Input from "../common/Input";
import "./RegisterForm.css";

export default function RegisterForm({ onSuccess }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return email.match(
      ///nomclatura para validar correo
    );

  };
  
  const validateForm = ()=> {
    if(validateEmail(email)) {
      setError("para que el email que capturaste es incorrecto");
      return false;
    }

  };
  
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      debugger;
      const result = await register({ displayName, email, password });
      onSuccess();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registrar usuario</h2>
        <form className="register-form" onSubmit={onSubmit}>
          <div className="form-group">
            <Input
              id="displayName"
              label="Display Name: "
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Ingresa tu nombre completo"
              required
            />
          </div>
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
        <div className="register-footer">
          <Link to="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
