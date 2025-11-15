// En src/components/ui/ModalPOS.jsx
import { useState, useEffect } from "react";
import { X, Store, User, Package, CreditCard } from "lucide-react";
import {
  registrarSalidaPOS,
  loadClientes,
  loadTrabajadoresPlanta,
  loadProducto,
} from "../../api/api.pos";

function ModalPOS({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    id_trabajador: "",
    id_producto: "",
    cantidad: "",
    id_cliente: "",
    metodo_pago: "efectivo",
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [clientesRes, trabajadoresRes, productosRes] = await Promise.all([
        loadClientes(),
        loadTrabajadoresPlanta(),
        loadProducto(),
      ]);

      console.log("📦 PRODUCTOS RECIBIDOS:", productosRes.data);

      setClientes(clientesRes.data);
      setTrabajadores(trabajadoresRes.data);

      // 🔥 CORRECCIÓN: Adaptar estructura {id, nombre} a {id_producto, nombre}
      let productosProcesados = [];

      if (productosRes.data && productosRes.data.length > 0) {
        productosProcesados = productosRes.data
          .map((producto) => {
            // Tu API devuelve {id: "1", nombre: "Bidon 20L"}
            return {
              id_producto: producto.id, // 🔥 Convertir id a id_producto
              nombre: producto.nombre,
              raw: producto, // Guardar datos originales
            };
          })
          .filter((producto) => producto.id_producto != null);
      }

      setProductos(productosProcesados);
      console.log("🎯 PRODUCTOS PROCESADOS:", productosProcesados);

      // Establecer valores por defecto
      if (trabajadoresRes.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          id_trabajador: trabajadoresRes.data[0].id?.toString() || "",
        }));
      }
      if (productosProcesados.length > 0) {
        setFormData((prev) => ({
          ...prev,
          id_producto: productosProcesados[0].id_producto.toString(),
        }));
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      alert("Error cargando datos iniciales");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.id_trabajador ||
      !formData.id_producto ||
      !formData.cantidad
    ) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      const datosParaEnviar = {
        id_trabajador: Number(formData.id_trabajador),
        id_producto: Number(formData.id_producto),
        cantidad: Number(formData.cantidad),
        id_cliente: formData.id_cliente ? Number(formData.id_cliente) : null,
        metodo_pago: formData.metodo_pago,
      };

      console.log("📤 ENVIANDO DATOS:", datosParaEnviar);

      // Validación
      if (
        isNaN(datosParaEnviar.id_trabajador) ||
        isNaN(datosParaEnviar.id_producto) ||
        isNaN(datosParaEnviar.cantidad)
      ) {
        throw new Error("Uno o más campos tienen valores inválidos");
      }

      const response = await registrarSalidaPOS(datosParaEnviar);
      alert("¡Venta POS registrada exitosamente!");
      onSuccess?.();
      onClose();

      // Resetear formulario
      setFormData({
        id_trabajador:
          trabajadores.length > 0 ? trabajadores[0].id?.toString() || "" : "",
        id_producto:
          productos.length > 0
            ? productos[0].id_producto?.toString() || ""
            : "",
        cantidad: "",
        id_cliente: "",
        metodo_pago: "efectivo",
      });
    } catch (error) {
      console.error("❌ Error registrando venta POS:", error);

      if (error.response) {
        console.log("📋 DATOS ENVIADOS:", formData);
        console.log("🔧 ERROR COMPLETO:", error.response.data);
        console.log(
          "📝 DETALLES:",
          error.response.status,
          error.response.statusText
        );
      }

      alert(
        "Error registrando venta: " +
          (error.response?.data?.error || error.message || "Error desconocido")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Store className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Punto de Venta
              </h2>
              <p className="text-sm text-gray-600">Registrar venta directa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Selección de Trabajador */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Atendedor *
            </label>
            <select
              value={formData.id_trabajador}
              onChange={(e) =>
                setFormData({ ...formData, id_trabajador: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            >
              <option value="">Seleccionar atendedor</option>
              {trabajadores.map((trab) => (
                <option key={`trab-${trab.id}`} value={trab.id}>
                  {trab.nombre} {trab.apellido} - {trab.tipo_trabajador}
                </option>
              ))}
            </select>
          </div>

          {/* Selección de Cliente (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente (Opcional)
            </label>
            <select
              value={formData.id_cliente}
              onChange={(e) =>
                setFormData({ ...formData, id_cliente: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="">Cliente eventual</option>
              {clientes.map((cliente) => (
                <option
                  key={`cliente-${cliente.id_cliente}`}
                  value={cliente.id_cliente}
                >
                  {cliente.nombre_cliente} - {cliente.numero}
                </option>
              ))}
            </select>
          </div>

          {/* Selección de Producto - CORREGIDO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Producto *
            </label>
            <select
              value={formData.id_producto}
              onChange={(e) =>
                setFormData({ ...formData, id_producto: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading || productos.length === 0}
            >
              <option value="">Seleccionar producto</option>
              {productos.map((producto) => (
                <option
                  key={`producto-${producto.id_producto}`}
                  value={producto.id_producto}
                >
                  {producto.nombre}
                </option>
              ))}
            </select>
            {productos.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                No hay productos disponibles
              </p>
            )}
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad *
            </label>
            <input
              type="number"
              min="1"
              value={formData.cantidad}
              onChange={(e) =>
                setFormData({ ...formData, cantidad: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresar cantidad"
              required
              disabled={loading}
            />
          </div>

          {/* Método de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Método de Pago *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["efectivo", "yape", "transferencia", "mixto"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, metodo_pago: method })
                  }
                  disabled={loading}
                  className={`p-3 text-sm rounded-lg border transition-all ${
                    formData.metodo_pago === method
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {method === "efectivo" && "💵 Efectivo"}
                  {method === "yape" && "📱 Yape"}
                  {method === "transferencia" && "🏦 Transferencia"}
                  {method === "mixto" && "💰 Mixto"}
                </button>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                loading || !formData.id_producto || productos.length === 0
              }
              className="flex-1 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Store className="h-4 w-4" />
                  Completar Venta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalPOS;
