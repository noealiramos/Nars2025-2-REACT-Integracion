import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function GuestOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="page page--center">
        <p>Cargando sesión...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
