import { createContext, useContext, useEffect, useState } from "react";
import {
  bootstrapSession,
  clearAuthSession,
  login as authLogin,
  logout as authLogout,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      setLoading(true);

      const result = await bootstrapSession();

      if (!active) return;

      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    initializeAuth();

    // Listener para errores de autenticación (ej: refresh token expirado)
    const handleAuthError = () => {
      clearAuthSession();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    };

    window.addEventListener("auth-error", handleAuthError);
    return () => {
      active = false;
      window.removeEventListener("auth-error", handleAuthError);
    };
  }, []);

  const login = async (email, password) => {
    setError(null);
    const result = await authLogin(email, password);
    if (!result.success) {
      setError(result.error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
    setUser(result.user);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const restoreSession = (nextUser) => {
    setUser(nextUser);
    setIsAuthenticated(Boolean(nextUser));
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
