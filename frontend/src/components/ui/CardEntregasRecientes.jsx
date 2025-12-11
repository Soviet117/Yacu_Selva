import SubCardDashboard from "./SubCardDashboard";

function formatHora(horaCompleta) {
  if (!horaCompleta) return "";
  return horaCompleta.split(".")[0];
}

function CardEntregasRecientes({ title, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-2xl">
        <p className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {title}
        </p>
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">
            No hay entregas recientes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
      <p className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {title}
      </p>
      <div className="space-y-3">
        {data.slice(0, 2).map((item, index) => (
          <SubCardDashboard
            key={item.id_salida || index}
            p={item.nom_trabajador || "Sin nombre"}
            p1={`${item.cantidad || 0} ${item.nom_producto || ""}`}
            p2={formatHora(item.hora)}
            p3={item.estado_salida || "Desconocido"}
          />
        ))}
      </div>
    </div>
  );
}

export default CardEntregasRecientes;
