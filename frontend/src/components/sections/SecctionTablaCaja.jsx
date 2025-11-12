import TablaCaja from "../ui/TablaCaja";
import RegistroRapidoCaja from "../ui/RegistroRapidoCaja";
import { useState } from "react";
import { Filter, Download, Plus, X, Calendar } from "lucide-react";
import axios from "axios";

function SecctionTablaCaja() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    tipo: "todos",
    metodo: "todos",
  });

  const handleExportar = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/database/api/v1/reportes/generar_reporte/",
        { tipo_reporte: "diario" },
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `reporte_caja_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exportando:", error);
      alert("Error al exportar el reporte");
    }
  };

  const handleAplicarFiltros = () => {
    console.log("Aplicando filtros:", filtros);
    setFiltrosOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const handleResetFiltros = () => {
    setFiltros({
      fechaInicio: "",
      fechaFin: "",
      tipo: "todos",
      metodo: "todos",
    });
    setRefreshKey((prev) => prev + 1);
  };

  const ModalFiltros = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Filtrar Movimientos
          </h2>
          <button
            onClick={() => setFiltrosOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) =>
                setFiltros({ ...filtros, fechaInicio: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) =>
                setFiltros({ ...filtros, fechaFin: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Movimiento
            </label>
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos los movimientos</option>
              <option value="ingreso">Solo Ingresos</option>
              <option value="egreso">Solo Egresos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pago
            </label>
            <select
              value={filtros.metodo}
              onChange={(e) =>
                setFiltros({ ...filtros, metodo: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos los métodos</option>
              <option value="efectivo">Efectivo</option>
              <option value="yape">Yape</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          {(filtros.fechaInicio ||
            filtros.fechaFin ||
            filtros.tipo !== "todos" ||
            filtros.metodo !== "todos") && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-800">
                Filtros activos:
              </p>
              <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                {filtros.fechaInicio && <li>• Desde: {filtros.fechaInicio}</li>}
                {filtros.fechaFin && <li>• Hasta: {filtros.fechaFin}</li>}
                {filtros.tipo !== "todos" && <li>• Tipo: {filtros.tipo}</li>}
                {filtros.metodo !== "todos" && (
                  <li>• Método: {filtros.metodo}</li>
                )}
              </ul>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleResetFiltros}
              className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={() => setFiltrosOpen(false)}
              className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAplicarFiltros}
              className="flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleRegistroSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Movimientos de Caja
            </h2>
            <p className="text-gray-600 mt-1">
              Registro completo de ingresos y egresos
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFiltrosOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </button>

            <button
              onClick={handleExportar}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Exportar
            </button>

            <button
              onClick={() =>
                document.querySelector('button[class*="fixed"]')?.click()
              }
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Nuevo Movimiento
            </button>
          </div>
        </div>

        {(filtros.fechaInicio ||
          filtros.fechaFin ||
          filtros.tipo !== "todos" ||
          filtros.metodo !== "todos") && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filtros.fechaInicio && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                <Calendar className="h-3 w-3" />
                Desde: {filtros.fechaInicio}
              </span>
            )}
            {filtros.fechaFin && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                <Calendar className="h-3 w-3" />
                Hasta: {filtros.fechaFin}
              </span>
            )}
            {filtros.tipo !== "todos" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {filtros.tipo === "ingreso" ? "📈" : "📉"}
                {filtros.tipo === "ingreso" ? "Solo Ingresos" : "Solo Egresos"}
              </span>
            )}
            {filtros.metodo !== "todos" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                💳
                {filtros.metodo.charAt(0).toUpperCase() +
                  filtros.metodo.slice(1)}
              </span>
            )}
            <button
              onClick={handleResetFiltros}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="h-3 w-3" />
              Limpiar
            </button>
          </div>
        )}
      </div>

      <TablaCaja key={refreshKey} filtros={filtros} />

      <RegistroRapidoCaja onRegistroSuccess={handleRegistroSuccess} />

      {filtrosOpen && <ModalFiltros />}
    </div>
  );
}

export default SecctionTablaCaja;
