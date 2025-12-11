// pages/Configuraciones.jsx
import { useState } from "react";
import StartConf from "../components/sections/StartConf";
import EndConf from "../components/sections/EndConf";
import UserManagement from "../components/sections/UserManagement";
import ThemeToggle from "../components/ui/Themetoggle";

function Configuraciones({ user }) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <p className="text-3xl font-semibold dark:text-white">Configuración</p>
        <ThemeToggle />
      </div>

      {/* Tabs de navegación */}
      <div className="flex space-x-4 mb-6 border-b dark:border-gray-700">
        <button
          className={`pb-2 px-4 ${
            activeTab === "general"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("general")}
        >
          ⚙️ General
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === "usuarios"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("usuarios")}
        >
          👥 Gestión de Usuarios
        </button>
      </div>

      {/* Contenido de las tabs */}
      <div className="grid grid-cols-1 gap-6">
        {activeTab === "general" && (
          <div className="grid grid-cols-1 gap-6">
            <StartConf />
          </div>
        )}

        {activeTab === "usuarios" && <UserManagement currentUser={user} />}
      </div>
    </div>
  );
}

export default Configuraciones;
