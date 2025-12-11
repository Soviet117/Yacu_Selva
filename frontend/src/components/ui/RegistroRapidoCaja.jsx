import { useState, useEffect } from "react";
import { Plus, Minus, Save, X, User } from "lucide-react";
import {
  registrarMovimientoCaja,
  obtenerTrabajadores,
} from "../../api/api.caja";

function RegistroRapidoCaja({ onRegistroSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trabajadores, setTrabajadores] = useState([]);
  const [cargandoTrabajadores, setCargandoTrabajadores] = useState(false);

  const [formData, setFormData] = useState({
    tipo: "ingreso",
    monto: "",
    descripcion: "",
    metodo: "efectivo",
    id_trabajador: "",
  });

  useEffect(() => {
    if (isOpen) {
      cargarTrabajadores();
    }
  }, [isOpen]);

  const cargarTrabajadores = async () => {
    setCargandoTrabajadores(true);
    try {
      const response = await obtenerTrabajadores();
      setTrabajadores(response.data || []);

      if (response.data?.length > 0 && !formData.id_trabajador) {
        setFormData((prev) => ({
          ...prev,
          id_trabajador: response.data[0].id_trabajador,
        }));
      }
    } catch (error) {
      console.error("Error cargando trabajadores:", error);
    } finally {
      setCargandoTrabajadores(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_trabajador) {
      alert("Por favor selecciona un trabajador responsable");
      return;
    }

    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      alert("Por favor ingresa un monto válido");
      return;
    }

    if (!formData.descripcion.trim()) {
      alert("Por favor ingresa una descripción");
      return;
    }

    setLoading(true);

    try {
      await registrarMovimientoCaja(formData);

      onRegistroSuccess?.();
      setIsOpen(false);
      setFormData({
        tipo: "ingreso",
        monto: "",
        descripcion: "",
        metodo: "efectivo",
        id_trabajador:
          trabajadores.length > 0 ? trabajadores[0].id_trabajador : "",
      });

      alert("✅ Movimiento registrado exitosamente!");
    } catch (error) {
      console.error("Error registrando movimiento:", error);
      alert(
        "❌ Error al registrar el movimiento: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50"
        title="Nuevo movimiento"
      >
        <Plus className="h-6 w-6" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm mx-auto max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 lg:p-6 border-b dark:border-gray-700">
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">
                  Nuevo Movimiento
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Registro rápido de ingresos/egresos
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                disabled={loading}
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
              {/* Trabajador Responsable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Trabajador Responsable *
                </label>
                {cargandoTrabajadores ? (
                  <div className="p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                    Cargando trabajadores...
                  </div>
                ) : trabajadores.length === 0 ? (
                  <div className="p-3 text-sm border border-red-300 dark:border-red-600 rounded-lg text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
                    No hay trabajadores registrados
                  </div>
                ) : (
                  <select
                    value={formData.id_trabajador}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id_trabajador: e.target.value,
                      })
                    }
                    className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                    disabled={loading}
                  >
                    <option value="">Selecciona un trabajador</option>
                    {trabajadores.map((trab) => (
                      <option
                        key={trab.id_trabajador}
                        value={trab.id_trabajador}
                      >
                        {trab.nombre_completo} - {trab.dni}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Tipo de Movimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Movimiento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tipo: "ingreso" })
                    }
                    disabled={loading}
                    className={`p-3 text-sm rounded-lg border transition-all flex items-center justify-center gap-2 ${
                      formData.tipo === "ingreso"
                        ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Plus className="h-4 w-4" />
                    Ingreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: "egreso" })}
                    disabled={loading}
                    className={`p-3 text-sm rounded-lg border transition-all flex items-center justify-center gap-2 ${
                      formData.tipo === "egreso"
                        ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Minus className="h-4 w-4" />
                    Egreso
                  </button>
                </div>
              </div>

              {/* Monto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monto (S/.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: e.target.value })
                  }
                  className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>

              {/* Método */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Método de Pago
                </label>
                <select
                  value={formData.metodo}
                  onChange={(e) =>
                    setFormData({ ...formData, metodo: e.target.value })
                  }
                  className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={loading}
                >
                  <option value="efectivo">💵 Efectivo</option>
                  <option value="yape">📱 Yape</option>
                  <option value="transferencia">🏦 Transferencia</option>
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows="3"
                  placeholder="Ej: Venta de bidones, Pago de servicios, Compra de materiales..."
                  required
                  disabled={loading}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 p-3 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={
                    loading || !formData.id_trabajador || cargandoTrabajadores
                  }
                  className="flex-1 p-3 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Registrar
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default RegistroRapidoCaja;
