import Menu from "../components/layouts/Menu";
import TopBar from "../components/layouts/TopBar";
import GraficoDashboard from "../components/sections/GraficoDashboard";
import InicioDashboard from "../components/sections/InicioDashboard";
import EndDashboard from "../components/sections/EndDashboard";
import DetallesDashboard from "../components/sections/DetallesDashboard"; // ✅ NUEVO

import { useState } from "react";

function Start() {
  const [tabActiva, setTabActiva] = useState("resumen");

  return (
    <div className="flex">
      <Menu />
      <div className="h-screen flex-grow overflow-auto">
        <TopBar />
        <div className="p-6">
          <p className="text-3xl font-semibold mb-6">DASHBOARD - YACU SELVA</p>
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            <button
              className={`pb-2 px-4 ${
                tabActiva === "resumen"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setTabActiva("resumen")}
            >
              📊 Resumen
            </button>
            <button
              className={`pb-2 px-4 ${
                tabActiva === "graficos"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setTabActiva("graficos")}
            >
              📈 Gráficos
            </button>
            <button
              className={`pb-2 px-4 ${
                tabActiva === "detalles"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setTabActiva("detalles")}
            >
              🔍 Detalles
            </button>
          </div>
          {/* Contenido de Tabs */}
          {tabActiva === "resumen" && (
            <div className="space-y-6">
              <InicioDashboard />
              <EndDashboard />
            </div>
          )}
          {tabActiva === "graficos" && <GraficoDashboard />}
          {tabActiva === "detalles" && <DetallesDashboard />} {/* ✅ NUEVO */}
        </div>
      </div>
    </div>
  );
}

export default Start;
