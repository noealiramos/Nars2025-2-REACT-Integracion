import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput } from "../components/atoms/TextInput";
import { Button } from "../components/atoms/Button";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import { authApi } from "../api/authApi";
import { STORAGE_KEYS } from "../utils/storageHelpers";
import { useAuth } from "../contexts/AuthContext";
import "./LoginPage.css"; // Reusamos estilos base de login

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { login } = useAuth(); // Podríamos hacer auto-login después de registro

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await authApi.register({ displayName: name, email, password });
      
      // Auto-login después de registro exitoso
      const loginOk = await login(email, password);
      if (loginOk) {
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la cuenta. Intenta con otro correo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page login-page">
      <section className="login-card container">
        <Heading level={2} align="center">
          Crear cuenta
        </Heading>
        <Text className="login-card__hint">
          Únete a la familia Ramdi Jewelry para una mejor experiencia.
        </Text>

        <form onSubmit={handleSubmit} className="login-form">
          <TextInput
            id="name"
            label="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
            data-testid="input-name"
          />
          <TextInput
            id="email"
            type="email"
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            required
            data-testid="input-email"
          />
          <TextInput
            id="password"
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            data-testid="input-password"
          />

          {error && <p className="login-form__error">{error}</p>}

          <Button 
            type="submit" 
            className="login-form__button" 
            disabled={submitting}
            data-testid="btn-crear-cuenta"
          >
            {submitting ? "Creando..." : "Registrarme"}
          </Button>

          <footer className="login-form__footer">
            <Text size="sm">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </Text>
          </footer>
        </form>
      </section>
    </main>
  );
}
