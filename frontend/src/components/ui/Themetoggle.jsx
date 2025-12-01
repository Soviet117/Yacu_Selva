import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

function ThemeToggle({ showLabel = false }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Cargar preferencia del localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
    >
      {darkMode ? (
        <Sun className="h-4 w-4 text-yellow-500" />
      ) : (
        <Moon className="h-4 w-4 text-gray-600" />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {darkMode ? "Modo Claro" : "Modo Oscuro"}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
