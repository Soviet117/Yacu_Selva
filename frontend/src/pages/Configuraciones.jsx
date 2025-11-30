import Menu from "../components/layouts/Menu";
import TopBar from "../components/layouts/TopBar";
import StartConf from "../components/sections/StartConf";
import EndConf from "../components/sections/EndConf";

function Configuraciones({ onLogout, user }) {
  return (
    <div className="flex">
      <Menu onLogout={onLogout} user={user} />
      <div className="h-screen flex-grow overflow-auto">
        <TopBar onLogout={onLogout} user={user} />
        <div className="p-6">
          <p className="text-3xl font-semibold mb-3">Configuración</p>
          <div className="grid grid-cols-2 gap-4">
            <StartConf />
            <EndConf />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuraciones;
