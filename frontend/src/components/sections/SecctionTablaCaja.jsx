import TablaCaja from "../ui/TablaCaja";
import RegistroRapidoCaja from "../ui/RegistroRapidoCaja";
import { useState } from "react";
import { Filter, Download, Plus, X, Calendar, RefreshCw } from "lucide-react";
import axios from "axios";

function SecctionTablaCaja() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    tipo: "todos",
    metodo: "todos",
  });

  const handleExportar = async () => {
    try {
      setExporting(true);
      const params = new URLSearchParams();

      if (filtros.fechaInicio)
        params.append("fechaInicio", filtros.fechaInicio);
      if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);
      if (filtros.tipo && filtros.tipo !== "todos")
        params.append("tipo", filtros.tipo);
      if (filtros.metodo && filtros.metodo !== "todos")
        params.append("metodo", filtros.metodo);

      const response = await axios.get(
        `http://127.0.0.1:8000/database/api/v1/movimientos-caja/generar_reporte_excel/?${params}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const nombreArchivo = generarNombreArchivo();
      link.setAttribute("download", nombreArchivo);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      alert(`✅ Reporte exportado: ${nombreArchivo}`);
    } catch (error) {
      console.error("Error exportando:", error);
      alert(
        "❌ Error al exportar el reporte: " +
          (error.message || "Verifique la conexión")
      );
    } finally {
      setExporting(false);
    }
  };

  const generarNombreArchivo = () => {
    const fecha = new Date().toISOString().split("T")[0];
    let nombre = `reporte_caja_${fecha}`;

    if (filtros.fechaInicio && filtros.fechaFin) {
      nombre += `_${filtros.fechaInicio}_a_${filtros.fechaFin}`;
    }

    if (filtros.tipo !== "todos") {
      nombre += `_${filtros.tipo}s`;
    }

    if (filtros.metodo !== "todos") {
      nombre += `_${filtros.metodo}`;
    }

    return `${nombre}.xlsx`;
  };

  const handleAplicarFiltros = () => {
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

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const ModalFiltros = () => (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={() => setFiltrosOpen(false)}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Filtrar Movimientos
          </h2>
          <button
            onClick={() => setFiltrosOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) =>
                setFiltros({ ...filtros, fechaInicio: e.target.value })
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) =>
                setFiltros({ ...filtros, fechaFin: e.target.value })
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Movimiento
            </label>
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="todos">Todos los movimientos</option>
              <option value="ingreso">Solo Ingresos</option>
              <option value="egreso">Solo Egresos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Método de Pago
            </label>
            <select
              value={filtros.metodo}
              onChange={(e) =>
                setFiltros({ ...filtros, metodo: e.target.value })
              }
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Filtros activos:
              </p>
              <ul className="text-xs text-yellow-700 dark:text-yellow-400 mt-1 space-y-1">
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
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={() => setFiltrosOpen(false)}
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAplicarFiltros}
              className="flex-1 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
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

  const hayFiltrosActivos =
    filtros.fechaInicio ||
    filtros.fechaFin ||
    filtros.tipo !== "todos" ||
    filtros.metodo !== "todos";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
              📊 Movimientos de Caja
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm lg:text-base">
              Registro completo de ingresos y egresos
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              title="Actualizar tabla"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Actualizar</span>
            </button>

            <button
              onClick={() => setFiltrosOpen(true)}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
            </button>

            <button
              onClick={handleExportar}
              disabled={exporting}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 dark:border-gray-300"></div>
                  <span className="hidden sm:inline">Exportando...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Exportar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {hayFiltrosActivos && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filtros.fechaInicio && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                <Calendar className="h-3 w-3" />
                Desde: {filtros.fechaInicio}
              </span>
            )}
            {filtros.fechaFin && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                <Calendar className="h-3 w-3" />
                Hasta: {filtros.fechaFin}
              </span>
            )}
            {filtros.tipo !== "todos" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                {filtros.tipo === "ingreso" ? "📈" : "📉"}
                {filtros.tipo === "ingreso" ? "Solo Ingresos" : "Solo Egresos"}
              </span>
            )}
            {filtros.metodo !== "todos" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                💳
                {filtros.metodo.charAt(0).toUpperCase() +
                  filtros.metodo.slice(1)}
              </span>
            )}
            <button
              onClick={handleResetFiltros}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
