// TopBar.jsx - actualizado con modo oscuro, responsividad y hamburguesa
import { useState } from "react";
import { LogOut, User, Bell, Settings, Menu, X, Sun, Moon } from "lucide-react";
import { useUser } from "../hooks/useUser";

function TopBar({ onLogout, user, onMenuToggle, isMenuOpen }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userData = useUser(user);

  // Estado para tema oscuro (si no tienes ya un contexto global)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  const toggleDarkMode = () => {
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
    <div className="w-full h-16 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center px-4 lg:px-8 border-b border-gray-200 dark:border-gray-700">
      {/* Lado izquierdo - Botón hamburguesa y logo móvil */}
      <div className="flex items-center space-x-4">
        {/* Botón hamburguesa para móvil/tablet */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* Logo para móvil */}
        <div className="lg:hidden flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">YS</span>
          </div>
          <span className="font-semibold text-gray-800 dark:text-white text-sm">
            Yacu Selva
          </span>
        </div>
      </div>

      {/* Lado derecho - Acciones del usuario */}
      <div className="flex items-center space-x-3 lg:space-x-4">
        {/* Botón tema oscuro/claro */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors hidden sm:block"
          title={darkMode ? "Modo claro" : "Modo oscuro"}
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notificaciones */}
        <button className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User dropdown - Versión compacta para móvil */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 lg:space-x-3 p-1 lg:p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
          >
            {/* Texto solo en desktop */}
            <div className="hidden lg:block text-end">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {userData.nombre}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userData.rol}
              </p>
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <>
              {/* Overlay para cerrar al hacer clic fuera */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />

              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                {/* Info usuario */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {userData.nombre}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userData.email}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                    {userData.empresa}
                  </p>
                </div>

                {/* Configuración cuenta */}
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Configuración de cuenta</span>
                </button>

                {/* Tema oscuro/claro (versión móvil) */}
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 sm:hidden"
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span>{darkMode ? "Modo claro" : "Modo oscuro"}</span>
                </button>

                {/* Cerrar sesión */}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
