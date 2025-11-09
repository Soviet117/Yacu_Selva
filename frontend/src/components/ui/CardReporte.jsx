// CardReporte.jsx - Actualizado
import axios from "axios";

export function CardReporte({ titulo, descrip, tipo }) {
  const generarReporte = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/database/api/v1/reportes/generar_reporte/",
        { tipo_reporte: tipo },
        {
          responseType: "blob", // Importantísimo para archivos
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Nombre del archivo basado en el tipo
      const fecha = new Date().toISOString().split("T")[0];
      let nombreArchivo = "";

      switch (tipo) {
        case "diario":
          nombreArchivo = `reporte_diario_${fecha}.xlsx`;
          break;
        case "semanal":
          nombreArchivo = `reporte_semanal_${fecha}.xlsx`;
          break;
        case "mensual":
          const mes = new Date().toISOString().slice(0, 7);
          nombreArchivo = `reporte_mensual_${mes}.xlsx`;
          break;
        default:
          nombreArchivo = `reporte_${fecha}.xlsx`;
      }

      link.setAttribute("download", nombreArchivo);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generando reporte:", error);
      alert(
        "Error al generar el reporte. Revisa la consola para más detalles."
      );
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 border-1 border-gray-200 hover:shadow-xl transition-shadow">
      <div className="px-2">
        <p className="font-semibold text-lg">{titulo}</p>
        <p className="text-gray-500 text-sm mt-1">{descrip}</p>
      </div>
      <button
        onClick={generarReporte}
        className="text-center w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors font-medium"
      >
        Generar Excel
      </button>
    </div>
  );
}
