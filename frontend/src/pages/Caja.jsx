import Menu from "../components/layouts/Menu";
import TopBar from "../components/layouts/TopBar";
import StartCaja from "../components/sections/StartCaja";
import SecctionTablaCaja from "../components/sections/SecctionTablaCaja";

function Caja() {
  return (
    <div className="flex items-center">
      <Menu />
      <div className="h-screen flex-grow">
        <TopBar />
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
