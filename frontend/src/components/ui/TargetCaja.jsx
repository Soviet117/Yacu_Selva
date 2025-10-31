function TargetCaja({ title, monto, subTitle, color }) {
  const colors = {
    green: "text-green-600 text-2xl font-bold",
    blue: "text-blue-600 text-2xl font-bold",
    purple: "text-purple-600 text-2xl font-bold",
  };

  return (
    <div className="px-4 py-6 bg-white rounded-2xl ring2 ring-gray-500 shadow-lg">
      <p className="font-semibold mb-2">{title}</p>
      <p className={`${colors[color]}`}>{monto}</p>
      <p className="text-gray-500 font-medium">{subTitle}</p>
    </div>
  );
}

export default TargetCaja;
