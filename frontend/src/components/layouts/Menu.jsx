import { useState, useEffect } from "react";
import NavListMenu from "../ui/NavListMenu";
import EncabezadoMenu from "../ui/EncabezadoMenu";
import { LogOut, User } from "lucide-react";
import axios from "axios";

function Menu({ onLogout, user, userModules = [] }) {
  const [allowedModules, setAllowedModules] = useState(userModules || []);
  const [loadingModules, setLoadingModules] = useState(true);

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
      moduleName: "Dashboard",
      alwaysShow: true,
    },
    { url: "/entregas", text: "Entregas", moduleName: "Registro de salidas" },
    { url: "/caja", text: "Caja", moduleName: "Caja" },
    { url: "/reportes", text: "Reportes", moduleName: "Reportes" },
    {
      url: "/trabajadores",
      text: "Trabajadores",
      moduleName: "Gestión de trabajadores",
    },
    {
      url: "/conf",
      text: "Configuraciones",
      moduleName: "Gestión de usuarios",
    },
  ];

  // Filtrar elementos del menú
  const filteredMenuItems = menuItems.filter((item) => {
    // SIEMPRE mostrar Inicio
    if (item.alwaysShow) return true;

    // Si es administrador, mostrar todo
    if (user?.tipo_usuario === "Administrador") {
      return true;
    }

    // Si aún está cargando, no mostrar (excepto inicio)
    if (loadingModules) {
      return false;
    }

    // Verificar si el módulo está en los permitidos
    return allowedModules.some(
      (module) => module.nom_modulo === item.moduleName
    );
  });

  return (
    <div className="h-screen flex flex-col bg-white shadow-xl border-r-2 border-gray-100 w-64">
      <EncabezadoMenu
        span={"YS"}
        negocio={"Yacu Selva"}
        tipo={"Sistema de Gestión"}
      />

      <div className="flex flex-col flex-1">
        {filteredMenuItems.map((item, index) => (
          <NavListMenu key={index} url={item.url} text={item.text} />
        ))}
      </div>

      {/* Sección de usuario - SIEMPRE visible */}
      <div className="bg-gray-50 rounded-xl m-3 p-4 mt-auto border border-gray-200">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {userData.nombre}
            </p>
            <p className="text-xs text-gray-500 truncate">{userData.rol}</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-3">{userData.email}</p>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

export default Menu;
