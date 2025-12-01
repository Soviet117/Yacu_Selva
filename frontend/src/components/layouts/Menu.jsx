// Menu.jsx - actualizado
import NavListMenu from "../ui/NavListMenu";
import EncabezadoMenu from "../ui/EncabezadoMenu";
import { LogOut, User } from "lucide-react";

function Menu({ onLogout, user }) {
  // Datos del usuario con valores por defecto
  const userData = {
    nombre: user?.nombre_completo || user?.nom_user || "Usuario",
    rol: user?.tipo_usuario || "Administrador",
    email: user?.nom_user || "usuario@yacuselva.com",
  };

  return (
    <div className="h-screen flex flex-col bg-white shadow-xl border-r-2 border-gray-100 w-64">
      <EncabezadoMenu
        span={"YS"}
        negocio={"Yacu Selva"}
        tipo={"Sistema de Gestión"}
      />

      <div className="flex flex-col flex-1">
        <NavListMenu url={"/inicio"} text={"Inicio"} />
        <NavListMenu url={"/entregas"} text={"Entregas"} />
        <NavListMenu url={"/caja"} text={"Caja"} />
        <NavListMenu url={"/reportes"} text={"Reportes"} />
        <NavListMenu url={"/trabajadores"} text={"Trabajadores"} />
        <NavListMenu url={"/conf"} text={"Configuraciones"} />
      </div>

      {/* Sección de usuario en el menú */}
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
