function TablaTrabajadores({ trabajadores, onEdit }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Nombre Completo
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                DNI
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Tipo
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Sueldo
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Dirección
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {trabajadores.length > 0 ? (
              trabajadores.map((t, i) => (
                <tr
                  key={t.id_trabajador}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {t.nombre_completo || `${t.nombre_p} ${t.apellido_p}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t.dni_p || t.dni}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {t.tipo_trabajador_nombre ||
                        t.tipo_trabajador ||
                        "No especificado"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-semibold">
                    S/. {parseFloat(t.sueldo).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t.direccion}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onEdit(t)}
                      className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors text-sm font-medium shadow-sm"
                    >
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No se encontraron trabajadores
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaTrabajadores;
