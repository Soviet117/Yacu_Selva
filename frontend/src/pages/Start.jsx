// pages/Start.jsx
import { useState } from "react";
import GraficoDashboard from "../components/sections/GraficoDashboard";
import InicioDashboard from "../components/sections/InicioDashboard";
import EndDashboard from "../components/sections/EndDashboard";
import DetallesDashboard from "../components/sections/DetallesDashboard";

function Start({ user }) {
  const [tabActiva, setTabActiva] = useState("resumen");

  return (
    <>
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

      {tabActiva === "detalles" && <DetallesDashboard />}
    </>
  );
}

export default Start;
