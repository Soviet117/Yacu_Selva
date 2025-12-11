import React, { useState, useEffect, useMemo } from "react";
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
  const [darkMode, setDarkMode] = useState(false);

  // Detectar modo oscuro
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setDarkMode(isDark);
    };

    checkDarkMode();

    // Observer para cambios en el tema
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

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

  // Colores adaptados al modo oscuro
  const colores = useMemo(
    () => ({
      texto: darkMode ? "#E5E7EB" : "#374151",
      textoSuave: darkMode ? "#9CA3AF" : "#6B7280",
      fondo: darkMode ? "#1F2937" : "#FFFFFF",
      grid: darkMode ? "#374151" : "#E5E7EB",

      // Colores de datasets
      azul: darkMode ? "#60A5FA" : "#3B82F6",
      verde: darkMode ? "#34D399" : "#10B981",
      rojo: darkMode ? "#F87171" : "#EF4444",
      violeta: darkMode ? "#A78BFA" : "#8B5CF6",
      amarillo: darkMode ? "#FBBF24" : "#F59E0B",
    }),
    [darkMode]
  );

  if (!datosPerformance) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md mb-4">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Cargando análisis de performance...
        </div>
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
        backgroundColor: colores.azul,
        borderColor: colores.azul,
        borderWidth: 1,
      },
      {
        label: "Entregas Completadas",
        data: datosPerformance.map((item) => item.entregas_completadas),
        backgroundColor: colores.verde,
        borderColor: colores.verde,
        borderWidth: 1,
      },
      {
        label: "Retornos",
        data: datosPerformance.map((item) => item.retornos),
        backgroundColor: colores.rojo,
        borderColor: colores.rojo,
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
        borderColor: colores.violeta,
        backgroundColor: darkMode
          ? "rgba(168, 85, 247, 0.2)"
          : "rgba(168, 85, 247, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y",
      },
      {
        label: "Monto Pendiente (S/.)",
        data: datosPerformance.map((item) => item.monto_pendiente),
        borderColor: colores.amarillo,
        backgroundColor: darkMode
          ? "rgba(245, 158, 11, 0.2)"
          : "rgba(245, 158, 11, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y1",
      },
    ],
  };

  // Opciones comunes para gráficos
  const opcionesComunes = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colores.texto,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: colores.grid,
        },
        ticks: {
          color: colores.textoSuave,
        },
      },
      y: {
        grid: {
          color: colores.grid,
        },
        ticks: {
          color: colores.textoSuave,
        },
      },
    },
  };

  const opcionesBarras = {
    ...opcionesComunes,
    plugins: {
      ...opcionesComunes.plugins,
      title: {
        display: true,
        text: "Performance de Entregas vs Retornos",
        color: colores.texto,
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      ...opcionesComunes.scales,
      y: {
        ...opcionesComunes.scales.y,
        beginAtZero: true,
        title: {
          display: true,
          text: "Cantidad de Entregas",
          color: colores.textoSuave,
        },
      },
      x: {
        ...opcionesComunes.scales.x,
        title: {
          display: true,
          text: "Fecha",
          color: colores.textoSuave,
        },
      },
    },
  };

  const opcionesEficiencia = {
    ...opcionesComunes,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      ...opcionesComunes.plugins,
      title: {
        display: true,
        text: "Eficiencia y Monto Pendiente",
        color: colores.texto,
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      ...opcionesComunes.scales,
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Eficiencia (%)",
          color: colores.textoSuave,
        },
        max: 100,
        grid: {
          color: colores.grid,
        },
        ticks: {
          color: colores.textoSuave,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Monto Pendiente (S/.)",
          color: colores.textoSuave,
        },
        grid: {
          drawOnChartArea: false,
          color: colores.grid,
        },
        ticks: {
          color: colores.textoSuave,
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
    <div className="p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Dashboard de Performance - YacuSelva
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setVista("barras")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              vista === "barras"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Vista Completa
          </button>
          <button
            onClick={() => setVista("resumen")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              vista === "resumen"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Resumen Ejecutivo
          </button>
        </div>
      </div>

      {vista === "barras" ? (
        <div className="space-y-6">
          <div className="h-72 lg:h-80">
            <Bar data={datosBarras} options={opcionesBarras} />
          </div>
          <div className="h-72 lg:h-80">
            <Bar data={datosEficiencia} options={opcionesEficiencia} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Métricas Principales */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Eficiencia Promedio
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {eficienciaPromedio.toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500 dark:border-green-400">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tasa de Completación
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalEntregasProgramadas > 0
                  ? (
                      (totalEntregasCompletadas / totalEntregasProgramadas) *
                      100
                    ).toFixed(1)
                  : "0.0"}
                %
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500 dark:border-purple-400">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Entregas
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totalEntregasCompletadas}
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
                      Math.max(
                        0,
                        totalEntregasProgramadas - totalEntregasCompletadas
                      ),
                    ],
                    backgroundColor: [
                      colores.verde,
                      colores.rojo,
                      colores.amarillo,
                    ],
                    borderColor: darkMode ? "#374151" : "#FFFFFF",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                ...opcionesComunes,
                plugins: {
                  ...opcionesComunes.plugins,
                  title: {
                    display: true,
                    text: "Distribución de Entregas",
                    color: colores.texto,
                    font: {
                      size: 16,
                      weight: "bold",
                    },
                  },
                  legend: {
                    position: "bottom",
                    labels: {
                      color: colores.texto,
                    },
                  },
                },
              }}
            />
          </div>

          {/* Alertas para el Gerente */}
          <div className="lg:col-span-2 space-y-3">
            <div
              className={`p-3 rounded-lg border-l-4 ${
                eficienciaPromedio < 80
                  ? "bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400"
                  : "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400"
              }`}
            >
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {eficienciaPromedio < 80 ? "⚠️ Atención: " : "✅ "}
                Eficiencia {eficienciaPromedio < 80 ? "Baja" : "Óptima"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {eficienciaPromedio < 80
                  ? "Considera revisar rutas y procesos de entrega"
                  : "El equipo mantiene buena performance"}
              </p>
            </div>

            <div
              className={`p-3 rounded-lg border-l-4 ${
                montoTotalPendiente > 1000
                  ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-400"
                  : "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400"
              }`}
            >
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {montoTotalPendiente > 1000 ? "💰 " : "✅ "}
                Cobranza Pendiente: S/.{" "}
                {montoTotalPendiente.toLocaleString("es-PE")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
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
