import Menu from "../components/layouts/Menu";
import TopBar from "../components/layouts/TopBar";
import GraficoDashboard from "../components/sections/GraficoDashboard";
import InicioDashboard from "../components/sections/InicioDashboard";
import EndDashboard from "../components/sections/EndDashboard";

function Start() {
  return (
    <div className="flex items-center">
      <Menu />
      <div className="h-screen flex-grow">
        <TopBar />
        <div className="p-6">
          <p className="text-3xl font-semibold mb-3">DASHBOARD</p>
          <InicioDashboard />
          <GraficoDashboard />
          <EndDashboard />
        </div>
      </div>
    </div>
  );
}

export default Start;
