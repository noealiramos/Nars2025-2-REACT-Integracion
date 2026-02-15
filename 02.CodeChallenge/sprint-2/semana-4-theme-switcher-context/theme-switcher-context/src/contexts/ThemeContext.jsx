import { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext(null);

const STORAGE_KEY = "theme_preference"; // 'light' | 'dark' | 'auto'

function getSystemTheme() {
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(preference) {
  return preference === "auto" ? getSystemTheme() : preference;
}

export function ThemeProvider({ children }) {
  const [themePreference, setThemePreference] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "auto") return saved;
    return "light";
  });

  const theme = useMemo(
    () => resolveTheme(themePreference),
    [themePreference]
  );

  // Persistencia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, themePreference);
  }, [themePreference]);

  // Si está en "auto", escuchar cambios del sistema (dark/light)
  useEffect(() => {
    if (themePreference !== "auto") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      // Forzamos re-render cambiando a mismo valor (no funciona),
      // así que solo actualizamos el atributo del DOM con el theme resuelto
      const resolved = media.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", resolved);
    };

    // set inicial
    handler();

    if (media.addEventListener) media.addEventListener("change", handler);
    else media.addListener(handler);

    return () => {
      if (media.removeEventListener) media.removeEventListener("change", handler);
      else media.removeListener(handler);
    };
  }, [themePreference]);

  // Atributos en <html> para debug / CSS hooks si quieres
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-theme-preference", themePreference);
  }, [theme, themePreference]);

  const value = useMemo(
    () => ({
      theme, // tema RESUELTO: 'light' | 'dark'
      themePreference, // preferencia: 'light' | 'dark' | 'auto'
      setThemePreference, // setter de preferencia
    }),
    [theme, themePreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
