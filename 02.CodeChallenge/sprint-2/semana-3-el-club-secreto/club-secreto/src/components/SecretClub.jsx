import { useAuth } from "../context/AuthContext";

export default function SecretClub() {
  const { user, lastAccess, logout, resetAll } = useAuth();

  const formatted = lastAccess
    ? new Date(lastAccess).toLocaleString()
    : "Sin registro";

  return (
    <div style={styles.card}>
      <h1>Bienvenido al club secreto ✨</h1>

      <p>
        Hola, <b>{user || "invitado"}</b> 😎
      </p>

      <p>
        Último acceso: <b>{formatted}</b>
      </p>

      <div style={styles.row}>
        <button style={styles.button} onClick={logout}>
          Salir
        </button>

        <button style={styles.buttonAlt} onClick={resetAll}>
          Reset (pruebas)
        </button>
      </div>

      <p style={styles.note}>
        Si recargas (F5) y sigues viendo esto, dominaste persistencia con localStorage ✅
      </p>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 520,
    margin: "40px auto",
    padding: 20,
    border: "1px solid #333",
    borderRadius: 12,
  },
  row: { display: "flex", gap: 10, marginTop: 16 },
  button: { flex: 1, padding: 10, borderRadius: 8, border: "none", cursor: "pointer" },
  buttonAlt: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #555",
    cursor: "pointer",
    background: "transparent",
  },
  note: { marginTop: 16, opacity: 0.85 },
};
