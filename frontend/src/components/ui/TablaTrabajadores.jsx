export function TablaTrabajadores({ trabajadores }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Puesto</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Teléfono</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha Ingreso</th>
            </tr>
          </thead>
          <tbody>
            {trabajadores.map((trabajador, index) => (
              <tr
                key={trabajador.id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
              >
                <td className="px-6 py-4 text-sm text-gray-800">{trabajador.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{trabajador.puesto}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{trabajador.telefono}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{trabajador.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{trabajador.fechaIngreso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {trabajadores.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron trabajadores
        </div>
      )}
    </div>
  );
}