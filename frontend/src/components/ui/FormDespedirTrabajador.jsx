import { useState, useEffect } from "react";

export function FormularioDespedirTrabajador({ onConfirm, onCancel }) {
  const [trabajadores, setTrabajadores] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar trabajadores al montar el componente
  useEffect(() => {
    fetchTrabajadores();
  }, []);

  const fetchTrabajadores = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/database/api/v1/trabajadores/"
      );
      if (!res.ok) throw new Error("Error al obtener los trabajadores");
      const data = await res.json();
      setTrabajadores(data);
    } catch (err) {
      setError("No se pudieron cargar los trabajadores");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedWorker) {
      setError("Debes seleccionar un trabajador");
      return;
    }

    if (
      !window.confirm(
        `¿Estás seguro de despedir a ${selectedWorker.nombre_completo}?`
      )
    )
      return;

    setLoading(true);
    setError(null);

    try {
      // ✅ Llama a onConfirm y pasa el trabajador seleccionado
      await onConfirm(selectedWorker);
      // El cierre del modal y actualización de la tabla se maneja en el padre
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Despedir Trabajador
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <p className="text-gray-600 mb-3">
        Selecciona el trabajador que deseas despedir:
      </p>

      <select
        value={selectedWorker?.id_trabajador || ""}
        onChange={(e) => {
          const id = parseInt(e.target.value);
          const trabajador = trabajadores.find((t) => t.id_trabajador === id);
          setSelectedWorker(trabajador || null);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
      >
        <option value="">-- Seleccionar trabajador --</option>
        {trabajadores.map((t) => (
          <option key={t.id_trabajador} value={t.id_trabajador}>
            {t.nombre_completo} - {t.tipo_trabajador}
          </option>
        ))}
      </select>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleDelete}
          disabled={!selectedWorker || loading}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Eliminando..." : "Confirmar Despido"}
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
