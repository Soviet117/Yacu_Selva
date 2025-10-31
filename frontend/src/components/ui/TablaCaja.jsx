import { useState, useEffect } from "react";
import { loadCajaData } from "../../api/api.caja";

const mockEntregasDelDia = [
  {
    id: 201,
    fecha: "Viernes 10 Oct.",
    hora: "07:45",
    monto: 48.0,
    metodo: "Bidones 20L",
    canal: "Delivery",
    responsable: "Luis Olano",
  },
  {
    id: 202,
    fecha: "Viernes 11 Oct.",
    hora: "08:30",
    monto: 24.0,
    metodo: "Bidones 20L",
    canal: "Delivery",
    responsable: "Rick Neser",
  },
  {
    id: 203,
    fecha: "Viernes 11 Oct.",
    hora: "07:45",
    monto: 8.0,
    metodo: "Bidones 20L",
    canal: "Local",
    responsable: "Adixon Torres",
  },
];

function TablaCaja() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const datax = await loadCajaData();
      setData(datax.data);
    }
    loadData();
  }, []);

  function formatHora(horaCompleta) {
    if (!horaCompleta) return "";
    // Extraer solo HH:MM:SS (eliminar microsegundos)
    return horaCompleta.split(".")[0];
  }

  function redondearADosDecimales(valor) {
    return Number(parseFloat(valor).toFixed(2));
  }

  const headers = ["FECHA", "HORA", "MONTO", "MÉTODO", "RESPONSABLE"];

  const getEstadoClasses = (canal) => {
    switch (canal) {
      case "Delivery":
        return "bg-green-100 text-green-800";
      case "Local":
        return "bg-blue-100 text-blue-800";
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
            {data.map((item) => (
              <tr key={item.id_retorno} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.fecha}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatHora(item.hora)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {redondearADosDecimales(item.total_cancelado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.efectivo} efectivo / {item.yape} yape
                </td>
                {/*
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClasses(
                      item.canal
                    )}`}
                  >
                    {item.canal}
                  </span>
                </td>*/}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.responsable}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default TablaCaja;
