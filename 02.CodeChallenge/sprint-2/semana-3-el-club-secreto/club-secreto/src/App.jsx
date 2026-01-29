import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import SecretClub from "./components/SecretClub";

export default function App() {
  const { isAuth } = useAuth();

  // Condicional tipo “portero”
  if (isAuth) return <SecretClub />;

  return <Login />;
}
