function TargetCaja({ title, monto, subTitle, color, icon }) {
  const colorConfig = {
    green: {
      text: "text-green-600",
      bg: "bg-green-50",
      border: "border-l-green-500",
      trend: "text-green-500",
    },
    blue: {
      text: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-l-blue-500",
      trend: "text-blue-500",
    },
    purple: {
      text: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-l-purple-500",
      trend: "text-purple-500",
    },
    red: {
      text: "text-red-600",
      bg: "bg-red-50",
      border: "border-l-red-500",
      trend: "text-red-500",
    },
  };

  const config = colorConfig[color] || colorConfig.green;

  return (
    <div
      className={`p-6 bg-white rounded-2xl shadow-lg border-l-4 ${config.border} hover:shadow-xl transition-all duration-300 hover:scale-105`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 ${config.text}`}>
            S/. {typeof monto === "number" ? monto.toFixed(2) : monto}
          </p>
        </div>
        <div className={`p-3 rounded-full ${config.bg}`}>{icon}</div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{subTitle}</p>
      </div>
    </div>
  );
}

export default TargetCaja;
