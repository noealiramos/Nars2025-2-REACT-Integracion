import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, login as authLogin, logout as authLogout } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (current) {
      setUser(current);
      setIsAuthenticated(true);
    }
    setLoading(false);
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
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
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