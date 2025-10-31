import ModalES from "../ui/ModalES";
import { loadSalida } from "../../api/api.salida";
import { useState, useEffect } from "react";

function formatHora(horaCompleta) {
  if (!horaCompleta) return "";
  // Extraer solo HH:MM:SS (eliminar microsegundos)
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
      const salidas = await loadSalida();
      setDataES(salidas.data);
    }
    load();
  }, [refreshTable]);

  const headers = [
    "DELIVERISTA",
    "FECHA / HORA",
    "CANTIDAD",
    "TIPO",
    "DINERO",
    "ESTADO SALIDA",
    "ACCIONES",
  ];

  const updateData = (salida) => {
    setStateModal({ isOpen: true, selectedSalida: salida });
  };

  const getEstadoClasses = (estado) => {
    switch (estado) {
      case "Completada":
        return "bg-green-100 text-green-800";
      case "En ruta":
        return "bg-blue-100 text-blue-800";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {dataES.map((item) => (
              <tr key={item.id_salida} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.nom_trabajador}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.fecha} / {formatHora(item.hora)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.cantidad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.nom_producto}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClasses(
                      item.estado_pago
                    )}`}
                  >
                    {item.estado_pago}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClasses(
                      item.estado_salida
                    )}`}
                  >
                    {item.estado_salida}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => updateData(item)}
                    className="text-indigo-600 hover:text-indigo-900 font-semibold transition duration-150 ease-in-out"
                  >
                    Actualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {stateModal.isOpen && (
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
