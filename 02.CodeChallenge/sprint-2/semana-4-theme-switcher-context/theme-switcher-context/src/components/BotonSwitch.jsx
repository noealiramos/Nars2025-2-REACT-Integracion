import useTheme from "../hooks/useTheme";
import "../styles/button.css";

export default function BotonSwitch() {
  const { theme, themePreference, setThemePreference } = useTheme();

  const cyclePreference = () => {
    setThemePreference((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "auto";
      return "light";
    });
  };

  const label =
    themePreference === "auto"
      ? `🖥️ Auto (${theme})`
      : themePreference === "light"
      ? "☀️ Light"
      : "🌙 Dark";

  return (
    <button className="theme-btn" onClick={cyclePreference} type="button">
      {label}
    </button>
  );
}
