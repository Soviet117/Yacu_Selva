import { useState, useEffect } from "react";
import axios from "axios";

function DetallesDashboard() {
  const [metricasDetalladas, setMetricasDetalladas] = useState(null);
  const [trabajadoresTop, setTrabajadoresTop] = useState([]);
  const [productosTop, setProductosTop] = useState([]);
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    async function cargarMetricasDetalladas() {
      try {
        // ✅ ENDPOINTS CORRECTOS - usando dashboard en lugar de reportes
        // Cargar métricas detalladas
        const metricasResponse = await axios.get(
          "http://127.0.0.1:8000/database/api/v1/dashboard/metricas_detalladas/"
        );
        setMetricasDetalladas(metricasResponse.data);

        // Cargar top trabajadores
        const trabajadoresResponse = await axios.get(
          "http://127.0.0.1:8000/database/api/v1/dashboard/top_trabajadores/"
        );
        setTrabajadoresTop(trabajadoresResponse.data);

        // Cargar top productos
        const productosResponse = await axios.get(
          "http://127.0.0.1:8000/database/api/v1/dashboard/top_productos/"
        );
        setProductosTop(productosResponse.data);

        // Cargar alertas gerenciales
        const alertasResponse = await axios.get(
          "http://127.0.0.1:8000/database/api/v1/dashboard/alertas_gerenciales/"
        );
        setAlertas(alertasResponse.data);
      } catch (error) {
        console.error("Error cargando métricas detalladas:", error);
      }
    }
    cargarMetricasDetalladas();
  }, []);

  if (!metricasDetalladas) {
    return (
      <div className="text-center p-6">Cargando métricas detalladas...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🚨 Alertas Gerenciales */}
      {alertas.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">
            🚨 Alertas Gerenciales
          </h3>
          {alertas.map((alerta, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                alerta.tipo === "urgente"
                  ? "bg-red-50 border-red-500 text-red-700"
                  : alerta.tipo === "advertencia"
                  ? "bg-yellow-50 border-yellow-500 text-yellow-700"
                  : "bg-blue-50 border-blue-500 text-blue-700"
              }`}
            >
              <p className="font-semibold">{alerta.titulo}</p>
              <p className="text-sm mt-1">{alerta.mensaje}</p>
              <p className="text-xs text-gray-500 mt-2">💡 {alerta.accion}</p>
            </div>
          ))}
        </div>
      )}

      {/* 📊 Métricas Financieras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-700">Ingresos del Mes</h3>
          <p className="text-2xl font-bold text-blue-600">
            S/.{" "}
            {metricasDetalladas.ingresos_mes?.toLocaleString("es-PE") || "0"}
          </p>
          <p className="text-sm text-gray-500">Acumulado mensual</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="font-semibold text-gray-700">Margen Promedio</h3>
          <p className="text-2xl font-bold text-green-600">
            {metricasDetalladas.margen_promedio || "0"}%
          </p>
          <p className="text-sm text-gray-500">Rentabilidad estimada</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="font-semibold text-gray-700">Ticket Promedio</h3>
          <p className="text-2xl font-bold text-purple-600">
            S/. {metricasDetalladas.ticket_promedio || "0"}
          </p>
          <p className="text-sm text-gray-500">Por venta/entrega</p>
        </div>
      </div>

      {/* 🏆 Top Trabajadores */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          🏆 Top Trabajadores del Mes
        </h3>
        <div className="space-y-3">
          {trabajadoresTop.length > 0 ? (
            trabajadoresTop.slice(0, 5).map((trabajador, index) => (
              <div
                key={trabajador.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium text-gray-800 block">
                      {trabajador.nombre}
                    </span>
                    <span className="text-xs text-gray-500">
                      Eficiencia: {trabajador.eficiencia || 0}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    S/.{" "}
                    {trabajador.total_ventas?.toLocaleString("es-PE") || "0"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {trabajador.entregas || 0} entregas
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No hay datos de trabajadores este mes
            </div>
          )}
        </div>
      </div>

      {/* 📦 Top Productos */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          📦 Productos Más Vendidos
        </h3>
        <div className="space-y-3">
          {productosTop.length > 0 ? (
            productosTop.slice(0, 5).map((producto, index) => (
              <div
                key={producto.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-800">
                    {producto.nombre}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">
                    {producto.cantidad || 0} unidades
                  </p>
                  <p className="text-sm text-gray-500">
                    S/. {producto.ingresos?.toLocaleString("es-PE") || "0"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No hay datos de productos este mes
            </div>
          )}
        </div>
      </div>

      {/* ⚙️ Métricas de Operaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-700 mb-3">
            📊 Eficiencia Operativa
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Tiempo Promedio Entrega:</span>
              <span className="font-semibold text-gray-800">
                {metricasDetalladas.tiempo_entrega || "45"} min
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Entregas a Tiempo:</span>
              <span className="font-semibold text-green-600">
                {metricasDetalladas.entregas_tiempo || "92"}%
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Retornos/Devoluciones:</span>
              <span className="font-semibold text-red-600">
                {metricasDetalladas.tasa_retornos || "3.2"}%
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-t pt-2">
              <span className="text-gray-600 font-medium">
                Eficiencia General:
              </span>
              <span className="font-semibold text-blue-600">
                {metricasDetalladas.eficiencia_operativa || "0"}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-700 mb-3">
            💰 Flujo de Caja Hoy
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Ingresos:</span>
              <span className="font-semibold text-green-600">
                S/.{" "}
                {metricasDetalladas.ingresos_hoy?.toLocaleString("es-PE") ||
                  "0"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Egresos:</span>
              <span className="font-semibold text-red-600">
                S/.{" "}
                {metricasDetalladas.egresos_hoy?.toLocaleString("es-PE") || "0"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-t pt-2">
              <span className="text-gray-600 font-medium">
                Balance del Día:
              </span>
              <span
                className={`font-semibold ${
                  metricasDetalladas.ingresos_hoy -
                    metricasDetalladas.egresos_hoy >=
                  0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                S/.{" "}
                {(
                  (metricasDetalladas.ingresos_hoy || 0) -
                  (metricasDetalladas.egresos_hoy || 0)
                ).toLocaleString("es-PE")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📈 Resumen Mensual */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          📈 Resumen Mensual - Yacu Selva
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {metricasDetalladas.ingresos_mes
                ? "S/." +
                  (metricasDetalladas.ingresos_mes / 1000).toFixed(0) +
                  "K"
                : "0"}
            </p>
            <p className="text-sm text-gray-600">Ingresos</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {trabajadoresTop.length}
            </p>
            <p className="text-sm text-gray-600">Trabajadores Activos</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {productosTop.reduce(
                (sum, prod) => sum + (prod.cantidad || 0),
                0
              )}
            </p>
            <p className="text-sm text-gray-600">Productos Vendidos</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {metricasDetalladas.eficiencia_operativa || "0"}%
            </p>
            <p className="text-sm text-gray-600">Eficiencia</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetallesDashboard;
