import InputText from "./InputNumber";
import { useEffect, useState } from "react";
import { loadRetorno, updateRetorno } from "../../api/api.retorno";
import { X, Loader2, Package, DollarSign } from "lucide-react";

function ModalES({ id, setStateModal, onRegister }) {
  const [salida, setSalida] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
      setLoading(true);
      try {
        const salidax = await loadRetorno(id);
        setSalida(salidax.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
        alert("Error al cargar los datos de la salida");
      } finally {
        setLoading(false);
      }
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

  const handleClose = () => {
    setStateModal({ isOpen: false, selectedSalida: null });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  function formatHora(horaCompleta) {
    if (!horaCompleta) return "";
    return horaCompleta.split(".")[0];
  }

  function redondearADosDecimales(valor) {
    return Number(parseFloat(valor).toFixed(2));
  }

  const handleSubmit = async () => {
    // Validación
    if (formData.cantidadD > itemsGeneral.cantidadLe) {
      alert("La cantidad devuelta no puede ser mayor a la cantidad llevada");
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        cantidad: parseFloat(formData.cantidadD) || 0,
        efectivo: parseFloat(formData.efectivo) || 0,
        yape: parseFloat(formData.yape) || 0,
        total_cancelado: parseFloat(formData.total_cancelado) || 0,
      };

      await updateRetorno(id, updateData);

      if (onRegister) onRegister();
      handleClose();

      alert("✅ Información actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert(
        "❌ Error al actualizar la información: " +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mb-3" />
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              Cargando datos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!salida) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-2xl shadow-xl w-full max-w-4xl mt-8 lg:mt-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
              Actualizar Salida #{salida.id_salida}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  salida.estado_pago === "Pagado"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                }`}
              >
                {salida.estado_pago}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Hora: {formatHora(salida.hora)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Producto: {salida.nom_producto}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sección productos */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 lg:p-5 rounded-xl">
            <div className="flex items-center mb-4">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Actualizar productos regresados
              </h3>
            </div>

            <div className="space-y-4">
              <InputText
                title="Cantidad de bidones cargados"
                descripcion="Cantidad inicial"
                value={itemsGeneral.cantidadLe}
                readOnly
              />

              <InputText
                title="Cantidad devuelta"
                descripcion="Ingrese la cantidad devuelta"
                value={formData.cantidadD}
                onChange={(value) => handleForm("cantidadD", value)}
                min="0"
                max={itemsGeneral.cantidadLe}
              />

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Diferencia:{" "}
                  {itemsGeneral.cantidadLe - (formData.cantidadD || 0)} bidones
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Vendidos/Entregados
                </p>
              </div>
            </div>
          </div>

          {/* Sección dinero */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 lg:p-5 rounded-xl">
            <div className="flex items-center mb-4">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Actualizar dinero de productos
              </h3>
            </div>

            <div className="space-y-4">
              <InputText
                title="Total de dinero a cobrar"
                descripcion="Monto total esperado"
                value={itemsGeneral.dineroAP}
                readOnly
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputText
                  title="Efectivo"
                  descripcion="Ingrese el dinero en efectivo"
                  value={formData.efectivo}
                  onChange={(value) => handleForm("efectivo", value)}
                  min="0"
                />

                <InputText
                  title="Yape/Plin"
                  descripcion="Ingrese el dinero en Yape/Plin"
                  value={formData.yape}
                  onChange={(value) => handleForm("yape", value)}
                  min="0"
                />
              </div>

              <InputText
                title="Total cancelado"
                descripcion="Suma de efectivo + Yape"
                value={redondearADosDecimales(formData.total_cancelado)}
                readOnly
              />

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pendiente: S/{" "}
                  {redondearADosDecimales(
                    itemsGeneral.dineroAP - (formData.total_cancelado || 0)
                  )}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Por cobrar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                Deliverista:{" "}
                <span className="font-semibold">{salida.nom_trabajador}</span>
              </p>
              <p>
                Cliente:{" "}
                <span className="font-semibold">{salida.cliente || "N/A"}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`px-6 py-2 rounded-lg text-white font-semibold flex items-center ${
                  saving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition-colors`}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Información"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalES;
