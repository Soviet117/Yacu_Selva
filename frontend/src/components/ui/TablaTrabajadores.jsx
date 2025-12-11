function TablaTrabajadores({ trabajadores, onEdit }) {
  // Función para obtener clases de tipo de trabajador
  const getTipoTrabajadorClasses = (tipo) => {
    const tipos = {
      administrativo:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
      repartidor:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      vendedor:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      supervisor:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
      operario:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
      gerente: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    };

    return (
      tipos[tipo?.toLowerCase()] ||
      "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
    );
  };

  // Función para formatear el tipo de trabajador
  const formatTipoTrabajador = (tipo) => {
    if (!tipo) return "No especificado";

    const tipos = {
      administrativo: "🏢 Administrativo",
      repartidor: "🚚 Repartidor",
      vendedor: "💼 Vendedor",
      supervisor: "👨‍💼 Supervisor",
      operario: "👷 Operario",
      gerente: "👔 Gerente",
    };

    return tipos[tipo.toLowerCase()] || tipo;
  };

  // Calcular total de sueldos
  const totalSueldos = trabajadores.reduce(
    (sum, t) => sum + (parseFloat(t.sueldo) || 0),
    0
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header de la tabla */}
      <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Lista de Trabajadores
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {trabajadores.length} trabajadores registrados
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Total nómina:{" "}
              <span className="font-bold">S/. {totalSueldos.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                Trabajador
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                DNI
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                Tipo
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                Sueldo
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                Dirección
              </th>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {trabajadores.length > 0 ? (
              trabajadores.map((t, i) => (
                <tr
                  key={t.id_trabajador}
                  className={`${
                    i % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-800/50"
                  } hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-150`}
                >
                  {/* Nombre Completo */}
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {(
                            t.nombre_completo?.[0] ||
                            t.nombre_p?.[0] ||
                            "U"
                          ).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                          {t.nombre_completo ||
                            `${t.nombre_p || ""} ${
                              t.apellido_p || ""
                            }`.trim() ||
                            "Sin nombre"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {t.id_trabajador}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* DNI */}
                  <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100 font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg inline-block">
                      {t.dni_p || t.dni || "N/A"}
                    </div>
                  </td>

                  {/* Tipo */}
                  <td className="px-4 lg:px-6 py-4">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoTrabajadorClasses(
                        t.tipo_trabajador
                      )}`}
                    >
                      {formatTipoTrabajador(
                        t.tipo_trabajador_nombre || t.tipo_trabajador
                      )}
                    </span>
                  </td>

                  {/* Sueldo */}
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        S/. {parseFloat(t.sueldo || 0).toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Mensual
                      </span>
                    </div>
                  </td>

                  {/* Dirección */}
                  <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                      {t.direccion || "Sin dirección"}
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 lg:px-6 py-4 text-center">
                    <button
                      onClick={() => onEdit(t)}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto min-w-[100px]"
                      title="Editar trabajador"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                      No se encontraron trabajadores
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Intenta ajustar tus filtros de búsqueda
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer de la tabla */}
      {trabajadores.length > 0 && (
        <div className="px-4 lg:px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="mb-2 sm:mb-0">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Mostrando {trabajadores.length} trabajadores
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <span className="font-medium">Sueldo promedio:</span>{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  S/. {(totalSueldos / trabajadores.length).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="font-medium">Sueldo total:</span>{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  S/. {totalSueldos.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TablaTrabajadores;
