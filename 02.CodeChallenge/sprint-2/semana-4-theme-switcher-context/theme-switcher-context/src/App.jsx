import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./Layout";
import "./styles/app.css";

export default function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}
