import InputText from "../ui/InputNumber";
import InputCheck from "../ui/InputCheck";
import loadDeliverista from "../../api/api.deliveristas";
import loadProducto from "../../api/api.producto";
import { useState, useEffect } from "react";
import { createSalida } from "../../api/api.salida";
import { Loader2 } from "lucide-react";

function RegisES({ onRegister }) {
  const [loading, setLoading] = useState(false);
  const [dataDe, setDataDe] = useState([]);
  const [dataPro, setDataPro] = useState([]);
  const [formData, setFormData] = useState({
    id_trabajador: "",
    cantidad: "",
    id_producto: "",
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);
        const [deliveristas, productos] = await Promise.all([
          loadDeliverista(),
          loadProducto(),
        ]);
        setDataDe(deliveristas.data || []);
        setDataPro(productos.data || []);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, []);

  const handleInputChange = (nom, value) => {
    setFormData((prev) => ({
      ...prev,
      [nom]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (
      !formData.id_trabajador ||
      !formData.cantidad ||
      !formData.id_producto
    ) {
      alert("Por favor, complete todos los campos");
      return;
    }

    if (formData.cantidad <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    setLoading(true);
    try {
      await createSalida(formData);
      alert("✅ Salida registrada con éxito");
      setFormData({
        id_trabajador: "",
        cantidad: "",
        id_producto: "",
      });
      if (onRegister) onRegister();
    } catch (error) {
      console.error("Error al registrar la salida:", error);
      alert(
        "❌ Error al registrar salida: " +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-gray-600 dark:text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-2xl shadow-md mb-6 border border-gray-200 dark:border-gray-700">
      <p className="text-lg lg:text-xl font-semibold pb-4 text-gray-800 dark:text-white">
        Registrar Nueva Salida
      </p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputCheck
            title={"Deliverista"}
            items={dataDe}
            value={formData.id_trabajador}
            onChange={(value) => handleInputChange("id_trabajador", value)}
          />

          <InputText
            title={"Cantidad"}
            type={"number"}
            descripcion={"Ingrese la cantidad"}
            value={formData.cantidad}
            onChange={(value) => handleInputChange("cantidad", value)}
            min="1"
          />

          <InputCheck
            title={"Tipo producto"}
            items={dataPro}
            value={formData.id_producto}
            onChange={(value) => handleInputChange("id_producto", value)}
          />

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 lg:py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : (
                "Registrar"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Información adicional */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>📝 Registre las salidas de productos para delivery</p>
      </div>
    </div>
  );
}

export default RegisES;
