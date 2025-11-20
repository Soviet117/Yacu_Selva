import ModalES from "../ui/ModalES";
import { loadOperacionesHibridas } from "../../api/api.salida"; // Cambiar la importación
import { useState, useEffect } from "react";

function formatHora(horaCompleta) {
  if (!horaCompleta) return "";
  return horaCompleta.split(".")[0];
}

function TablaES({ refreshTable, onRegister }) {
  const [dataES, setDataES] = useState([]);
  const [stateModal, setStateModal] = useState({
    isOpen: false,
    selectedSalida: null,
  });

  useEffect(() => {
    async function load() {
      try {
        // Cambiar a la nueva función que carga operaciones híbridas
        const operaciones = await loadOperacionesHibridas();
        setDataES(operaciones.data);
      } catch (error) {
        console.error("Error cargando operaciones:", error);
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
    // Solo permitir actualizar si es una salida normal (no venta POS)
    if (operacion.tipo_operacion === "salida") {
      setStateModal({ isOpen: true, selectedSalida: operacion });
    }
  };

  const getEstadoClasses = (estado) => {
    switch (estado) {
      case "Pagado":
      case "Completada":
        return "bg-green-100 text-green-800";
      case "Pendiente":
      case "En ruta":
        return "bg-yellow-100 text-yellow-800";
      case "Parcial":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoOperacion = (operacion) => {
    if (operacion.tipo_operacion === "venta_pos") {
      return { texto: "🏪 Venta POS", clase: "bg-purple-100 text-purple-800" };
    } else {
      return { texto: "🚚 Entrega", clase: "bg-blue-100 text-blue-800" };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto max-h-80 overflow-y-scroll">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white sticky top-0 z-10 shadow-sm">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {dataES.map((item) => {
              const tipoInfo = getTipoOperacion(item);

              return (
                <tr
                  key={
                    item.tipo_operacion === "salida"
                      ? `s-${item.id_salida}`
                      : `v-${item.id_venta}`
                  }
                  className="hover:bg-gray-50"
                >
                  {/* COLUMNA TIPO */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${tipoInfo.clase}`}
                    >
                      {tipoInfo.texto}
                    </span>
                  </td>

                  {/* DELIVERISTA */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.nom_trabajador}
                  </td>

                  {/* FECHA / HORA */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.fecha} / {formatHora(item.hora)}
                  </td>

                  {/* CANTIDAD */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.cantidad}
                  </td>

                  {/* PRODUCTO */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.nom_producto}
                  </td>

                  {/* CLIENTE (NUEVA COLUMNA) */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {item.cliente || "N/A"}
                  </td>

                  {/* MONTO (NUEVA COLUMNA) */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    S/ {parseFloat(item.total_cancelar).toFixed(2)}
                  </td>

                  {/* ESTADO PAGO */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClasses(
                        item.estado_pago
                      )}`}
                    >
                      {item.estado_pago}
                    </span>
                  </td>

                  {/* ESTADO SALIDA */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
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
                        className="text-indigo-600 hover:text-indigo-900 font-semibold transition duration-150 ease-in-out"
                      >
                        Actualizar
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">Completado</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal para actualizar (solo para salidas normales) */}
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
