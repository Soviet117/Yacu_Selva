function CardDashboard({ titulo, cantidad, descripcion, color }) {
  const colorClasses = {
    blue: "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800 text-blue-100",
    orange:
      "bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800 text-orange-100",
    green:
      "bg-gradient-to-r from-green-500 via-green-600 to-green-700 dark:from-green-600 dark:via-green-700 dark:to-green-800 text-green-100",
    purple:
      "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 dark:from-purple-600 dark:via-purple-700 dark:to-purple-800 text-purple-100",
  };

  return (
    <div
      className={`${colorClasses[color]} p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <p className="text-sm font-medium opacity-90">{titulo}</p>
      <p className="text-2xl font-bold mt-2">{cantidad}</p>
      <p className="text-sm mt-1 opacity-90">{descripcion}</p>
    </div>
  );
}

export default CardDashboard;
