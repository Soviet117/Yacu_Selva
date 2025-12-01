import Menu from "../components/layouts/Menu";
import TopBar from "../components/layouts/TopBar";
import StartConf from "../components/sections/StartConf";
import EndConf from "../components/sections/EndConf";
import UserManagement from "../components/sections/UserManagement";
import ThemeToggle from "../components/ui/Themetoggle";
import { useState } from "react";

function Configuraciones({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex">
      <Menu onLogout={onLogout} user={user} />
      <div className="h-screen flex-grow overflow-auto">
        <TopBar onLogout={onLogout} user={user} />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-3xl font-semibold">Configuración</p>
            <ThemeToggle />
          </div>

          {/* Tabs de navegación */}
          <div className="flex space-x-4 mb-6 border-b">
            <button
              className={`pb-2 px-4 ${
                activeTab === "general"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("general")}
            >
              ⚙️ General
            </button>
            <button
              className={`pb-2 px-4 ${
                activeTab === "usuarios"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("usuarios")}
            >
              👥 Gestión de Usuarios
            </button>
            <button
              className={`pb-2 px-4 ${
                activeTab === "seguridad"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("seguridad")}
            >
              🔒 Seguridad
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

            {activeTab === "seguridad" && (
              <div className="grid grid-cols-2 gap-6">
                <EndConf />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuraciones;
