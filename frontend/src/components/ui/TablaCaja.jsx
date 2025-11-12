import { useState, useEffect } from "react";
import { loadMovimientosCompletos } from "../../api/api.caja";

function TablaCaja({ filtros = {} }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await loadMovimientosCompletos(filtros);
        setData(response.data || []);
      } catch (error) {
        console.error("Error loading movimientos:", error);
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
        return "bg-green-100 text-green-800";
      case "egreso":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMetodoClasses = (metodo) => {
    switch (metodo) {
      case "efectivo":
        return "bg-blue-100 text-blue-800";
      case "yape":
        return "bg-purple-100 text-purple-800";
      case "mixto":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No hay movimientos registrados para los filtros seleccionados
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.fecha}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatHora(item.hora)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={
                        item.tipo === "egreso"
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {item.tipo === "egreso" ? "-" : ""}S/.{" "}
                      {redondearADosDecimales(item.monto)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoClasses(
                        item.tipo
                      )}`}
                    >
                      {item.tipo === "ingreso" ? "📈 Ingreso" : "📉 Egreso"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMetodoClasses(
                        item.metodo
                      )}`}
                    >
                      {item.metodo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {item.descripcion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.responsable}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaCaja;
