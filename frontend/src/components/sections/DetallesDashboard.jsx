import { useState, useEffect } from "react";
import axios from "axios";

function DetallesDashboard() {
  const [metricasDetalladas, setMetricasDetalladas] = useState(null);
  const [trabajadoresTop, setTrabajadoresTop] = useState([]);
  const [productosTop, setProductosTop] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarMetricasDetalladas() {
      try {
        setLoading(true);

        // ✅ ENDPOINTS CORRECTOS - usando dashboard en lugar de reportes
        const [
          metricasResponse,
          trabajadoresResponse,
          productosResponse,
          alertasResponse,
        ] = await Promise.all([
          axios.get(
            "http://127.0.0.1:8000/database/api/v1/dashboard/metricas_detalladas/"
          ),
          axios.get(
            "http://127.0.0.1:8000/database/api/v1/dashboard/top_trabajadores/"
          ),
          axios.get(
            "http://127.0.0.1:8000/database/api/v1/dashboard/top_productos/"
          ),
          axios.get(
            "http://127.0.0.1:8000/database/api/v1/dashboard/alertas_gerenciales/"
          ),
        ]);

        setMetricasDetalladas(metricasResponse.data || {});
        setTrabajadoresTop(trabajadoresResponse.data || []);
        setProductosTop(productosResponse.data || []);
        setAlertas(alertasResponse.data || []);
      } catch (error) {
        console.error("Error cargando métricas detalladas:", error);
        // Setear valores por defecto en caso de error
        setMetricasDetalladas({});
        setTrabajadoresTop([]);
        setProductosTop([]);
        setAlertas([]);
      } finally {
        setLoading(false);
      }
    }
    cargarMetricasDetalladas();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-6 text-gray-600 dark:text-gray-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mb-3"></div>
        <p>Cargando métricas detalladas...</p>
      </div>
    );
  }

  // Valores por defecto para evitar errores
  const metricas = metricasDetalladas || {};

  return (
    <div className="space-y-6">
      {/* 🚨 Alertas Gerenciales */}
      {alertas.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            🚨 Alertas Gerenciales
          </h3>
          {alertas.map((alerta, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                alerta.tipo === "urgente"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300"
                  : alerta.tipo === "advertencia"
                  ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-400 text-yellow-700 dark:text-yellow-300"
                  : "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-300"
              }`}
            >
              <p className="font-semibold">{alerta.titulo}</p>
              <p className="text-sm mt-1">{alerta.mensaje}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 {alerta.accion}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 📊 Métricas Financieras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500 dark:border-blue-400">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Ingresos del Mes
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            S/. {metricas.ingresos_mes?.toLocaleString("es-PE") || "0"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Acumulado mensual
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-green-500 dark:border-green-400">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Margen Promedio
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            {metricas.margen_promedio || "0"}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Rentabilidad estimada
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500 dark:border-purple-400">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Ticket Promedio
          </h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            S/. {metricas.ticket_promedio || "0"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Por venta/entrega
          </p>
        </div>
      </div>

      {/* 🏆 Top Trabajadores */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          🏆 Top Trabajadores del Mes
        </h3>
        <div className="space-y-3">
          {trabajadoresTop.length > 0 ? (
            trabajadoresTop.slice(0, 5).map((trabajador, index) => (
              <div
                key={trabajador.id || index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-200 block">
                      {trabajador.nombre || "Sin nombre"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Eficiencia: {trabajador.eficiencia || 0}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    S/. {(trabajador.total_ventas || 0).toLocaleString("es-PE")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {trabajador.entregas || 0} entregas
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No hay datos de trabajadores este mes
            </div>
          )}
        </div>
      </div>

      {/* 📦 Top Productos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          📦 Productos Más Vendidos
        </h3>
        <div className="space-y-3">
          {productosTop.length > 0 ? (
            productosTop.slice(0, 5).map((producto, index) => (
              <div
                key={producto.id || index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {producto.nombre || "Producto"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600 dark:text-blue-400">
                    {producto.cantidad || 0} unidades
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    S/. {(producto.ingresos || 0).toLocaleString("es-PE")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No hay datos de productos este mes
            </div>
          )}
        </div>
      </div>

      {/* ⚙️ Métricas de Operaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
            📊 Eficiencia Operativa
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600 dark:text-gray-400">
                Tiempo Promedio Entrega:
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {metricas.tiempo_entrega || "45"} min
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600 dark:text-gray-400">
                Entregas a Tiempo:
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {metricas.entregas_tiempo || "92"}%
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600 dark:text-gray-400">
                Retornos/Devoluciones:
              </span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {metricas.tasa_retornos || "3.2"}%
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-t dark:border-gray-700 pt-2">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Eficiencia General:
              </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {metricas.eficiencia_operativa || "0"}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
            💰 Flujo de Caja Hoy
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600 dark:text-gray-400">
                Ingresos:
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                S/. {(metricas.ingresos_hoy || 0).toLocaleString("es-PE")}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600 dark:text-gray-400">Egresos:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                S/. {(metricas.egresos_hoy || 0).toLocaleString("es-PE")}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-t dark:border-gray-700 pt-2">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Balance del Día:
              </span>
              <span
                className={`font-semibold ${
                  (metricas.ingresos_hoy || 0) - (metricas.egresos_hoy || 0) >=
                  0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                S/.{" "}
                {(
                  (metricas.ingresos_hoy || 0) - (metricas.egresos_hoy || 0)
                ).toLocaleString("es-PE")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📈 Resumen Mensual */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          📈 Resumen Mensual - Yacu Selva
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metricas.ingresos_mes
                ? "S/." +
                  Math.round(metricas.ingresos_mes / 1000).toLocaleString(
                    "es-PE"
                  ) +
                  "K"
                : "0"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Ingresos
            </p>
          </div>

          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {trabajadoresTop.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Trabajadores Activos
            </p>
          </div>

          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {productosTop
                .reduce((sum, prod) => sum + (prod.cantidad || 0), 0)
                .toLocaleString("es-PE")}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Productos Vendidos
            </p>
          </div>

          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {metricas.eficiencia_operativa || "0"}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Eficiencia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetallesDashboard;
