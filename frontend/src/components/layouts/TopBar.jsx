import { useState } from "react";
import { LogOut, User, Bell, Settings } from "lucide-react";

function TopBar({ onLogout, user }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="w-auto h-16 bg-white shadow-md flex justify-end items-center px-8">
      {/* User info y controles */}
      <div className="flex items-center space-x-4">
        {/* Notificaciones */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <div className="text-end">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || "Admin Principal"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role || "Administrador"}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  {user?.empresa || "Yacu Selva"}
                </p>
              </div>

              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Configuración de cuenta</span>
              </button>

              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
