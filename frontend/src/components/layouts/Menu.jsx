import { useState, useEffect } from "react";
import { X, Menu as MenuIcon, LogOut, User, ChevronLeft } from "lucide-react";
import NavListMenu from "../ui/NavListMenu";
import EncabezadoMenu from "../ui/EncabezadoMenu";
import axios from "axios";

function Menu({ onLogout, user, userModules = [], onCloseMenu }) {
  const [allowedModules, setAllowedModules] = useState(userModules || []);
  const [loadingModules, setLoadingModules] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/database";

  useEffect(() => {
    if (user && user.id_user && !userModules) {
      fetchUserModules();
    } else if (userModules) {
      setAllowedModules(userModules);
      setLoadingModules(false);
    }
  }, [user, userModules]);

  const fetchUserModules = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/user-modules/${user.id_user}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.modules) {
        setAllowedModules(response.data.modules);
      }
    } catch (error) {
      console.error("Error al cargar módulos:", error);
    } finally {
      setLoadingModules(false);
    }
  };

  // Datos del usuario
  const userData = {
    nombre: user?.nombre_completo || user?.nom_user || "Usuario",
    rol: user?.tipo_usuario || "Sin rol",
    email: user?.nom_user || "No especificado",
  };

  // Mapeo de rutas a nombres de módulo
  const menuItems = [
    {
      url: "/inicio",
      text: "Inicio",
      moduleName: "Dashborad",
      alwaysShow: true,
      icon: "🏠",
    },
    {
      url: "/entregas",
      text: "Entregas",
      moduleName: "Registro de salidas",
      icon: "🚚",
    },
    {
      url: "/caja",
      text: "Caja",
      moduleName: "Caja",
      icon: "💰",
    },
    {
      url: "/reportes",
      text: "Reportes",
      moduleName: "Reportes",
      icon: "📊",
    },
    {
      url: "/trabajadores",
      text: "Trabajadores",
      moduleName: "Gestion de trabajadores",
      icon: "👥",
    },
    {
      url: "/conf",
      text: "Configuraciones",
      moduleName: "Gestion de usuarios",
      icon: "⚙️",
    },
  ];

  // Filtrar elementos del menú
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.alwaysShow) return true;
    if (user?.tipo_usuario === "Administrador") return true;
    if (loadingModules) return false;
    return allowedModules.some(
      (module) => module.nom_modulo === item.moduleName
    );
  });

  return (
    <div
      className={`h-screen flex flex-col bg-white dark:bg-gray-800 shadow-xl border-r-2 border-gray-100 dark:border-gray-700 ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      {/* Botón para colapsar/expandir (solo escritorio) */}
      <div className="hidden lg:flex justify-end p-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeft
            className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Botón cerrar para móvil */}
      <div className="lg:hidden flex justify-end p-4">
        <button
          onClick={onCloseMenu}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <EncabezadoMenu
        span={"YS"}
        negocio={"Yacu Selva"}
        tipo={"Sistema de Gestión"}
        isCollapsed={isCollapsed}
      />

      <div className="flex flex-col flex-1 px-2">
        {filteredMenuItems.map((item, index) => (
          <NavListMenu
            key={index}
            url={item.url}
            text={item.text}
            icon={item.icon}
            isCollapsed={isCollapsed}
            onClick={onCloseMenu}
          />
        ))}
      </div>

      {/* Sección de usuario */}
      <div
        className={`bg-gray-50 dark:bg-gray-900 rounded-xl m-3 p-4 mt-auto border border-gray-200 dark:border-gray-700 ${
          isCollapsed ? "hidden" : "block"
        }`}
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
              {userData.nombre}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {userData.rol}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
          {userData.email}
        </p>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Versión colapsada del usuario */}
      {isCollapsed && (
        <div className="m-3">
          <button
            onClick={onLogout}
            className="w-full p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex justify-center"
            title="Cerrar Sesión"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;
