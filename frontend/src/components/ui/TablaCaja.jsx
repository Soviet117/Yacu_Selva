import { useState, useEffect } from "react";
import { loadMovimientosCompletos } from "../../api/api.caja";
import { Loader2, AlertCircle } from "lucide-react";

function TablaCaja({ filtros = {} }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const response = await loadMovimientosCompletos(filtros);
        setData(response.data || []);
      } catch (error) {
        console.error("Error loading movimientos:", error);
        setError("No se pudieron cargar los movimientos");
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [filtros]);

  function formatHora(hora) {
    if (!hora) return "";
    if (typeof hora === "string") return hora.split(".")[0];
    return hora;
  }

  function redondearADosDecimales(valor) {
    return Number(parseFloat(valor).toFixed(2));
  }

  const getTipoClasses = (tipo) => {
    switch (tipo) {
      case "ingreso":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "egreso":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getMetodoClasses = (metodo) => {
    switch (metodo) {
      case "efectivo":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "yape":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300";
      case "mixto":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const headers = [
    "FECHA",
    "HORA",
    "MONTO",
    "TIPO",
    "MÉTODO",
    "DESCRIPCIÓN",
    "RESPONSABLE",
  ];

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mb-3"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Cargando movimientos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-3" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const totalIngresos = data
    .filter((item) => item.tipo === "ingreso")
    .reduce((sum, item) => sum + (parseFloat(item.monto) || 0), 0);

  const totalEgresos = data
    .filter((item) => item.tipo === "egreso")
    .reduce((sum, item) => sum + (parseFloat(item.monto) || 0), 0);

  const balance = totalIngresos - totalEgresos;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border-b border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headers.length}
                      className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No hay movimientos registrados{" "}
                      {Object.keys(filtros).length > 0 &&
                        "para los filtros seleccionados"}
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                        {item.fecha}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {formatHora(item.hora)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={
                            item.tipo === "egreso"
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }
                        >
                          {item.tipo === "egreso" ? "-" : "+"}S/.{" "}
                          {redondearADosDecimales(item.monto)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoClasses(
                            item.tipo
                          )}`}
                        >
                          {item.tipo === "ingreso" ? "📈 Ingreso" : "📉 Egreso"}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMetodoClasses(
                            item.metodo
                          )}`}
                        >
                          {item.metodo}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                        {item.descripcion}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                        {item.responsable}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer con resumen */}
      {data.length > 0 && (
        <div className="px-4 lg:px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-700 dark:text-gray-300">
            <div className="flex flex-wrap gap-4 mb-2 sm:mb-0">
              <div>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  Ingresos: S/. {redondearADosDecimales(totalIngresos)}
                </span>
              </div>
              <div>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  Egresos: S/. {redondearADosDecimales(totalEgresos)}
                </span>
              </div>
            </div>
            <div className="text-sm">
              <span
                className={`font-bold ${
                  balance >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                Balance: {balance >= 0 ? "+" : ""}S/.{" "}
                {redondearADosDecimales(Math.abs(balance))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TablaCaja;
