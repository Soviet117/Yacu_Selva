// src/components/layouts/MainLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import TopBar from "./TopBar";

function MainLayout({ onLogout, user, userModules }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Overlay para móvil cuando el menú está abierto */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Menú lateral - Responsivo */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Menu
          onLogout={onLogout}
          user={user}
          userModules={userModules}
          onCloseMenu={() => setMenuOpen(false)}
        />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 w-full lg:w-auto">
        {/* TopBar con botón hamburguesa */}
        <TopBar
          onLogout={onLogout}
          user={user}
          onMenuToggle={() => setMenuOpen(!menuOpen)}
          isMenuOpen={menuOpen}
        />

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Outlet renderiza el componente de la ruta actual */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
