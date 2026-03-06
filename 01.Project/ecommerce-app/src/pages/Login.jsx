import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm/LoginForm";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const message = location.state?.message;

  return (
    <div className="login-page">
      {message && <p className="success-message" style={{ color: "green", textAlign: "center", marginBottom: "10px" }}>{message}</p>}
      <LoginForm onSuccess={() => navigate(from, { replace: true })} />
    </div>
  );
}
