import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, attempts, isLocked, lockedUntil } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const remaining = useMemo(() => {
    if (!isLocked) return 0;
    const ms = lockedUntil - Date.now();
    return Math.max(0, Math.ceil(ms / 1000));
  }, [isLocked, lockedUntil]);

  const handleLogin = () => {
    const res = login(username.trim(), password);
    setMsg(res.message);

    if (!res.ok) return;

    // limpia el input (opcional)
    setPassword("");
  };

  return (
    <div style={styles.card}>
      <h2>Acceso restringido 🔒</h2>

      <label style={styles.label}>Usuario</label>
      <input
        style={styles.input}
        type="text"
        placeholder="Ej: ali"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLocked}
      />

      <label style={styles.label}>Contraseña</label>
      <input
        style={styles.input}
        type="password"
        placeholder="Ej: react123"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLocked}
      />

      <button style={styles.button} onClick={handleLogin} disabled={isLocked}>
        Entrar
      </button>

      {msg && <p style={styles.msg}>{msg}</p>}

      <p style={styles.small}>
        Intentos fallidos: <b>{attempts}</b> / 3
      </p>

      {isLocked && (
        <p style={styles.lock}>
          Bloqueado. Intenta de nuevo en <b>{remaining}</b>s
        </p>
      )}

      <p style={styles.hint}>
        Pista: abre DevTools → Application → Local Storage y mira las claves.
      </p>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 420,
    margin: "40px auto",
    padding: 20,
    border: "1px solid #333",
    borderRadius: 12,
  },
  label: { display: "block", marginTop: 12, marginBottom: 6 },
  input: { width: "100%", padding: 10, borderRadius: 8, border: "1px solid #555" },
  button: {
    marginTop: 16,
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
  msg: { marginTop: 12 },
  small: { marginTop: 10, opacity: 0.9 },
  lock: { marginTop: 10, fontWeight: 600 },
  hint: { marginTop: 16, opacity: 0.8, fontSize: 13 },
};
