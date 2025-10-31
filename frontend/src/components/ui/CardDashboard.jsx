function CardDashboard({ titulo, cantidad, descripcion, color }) {
  const colorClasses = {
    blue: "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-blue-100",
    orange:
      "bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-orange-100",
    green:
      "bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-green-100",
    purple:
      "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-purple-100",
  };

  return (
    <div className={`${colorClasses[color]} p-4 rounded-xl`}>
      <p>{titulo}</p>
      <p className="text-2xl font-bold text-white">{cantidad}</p>
      <p>{descripcion}</p>
    </div>
  );
}

export default CardDashboard;
