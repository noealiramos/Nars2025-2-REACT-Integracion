import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextInput } from "../components/atoms/TextInput";
import { Button } from "../components/atoms/Button";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import { useAuth } from "../contexts/AuthContext";
import { validateLoginForm } from "../utils/formValidators";
import "./LoginPage.css";

export function LoginPage() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("ali.ramos@mail.com");
  const [password, setPassword] = useState("123456");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextValidationError = validateLoginForm({ email, password });
    if (nextValidationError) {
      setValidationError(nextValidationError);
      return;
    }

    setValidationError(null);
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) {
      navigate(from, { replace: true });
    }
  };

  return (
    <main className="page login-page">
      <section className="login-card container">
        <Heading level={2} align="center">
          Iniciar sesión
        </Heading>
        <Text className="login-card__hint">
          Usa uno de los usuarios de prueba. Por ejemplo:{" "}
          <span className="login-card__example">
            ali.ramos@mail.com / 123456
          </span>
        </Text>
        <form onSubmit={handleSubmit} className="login-form">
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
            placeholder="••••••••"
            required
            data-testid="input-password"
          />
          {(validationError || error) && <p className="login-form__error">{validationError || error}</p>}
          <Button 
            type="submit" 
            className="login-form__button" 
            disabled={submitting}
            data-testid="btn-entrar"
          >
            {submitting ? "Validando..." : "Entrar"}
          </Button>
        </form>
      </section>
    </main>
  );
}
