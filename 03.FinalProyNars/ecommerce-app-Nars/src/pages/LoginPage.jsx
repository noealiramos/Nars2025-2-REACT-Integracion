import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextInput } from "../components/atoms/TextInput";
import { Button } from "../components/atoms/Button";
import { Heading } from "../components/atoms/Heading";
import { Text } from "../components/atoms/Text";
import { useAuth } from "../contexts/AuthContext";
import { validateEmail } from "../utils/validationHelpers";
import "./LoginPage.css";

/**
 * LoginPage Page
 * Permite a los usuarios autenticarse para realizar compras o ver su historial.
 */
export function LoginPage() {
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState("ali.ramos@mail.com");
  const [password, setPassword] = useState("123456");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const validate = () => {
    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = "Por favor ingresa un correo electrónico válido";
    }
    if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);

    if (ok) {
      navigate(from, { replace: true });
    }
  };

  return (
    <main className="page login-page">
      <section className="login-card container-narrow">
        <div className="card login-card__inner">
          <Heading level={2} align="center">
            ¡Qué bueno verte de nuevo!
          </Heading>
          <Text className="login-card__hint" align="center">
            Ingresa tus credenciales para continuar con tu experiencia Ramdi.
          </Text>

          <form onSubmit={handleSubmit} className="login-form">
            <TextInput
              id="email"
              type="email"
              label="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              error={errors.email}
              required
            />
            <TextInput
              id="password"
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={errors.password}
              required
            />

            {authError && (
              <div className="login-form__auth-error">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            <Button
              type="submit"
              className="login-form__button"
              disabled={submitting}
              fullWidth
            >
              {submitting ? "Iniciando sesión..." : "Entrar"}
            </Button>
          </form>

          <div className="login-card__footer">
            <p>¿No tienes cuenta? <a href="#">Regístrate aquí</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}