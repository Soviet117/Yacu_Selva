import { useState, useEffect } from 'react';

const API_URL = "http://localhost:8000/database/api/v1/trabajadores/";
const TIPOS_TRABAJADOR_URL = "http://localhost:8000/database/api/v1/tipos-trabajador/";
const HORARIOS_URL = "http://localhost:8000/database/api/v1/horarios/";

export function FormularioAgregarTrabajador({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nombre_p: '',
    apellido_p: '',
    dni_p: '',
    direccion: '',
    url_dni: '',
    id_tipo_trabajador: '',
    id_horario: '',
    sueldo: ''
  });

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
      console.error('Error al cargar tipos de trabajador:', err);
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
      console.error('Error al cargar horarios:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones básicas
    if (!formData.nombre_p || !formData.apellido_p || !formData.dni_p || 
        !formData.direccion || !formData.id_tipo_trabajador || 
        !formData.id_horario || !formData.sueldo) {
      setError('Todos los campos son obligatorios excepto URL DNI');
      setLoading(false);
      return;
    }

    // Validar DNI (8 dígitos)
    if (!/^\d{8}$/.test(formData.dni_p)) {
      setError('El DNI debe tener 8 dígitos');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_p: formData.nombre_p.trim(),
          apellido_p: formData.apellido_p.trim(),
          dni_p: formData.dni_p.trim(),
          direccion: formData.direccion.trim(),
          url_dni: formData.url_dni.trim(),
          id_tipo_trabajador: parseInt(formData.id_tipo_trabajador),
          id_horario: parseInt(formData.id_horario),
          sueldo: parseFloat(formData.sueldo)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.dni_p?.[0] || errorData.detail || 'Error al crear el trabajador');
      }

      const data = await response.json();
      onSuccess(data);
      
      // Limpiar formulario
      setFormData({
        nombre_p: '',
        apellido_p: '',
        dni_p: '',
        direccion: '',
        url_dni: '',
        id_tipo_trabajador: '',
        id_horario: '',
        sueldo: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Agregar Nuevo Trabajador</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Datos de Persona */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Datos Personales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre_p"
                value={formData.nombre_p}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Juan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="apellido_p"
                value={formData.apellido_p}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="dni_p"
                value={formData.dni_p}
                onChange={handleInputChange}
                required
                maxLength="8"
                pattern="\d{8}"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 12345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL DNI (Imagen)
              </label>
              <input
                type="url"
                name="url_dni"
                value={formData.url_dni}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Av. Principal 123"
            />
          </div>
        </div>

        {/* Datos de Trabajador */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Datos Laborales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Trabajador <span className="text-red-500">*</span>
              </label>
              <select
                name="id_tipo_trabajador"
                value={formData.id_tipo_trabajador}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione...</option>
                {tiposTrabajador.map(tipo => (
                  <option key={tipo.id_tipo_trabajador} value={tipo.id_tipo_trabajador}>
                    {tipo.nom_tt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horario <span className="text-red-500">*</span>
              </label>
              <select
                name="id_horario"
                value={formData.id_horario}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione...</option>
                {horarios.map(horario => (
                  <option key={horario.id_horario} value={horario.id_horario}>
                    {horario.entrada} - {horario.salida}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sueldo (S/.) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="sueldo"
                value={formData.sueldo}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 1500.00"
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Agregando...' : 'Agregar Trabajador'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}