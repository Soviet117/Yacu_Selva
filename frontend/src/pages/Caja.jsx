import Menu from "../components/layouts/Menu";
import TopBar from "../components/layouts/TopBar";
import StartCaja from "../components/sections/StartCaja";
import SecctionTablaCaja from "../components/sections/SecctionTablaCaja";

function Caja({ onLogout, user }) {
  return (
    <div className="flex">
      <Menu onLogout={onLogout} user={user} />
      <div className="h-screen flex-grow overflow-auto">
        <TopBar onLogout={onLogout} user={user} />
        <div className="p-6">
          <p className="text-3xl font-semibold mb-3">GESTIÓN DE CAJA</p>
          <StartCaja />
          <SecctionTablaCaja />
        </div>
      </div>
    </div>
  );
}

export default Caja;
