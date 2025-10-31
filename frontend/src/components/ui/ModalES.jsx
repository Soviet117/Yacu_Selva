import InputText from "./InputNumber";
import { use, useEffect, useState } from "react";
import SubDetalleES from "../ui/SubDetalleES";
import { loadRetorno, updateRetorno } from "../../api/api.retorno";

function ModalES({ id, setStateModal, onRegister }) {
  const [salida, setSalida] = useState(null);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsGeneral, setItemsGeneral] = useState({
    cantidadLe: 0,
    dineroAP: 0,
  });
  const [formData, setFormData] = useState({
    cantidadD: 0,
    total_cancelado: 0,
    efectivo: 0,
    yape: 0,
  });

  useEffect(() => {
    async function loadData() {
      const salidax = await loadRetorno(id);
      console.log("Datos de la salida cargada:", salidax.data);
      setSalida(salidax.data);
    }
    loadData();
  }, [id]);

  useEffect(() => {
    const efectivo = parseFloat(formData.efectivo) || 0;
    const yape = parseFloat(formData.yape) || 0;
    const total = efectivo + yape;

    setFormData((prev) => ({
      ...prev,
      total_cancelado: total,
    }));
  }, [formData.efectivo, formData.yape]);

  useEffect(() => {
    if (!salida) return;
    setItemsGeneral({
      cantidadLe: salida.cantidad_llevada,
      dineroAP: salida.total_cancelar,
    });
    setFormData({
      cantidadD: salida.cantidad,
      total_cancelado: salida.total_cancelado,
      efectivo: salida.efectivo,
      yape: salida.yape,
    });
  }, [salida]);

  const handleForm = (nom, value) => {
    setFormData((prev) => ({
      ...prev,
      [nom]: value,
    }));
  };

  const handleCon = (e) => {
    if (e.target === e.currentTarget) {
      setStateModal({ isOpen: false, id: null });
    }
  };

  function formatHora(horaCompleta) {
    if (!horaCompleta) return "";
    // Extraer solo HH:MM:SS (eliminar microsegundos)
    return horaCompleta.split(".")[0];
  }

  function redondearADosDecimales(valor) {
    return Number(parseFloat(valor).toFixed(2));
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updateData = {
        cantidad: parseFloat(formData.cantidadD) || 0,
        efectivo: parseFloat(formData.efectivo) || 0,
        yape: parseFloat(formData.yape) || 0,
        total_cancelado: parseFloat(formData.total_cancelado) || 0,
      };

      console.log("Enviando datos:", updateData);

      const response = await updateRetorno(id, updateData);

      console.log("Actualización exitosa:", response.data);
      if (onRegister) onRegister();

      setStateModal({ isOpen: false, id: null });

      alert("Información actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar la información");
    } finally {
      setLoading(false);
    }
  };

  if (!salida)
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl">
          <p className="text-lg font-semibold">Cargando datos...</p>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={handleCon}>
      <div
        className="flex items-center justify-center mt-15"
        onClick={handleCon}
      >
        <div className="bg-gray-200 p-5 rounded-2xl">
          <div className="mb-4 text-center">
            <p className="text-2xl font-semibold ">
              Datos de la salida {salida.id_salida}
            </p>
            <p className="text-lg font-semibold text-gray-700">
              {salida.estado_pago}
            </p>
            <p className="text-sm font-medium text-gray-700">
              Hora de salida:{" "}
              <code className="text-lg font-semibold text-gray-700">
                {" "}
                {formatHora(salida.hora)}
              </code>
            </p>
          </div>
          <div className="flex items-center divide-x divide-gray-400 mb-4">
            <div className="p-4 ">
              <p className="text-center text-lg font-semibold">
                Actualizar productos regresados
              </p>
              <div>
                <form className="flex flex-col p-2 space-y-2">
                  <InputText
                    title={"Cantidad de bidones cargados"}
                    descripcion={salida.cantidad}
                    value={itemsGeneral.cantidadLe}
                    readOnly
                  />
                  <InputText
                    title={"Cantidad devuelta"}
                    descripcion={salida?.cantidad}
                    value={formData.cantidadD}
                    onChange={(value) => handleForm("cantidadD", value)}
                  />
                  <div className="max-h-48 overflow-y-scroll">
                    {components.map((item) => item.comp)}
                  </div>
                </form>
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-lg font-semibold">
                Actualizar dinero de productos
              </p>
              <div className="flex flex-col p-2 space-y-2">
                <InputText
                  title={"Total de dinero a cobrar"}
                  descripcion={"Ingrese el dinero dejado"}
                  value={itemsGeneral.dineroAP}
                />
                <div className="flex items-center gap-4">
                  <div className="max-w-30">
                    <InputText
                      title={"Efectivo"}
                      descripcion={"Ingrese el dinero en efectivo"}
                      value={formData.efectivo}
                      onChange={(value) => handleForm("efectivo", value)}
                    />
                  </div>
                  <div className="max-w-30">
                    <InputText
                      title={"Yape/Plin"}
                      descripcion={"Ingrese el dinero en Yape o Plin"}
                      value={formData.yape}
                      onChange={(value) => handleForm("yape", value)}
                    />
                  </div>
                </div>
                <InputText
                  title={"Total cancelado"}
                  value={redondearADosDecimales(formData.total_cancelado)}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <button
              className={`py-2 px-4 rounded-xl ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Información"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalES;
