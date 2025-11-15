import { useState, useEffect } from "react";
import { Plus, Minus, Save, X } from "lucide-react";
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
      setTrabajadores(response.data);

      if (response.data.length > 0 && !formData.id_trabajador) {
        setFormData((prev) => ({
          ...prev,
          id_trabajador: response.data[0].id_trabajador,
        }));
      }
    } catch (error) {
      console.error("Error cargando trabajadores:", error);
      alert("Error al cargar la lista de trabajadores");
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

    setLoading(true);

    try {
      const response = await registrarMovimientoCaja(formData);
      console.log("Movimiento registrado:", response.data);

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

      alert("Movimiento registrado exitosamente!");
    } catch (error) {
      console.error("Error registrando movimiento:", error);
      alert(
        "Error al registrar el movimiento: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50"
      >
        <Plus className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-75 flex items-center justify-center z-50 p-4">
          {/* Cambios principales aquí - modal más compacto y responsive */}
          <div className="bg-white rounded-2xl w-full max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
            {/* Header más compacto */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                Nuevo Movimiento
              </h2>
              <button
                onClick={() => !loading && setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              {/* Trabajador Responsable */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Trabajador Responsable *
                </label>
                {cargandoTrabajadores ? (
                  <div className="p-2 text-xs border border-gray-300 rounded-lg text-gray-500">
                    Cargando trabajadores...
                  </div>
                ) : trabajadores.length === 0 ? (
                  <div className="p-2 text-xs border border-red-300 rounded-lg text-red-500 bg-red-50">
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
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tipo de Movimiento
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, tipo: "ingreso" })
                    }
                    disabled={loading}
                    className={`p-2 text-xs rounded-lg border transition-all ${
                      formData.tipo === "ingreso"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Plus className="h-3 w-3 inline mr-1" />
                    Ingreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tipo: "egreso" })}
                    disabled={loading}
                    className={`p-2 text-xs rounded-lg border transition-all ${
                      formData.tipo === "egreso"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Minus className="h-3 w-3 inline mr-1" />
                    Egreso
                  </button>
                </div>
              </div>

              {/* Monto */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
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
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>

              {/* Método */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Método
                </label>
                <select
                  value={formData.metodo}
                  onChange={(e) =>
                    setFormData({ ...formData, metodo: e.target.value })
                  }
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="yape">Yape</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Ej: Venta de bidones, Pago de servicios..."
                  required
                  disabled={loading}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="flex-1 p-2 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={
                    loading || !formData.id_trabajador || cargandoTrabajadores
                  }
                  className="flex-1 p-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3" />
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
