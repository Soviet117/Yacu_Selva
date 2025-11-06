// GraficoPerformance.jsx
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function GraficoPerformance() {
  const [datosPerformance, setDatosPerformance] = useState(null);
  const [vista, setVista] = useState("barras"); // 'barras' o 'resumen'

  useEffect(() => {
    async function cargarDatosPerformance() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/database/api/v1/dashboard/performance_entregas/"
        );
        setDatosPerformance(response.data);
      } catch (error) {
        console.error("Error cargando datos de performance:", error);
      }
    }
    cargarDatosPerformance();
  }, []);

  if (!datosPerformance) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md mb-4">
        <div className="text-center">Cargando análisis de performance...</div>
      </div>
    );
  }

  // Datos para gráfico de barras
  const etiquetas = datosPerformance.map((item) =>
    new Date(item.fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  );

  const datosBarras = {
    labels: etiquetas,
    datasets: [
      {
        label: "Entregas Programadas",
        data: datosPerformance.map((item) => item.entregas_programadas),
        backgroundColor: "rgb(59, 130, 246)", // Azul
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
      {
        label: "Entregas Completadas",
        data: datosPerformance.map((item) => item.entregas_completadas),
        backgroundColor: "rgb(34, 197, 94)", // Verde
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
      {
        label: "Retornos",
        data: datosPerformance.map((item) => item.retornos),
        backgroundColor: "rgb(239, 68, 68)", // Rojo
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
      },
    ],
  };

  // Datos para gráfico de eficiencia
  const datosEficiencia = {
    labels: etiquetas,
    datasets: [
      {
        label: "Eficiencia (%)",
        data: datosPerformance.map((item) => item.eficiencia),
        borderColor: "rgb(168, 85, 247)", // Violeta
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y",
      },
      {
        label: "Monto Pendiente (S/.)",
        data: datosPerformance.map((item) => item.monto_pendiente),
        borderColor: "rgb(245, 158, 11)", // Amarillo
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y1",
      },
    ],
  };

  const opcionesBarras = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Performance de Entregas vs Retornos",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Cantidad de Entregas",
        },
      },
    },
  };

  const opcionesEficiencia = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Eficiencia y Monto Pendiente",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Eficiencia (%)",
        },
        max: 100,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Monto Pendiente (S/.)",
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value) {
            return "S/. " + value.toLocaleString("es-PE");
          },
        },
      },
    },
  };

  // Cálculos para el resumen
  const totalEntregasProgramadas = datosPerformance.reduce(
    (sum, item) => sum + item.entregas_programadas,
    0
  );
  const totalEntregasCompletadas = datosPerformance.reduce(
    (sum, item) => sum + item.entregas_completadas,
    0
  );
  const totalRetornos = datosPerformance.reduce(
    (sum, item) => sum + item.retornos,
    0
  );
  const eficienciaPromedio =
    datosPerformance.reduce((sum, item) => sum + item.eficiencia, 0) /
    datosPerformance.length;
  const montoTotalPendiente = datosPerformance.reduce(
    (sum, item) => sum + item.monto_pendiente,
    0
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md mb-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Dashboard de Performance - YacuSelva
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setVista("barras")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              vista === "barras"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Vista Completa
          </button>
          <button
            onClick={() => setVista("resumen")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              vista === "resumen"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Resumen Ejecutivo
          </button>
        </div>
      </div>

      {vista === "barras" ? (
        <div className="space-y-6">
          <div className="h-80">
            <Bar data={datosBarras} options={opcionesBarras} />
          </div>
          <div className="h-80">
            <Bar data={datosEficiencia} options={opcionesEficiencia} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* Métricas Principales */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Eficiencia Promedio</p>
              <p className="text-2xl font-bold text-blue-600">
                {eficienciaPromedio.toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Tasa de Completación</p>
              <p className="text-2xl font-bold text-green-600">
                {(
                  (totalEntregasCompletadas / totalEntregasProgramadas) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>

          {/* Gráfico de Doughnut */}
          <div className="h-64">
            <Doughnut
              data={{
                labels: ["Completadas", "Retornos", "Pendientes"],
                datasets: [
                  {
                    data: [
                      totalEntregasCompletadas,
                      totalRetornos,
                      totalEntregasProgramadas - totalEntregasCompletadas,
                    ],
                    backgroundColor: [
                      "rgb(34, 197, 94)",
                      "rgb(239, 68, 68)",
                      "rgb(245, 158, 11)",
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                  title: {
                    display: true,
                    text: "Distribución de Entregas",
                  },
                },
              }}
            />
          </div>

          {/* Alertas para el Gerente */}
          <div className="col-span-2 space-y-3">
            <div
              className={`p-3 rounded-lg ${
                eficienciaPromedio < 80
                  ? "bg-red-50 border-l-4 border-red-500"
                  : "bg-green-50 border-l-4 border-green-500"
              }`}
            >
              <p className="font-medium">
                {eficienciaPromedio < 80 ? "⚠️ Atención: " : "✅ "}
                Eficiencia {eficienciaPromedio < 80 ? "Baja" : "Óptima"}
              </p>
              <p className="text-sm text-gray-600">
                {eficienciaPromedio < 80
                  ? "Considera revisar rutas y procesos de entrega"
                  : "El equipo mantiene buena performance"}
              </p>
            </div>

            <div
              className={`p-3 rounded-lg ${
                montoTotalPendiente > 1000
                  ? "bg-yellow-50 border-l-4 border-yellow-500"
                  : "bg-green-50 border-l-4 border-green-500"
              }`}
            >
              <p className="font-medium">
                {montoTotalPendiente > 1000 ? "💰 " : "✅ "}
                Cobranza Pendiente: S/.{" "}
                {montoTotalPendiente.toLocaleString("es-PE")}
              </p>
              <p className="text-sm text-gray-600">
                {montoTotalPendiente > 1000
                  ? "Seguimiento recomendado a cuentas por cobrar"
                  : "Estado de cobranza saludable"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GraficoPerformance;
