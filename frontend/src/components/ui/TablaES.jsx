import ModalES from "../ui/ModalES";
import { loadOperacionesHibridas } from "../../api/api.salida";
import { useState, useEffect } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";

function formatHora(horaCompleta) {
  if (!horaCompleta) return "";
  return horaCompleta.split(".")[0];
}

function TablaES({ refreshTable, onRegister }) {
  const [dataES, setDataES] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stateModal, setStateModal] = useState({
    isOpen: false,
    selectedSalida: null,
  });

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const operaciones = await loadOperacionesHibridas();
        setDataES(operaciones.data || []);
      } catch (error) {
        console.error("Error cargando operaciones:", error);
        setError("No se pudieron cargar las operaciones");
        setDataES([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshTable]);

  const headers = [
    "TIPO",
    "DELIVERISTA",
    "FECHA / HORA",
    "CANTIDAD",
    "PRODUCTO",
    "CLIENTE",
    "MONTO",
    "ESTADO PAGO",
    "ESTADO SALIDA",
    "ACCIONES",
  ];

  const updateData = (operacion) => {
    if (operacion.tipo_operacion === "salida") {
      setStateModal({ isOpen: true, selectedSalida: operacion });
    }
  };

  // Clases para modo oscuro
  const getEstadoClasses = (estado) => {
    switch (estado) {
      case "Pagado":
      case "Completada":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "Pendiente":
      case "En ruta":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "Parcial":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getTipoOperacion = (operacion) => {
    if (operacion.tipo_operacion === "venta_pos") {
      return {
        texto: "🏪 Venta POS",
        clase:
          "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
      };
    } else {
      return {
        texto: "🚚 Entrega",
        clase:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      };
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mb-3"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Cargando operaciones...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-3" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => onRegister && onRegister()}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center mx-auto"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </button>
      </div>
    );
  }

  if (dataES.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          No hay operaciones registradas hoy
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Registra una nueva salida o venta POS para comenzar
        </p>
      </div>
    );
  }

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
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {dataES.map((item) => {
                  const tipoInfo = getTipoOperacion(item);

                  return (
                    <tr
                      key={
                        item.tipo_operacion === "salida"
                          ? `s-${item.id_salida}`
                          : `v-${item.id_venta}`
                      }
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* TIPO */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${tipoInfo.clase}`}
                        >
                          {tipoInfo.texto}
                        </span>
                      </td>

                      {/* DELIVERISTA */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                        {item.nom_trabajador || "N/A"}
                      </td>

                      {/* FECHA / HORA */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {item.fecha} / {formatHora(item.hora)}
                      </td>

                      {/* CANTIDAD */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">{item.cantidad}</span>
                      </td>

                      {/* PRODUCTO */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {item.nom_producto}
                      </td>

                      {/* CLIENTE */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {item.cliente || "N/A"}
                      </td>

                      {/* MONTO */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-200">
                        S/ {parseFloat(item.total_cancelar || 0).toFixed(2)}
                      </td>

                      {/* ESTADO PAGO */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClasses(
                            item.estado_pago
                          )}`}
                        >
                          {item.estado_pago}
                        </span>
                      </td>

                      {/* ESTADO SALIDA */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClasses(
                            item.estado_salida
                          )}`}
                        >
                          {item.estado_salida}
                        </span>
                      </td>

                      {/* ACCIONES */}
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        {item.tipo_operacion === "salida" ? (
                          <button
                            onClick={() => updateData(item)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition duration-150 ease-in-out"
                          >
                            Actualizar
                          </button>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic">
                            Completado
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer de la tabla */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Total: <span className="font-semibold">{dataES.length}</span>{" "}
            operaciones
          </p>
          <p className="mt-1 sm:mt-0">
            Ventas POS:{" "}
            <span className="font-semibold">
              {
                dataES.filter((item) => item.tipo_operacion === "venta_pos")
                  .length
              }
            </span>{" "}
            • Entregas:{" "}
            <span className="font-semibold">
              {dataES.filter((item) => item.tipo_operacion === "salida").length}
            </span>
          </p>
        </div>
      </div>

      {/* Modal para actualizar */}
      {stateModal.isOpen &&
        stateModal.selectedSalida?.tipo_operacion === "salida" && (
          <ModalES
            id={stateModal.selectedSalida?.id_salida}
            setStateModal={setStateModal}
            onRegister={onRegister}
          />
        )}
    </div>
  );
}

export default TablaES;
