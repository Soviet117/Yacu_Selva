// pages/Start.jsx
import { useState } from "react";
import GraficoDashboard from "../components/sections/GraficoDashboard";
import InicioDashboard from "../components/sections/InicioDashboard";
import EndDashboard from "../components/sections/EndDashboard";
import DetallesDashboard from "../components/sections/DetallesDashboard";

function Start({ user }) {
  const [tabActiva, setTabActiva] = useState("resumen");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <p className="text-3xl font-semibold mb-6 dark:text-white">
        DASHBOARD - YACU SELVA
      </p>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b dark:border-gray-700">
        <button
          className={`pb-2 px-4 ${
            tabActiva === "resumen"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => setTabActiva("resumen")}
        >
          📊 Resumen
        </button>
        <button
          className={`pb-2 px-4 ${
            tabActiva === "graficos"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => setTabActiva("graficos")}
        >
          📈 Gráficos
        </button>
        <button
          className={`pb-2 px-4 ${
            tabActiva === "detalles"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
    </div>
  );
}

export default Start;
