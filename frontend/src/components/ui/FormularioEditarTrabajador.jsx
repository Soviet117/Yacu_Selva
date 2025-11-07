import { useState, useEffect } from "react";

const TIPOS_TRABAJADOR_URL = "http://localhost:8000/database/api/v1/tipos-trabajador/";
const HORARIOS_URL = "http://localhost:8000/database/api/v1/horarios/";

export function FormularioEditarTrabajador({ formData, onInputChange, onSubmit, onCancel }) {
  const [tiposTrabajador, setTiposTrabajador] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTipos, resHorarios] = await Promise.all([
          fetch(TIPOS_TRABAJADOR_URL),
          fetch(HORARIOS_URL),
        ]);

        const tipos = resTipos.ok ? await resTipos.json() : [];
        const horariosData = resHorarios.ok ? await resHorarios.json() : [];

        setTiposTrabajador(tipos);
        setHorarios(horariosData);
      } catch (err) {
        console.error("Error cargando datos de selects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 py-6">Cargando datos...</p>;
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      {/* Datos personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            name="nombre_p"
            value={formData.nombre_p || ""}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          <input
            type="text"
            name="apellido_p"
            value={formData.apellido_p || ""}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
          <input
            type="text"
            name="dni_p"
            value={formData.dni_p || ""}
            onChange={onInputChange}
            maxLength="8"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion || ""}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Datos laborales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Trabajador
          </label>
          <select
            name="id_tipo_trabajador"
            value={formData.id_tipo_trabajador || ""}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione...</option>
            {tiposTrabajador.map((tipo) => (
              <option key={tipo.id_tipo_trabajador} value={tipo.id_tipo_trabajador}>
                {tipo.nom_tt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
          <select
            name="id_horario"
            value={formData.id_horario || ""}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione...</option>
            {horarios.map((h) => (
              <option key={h.id_horario} value={h.id_horario}>
                {h.entrada} - {h.salida}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sueldo (S/.)</label>
          <input
            type="number"
            name="sueldo"
            value={formData.sueldo || ""}
            onChange={onInputChange}
            step="0.01"
            min="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-6 pt-4 border-t">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Guardar Cambios
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
