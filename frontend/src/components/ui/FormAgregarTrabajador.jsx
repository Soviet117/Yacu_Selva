import { useState, useEffect } from "react";

const TIPOS_TRABAJADOR_URL =
  "http://localhost:8000/database/api/v1/tipos-trabajador/";
const HORARIOS_URL = "http://localhost:8000/database/api/v1/horarios/";

export function FormularioAgregarTrabajador({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
}) {
  const [tiposTrabajador, setTiposTrabajador] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTiposTrabajador();
    fetchHorarios();
  }, []);

  const fetchTiposTrabajador = async () => {
    try {
      const response = await fetch(TIPOS_TRABAJADOR_URL);
      if (response.ok) {
        const data = await response.json();
        setTiposTrabajador(data);
      }
    } catch (err) {
      console.error("Error al cargar tipos de trabajador:", err);
    }
  };

  const fetchHorarios = async () => {
    try {
      const response = await fetch(HORARIOS_URL);
      if (response.ok) {
        const data = await response.json();
        setHorarios(data);
      }
    } catch (err) {
      console.error("Error al cargar horarios:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones básicas
    if (
      !formData.nombre_p ||
      !formData.apellido_p ||
      !formData.dni_p ||
      !formData.direccion ||
      !formData.id_tipo_trabajador ||
      !formData.id_horario ||
      !formData.sueldo
    ) {
      setError("Todos los campos son obligatorios excepto URL DNI");
      setLoading(false);
      return;
    }

    // Validar DNI (8 dígitos)
    if (!/^\d{8}$/.test(formData.dni_p)) {
      setError("El DNI debe tener 8 dígitos");
      setLoading(false);
      return;
    }

    try {
      await onSubmit();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Datos de Persona */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Datos Personales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre_p"
                value={formData.nombre_p}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Juan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="apellido_p"
                value={formData.apellido_p}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DNI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="dni_p"
                value={formData.dni_p}
                onChange={onInputChange}
                required
                maxLength="8"
                pattern="\d{8}"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 12345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL DNI (Imagen)
              </label>
              <input
                type="url"
                name="url_dni"
                value={formData.url_dni}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={onInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Av. Principal 123"
            />
          </div>
        </div>

        {/* Datos de Trabajador */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Datos Laborales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Trabajador <span className="text-red-500">*</span>
              </label>
              <select
                name="id_tipo_trabajador"
                value={formData.id_tipo_trabajador}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione...</option>
                {tiposTrabajador.map((tipo) => (
                  <option
                    key={tipo.id_tipo_trabajador}
                    value={tipo.id_tipo_trabajador}
                  >
                    {tipo.nom_tt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horario <span className="text-red-500">*</span>
              </label>
              <select
                name="id_horario"
                value={formData.id_horario}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione...</option>
                {horarios.map((horario) => (
                  <option key={horario.id_horario} value={horario.id_horario}>
                    {horario.entrada} - {horario.salida}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sueldo (S/.) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="sueldo"
                value={formData.sueldo}
                onChange={onInputChange}
                required
                step="0.01"
                min="0"
                className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 1500.00"
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Agregando..." : "Agregar Trabajador"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}
