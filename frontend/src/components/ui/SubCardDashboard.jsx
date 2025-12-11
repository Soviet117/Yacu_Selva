function SubCardDashboard({ p, p1, p2, p3 }) {
  // Definir estados para entregas
  const estadosEntregas = {
    Completada:
      "text-green-800 dark:text-green-300 bg-green-200 dark:bg-green-900/30 px-2 py-1 rounded-lg text-xs font-medium",
    "En ruta":
      "text-blue-800 dark:text-blue-300 bg-blue-200 dark:bg-blue-900/30 px-2 py-1 rounded-lg text-xs font-medium",
    Pendiente:
      "text-yellow-800 dark:text-yellow-300 bg-yellow-200 dark:bg-yellow-900/30 px-2 py-1 rounded-lg text-xs font-medium",
    Cancelada:
      "text-red-800 dark:text-red-300 bg-red-200 dark:bg-red-900/30 px-2 py-1 rounded-lg text-xs font-medium",
  };

  // Si p3 es una fecha (contiene "-" o "/"), es un ingreso
  const esFecha = p3 && (p3.includes("-") || p3.includes("/"));

  let estadoClass = "";
  if (esFecha) {
    // Para ingresos (fechas)
    estadoClass = "text-gray-600 dark:text-gray-400 text-xs";
  } else {
    // Para entregas (estados)
    estadoClass =
      estadosEntregas[p3] ||
      "text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-lg text-xs font-medium";
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-700/50 flex justify-between items-center p-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">
          {p}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-xs truncate mt-1">
          {p1}
        </p>
      </div>
      <div className="text-end ml-2 flex-shrink-0">
        <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
          {p2}
        </p>
        <p className={`${estadoClass} inline-block mt-1`}>
          {esFecha ? p3 : p3}
        </p>
      </div>
    </div>
  );
}

export default SubCardDashboard;
