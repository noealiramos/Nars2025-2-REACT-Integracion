import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_KEY = "club_auth"; // sello: "true"
const USER_KEY = "club_user"; // nombre usuario
const LAST_KEY = "club_last_access"; // fecha/hora
const ATTEMPTS_KEY = "club_attempts"; // intentos fallidos
const LOCK_KEY = "club_locked_until"; // timestamp desbloqueo

const AuthContext = createContext(null);

function nowISO() {
  return new Date().toISOString();
}

function readBool(key) {
  return localStorage.getItem(key) === "true";
}

function readInt(key) {
  const v = Number(localStorage.getItem(key));
  return Number.isFinite(v) ? v : 0;
}

export function AuthProvider({ children }) {
  // Inicializa desde localStorage (persistencia real)
  const [isAuth, setIsAuth] = useState(() => readBool(AUTH_KEY));
  const [user, setUser] = useState(() => localStorage.getItem(USER_KEY) || "");
  const [lastAccess, setLastAccess] = useState(
    () => localStorage.getItem(LAST_KEY) || ""
  );

  const [attempts, setAttempts] = useState(() => readInt(ATTEMPTS_KEY));
  const [lockedUntil, setLockedUntil] = useState(
    () => Number(localStorage.getItem(LOCK_KEY)) || 0
  );

  // Mantener estados sincronizados con localStorage (por si cambian)
  useEffect(() => {
    localStorage.setItem(AUTH_KEY, String(isAuth));
  }, [isAuth]);

  useEffect(() => {
    localStorage.setItem(USER_KEY, user);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LAST_KEY, lastAccess);
  }, [lastAccess]);

  useEffect(() => {
    localStorage.setItem(ATTEMPTS_KEY, String(attempts));
  }, [attempts]);

  useEffect(() => {
    if (lockedUntil) localStorage.setItem(LOCK_KEY, String(lockedUntil));
    else localStorage.removeItem(LOCK_KEY);
  }, [lockedUntil]);

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  const login = (username, password) => {
    const VALID_USER = "ali";
    const VALID_PASS = "react123";

    // Si está bloqueado, no permite login
    if (isLocked) {
      return {
        ok: false,
        message: "Bloqueado por intentos. Intenta más tarde.",
      };
    }

    const ok = username === VALID_USER && password === VALID_PASS;

    if (!ok) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 3) {
        // Bloqueo 60s (ajusta si quieres)
        const lockMs = 60_000;
        setLockedUntil(Date.now() + lockMs);
        return { ok: false, message: "Demasiados intentos. Bloqueado 60s." };
      }

      return { ok: false, message: `Credenciales incorrectas (${nextAttempts}/3)` };
    }

    // Login correcto
    setIsAuth(true);
    setUser(username);
    setLastAccess(nowISO());
    setAttempts(0);
    setLockedUntil(0);

    return { ok: true, message: "Acceso concedido." };
  };

  const logout = () => {
    setIsAuth(false);
    // opcional: conservar usuario / lastAccess, pero el reto dice “salir = quitar sello”
    localStorage.removeItem(AUTH_KEY);
  };

  const resetAll = () => {
    // útil para pruebas
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LAST_KEY);
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(LOCK_KEY);

    setIsAuth(false);
    setUser("");
    setLastAccess("");
    setAttempts(0);
    setLockedUntil(0);
  };

  const value = useMemo(
    () => ({
      isAuth,
      user,
      lastAccess,
      attempts,
      isLocked,
      lockedUntil,
      login,
      logout,
      resetAll,
    }),
    [isAuth, user, lastAccess, attempts, isLocked, lockedUntil]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
