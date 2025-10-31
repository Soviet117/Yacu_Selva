export function FormularioDespedirTrabajador({ trabajadores, selectedWorker, onSelectWorker, onConfirm, onCancel }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">Selecciona el trabajador que deseas despedir:</p>
      <select
        value={selectedWorker?.id || ''}
        onChange={(e) => onSelectWorker(trabajadores.find(t => t.id === parseInt(e.target.value)))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
      >
        <option value="">-- Seleccionar trabajador --</option>
        {trabajadores.map(t => (
          <option key={t.id} value={t.id}>
            {t.nombre} - {t.puesto}
          </option>
        ))}
      </select>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onConfirm}
          disabled={!selectedWorker}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Confirmar
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
