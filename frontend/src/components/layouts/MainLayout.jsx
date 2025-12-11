// src/components/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import TopBar from "./TopBar";

function MainLayout({ onLogout, user, userModules }) {
  return (
    <div className="flex">
      <Menu onLogout={onLogout} user={user} userModules={userModules} />
      <div className="h-screen flex-grow overflow-auto">
        <TopBar onLogout={onLogout} user={user} />
        <div className="p-6">
          {/* Outlet renderiza el componente de la ruta actual */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
