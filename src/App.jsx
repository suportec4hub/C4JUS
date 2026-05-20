import { useState, useEffect } from "react";
import { globalCSS } from "./constants/theme";
import { mockUser } from "./constants/mockData";
import Shell from "./components/Shell";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("c4jus-theme") || "light");

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "c4jus-global";
    style.textContent = globalCSS;
    document.head.appendChild(style);
    return () => document.getElementById("c4jus-global")?.remove();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("c4jus-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  // MVP: usuário genérico sem autenticação
  // Quando o Supabase estiver configurado, adicionar login aqui
  return (
    <Shell
      user={mockUser}
      theme={theme}
      toggleTheme={toggleTheme}
    />
  );
}
