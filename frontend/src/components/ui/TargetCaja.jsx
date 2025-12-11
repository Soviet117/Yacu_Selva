function TargetCaja({ title, monto, subTitle, color, icon }) {
  const colorConfig = {
    green: {
      text: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/30",
      bgIcon: "bg-green-100 dark:bg-green-800",
      border: "border-l-green-500 dark:border-l-green-400",
      iconColor: "text-green-600 dark:text-green-300",
    },
    blue: {
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      bgIcon: "bg-blue-100 dark:bg-blue-800",
      border: "border-l-blue-500 dark:border-l-blue-400",
      iconColor: "text-blue-600 dark:text-blue-300",
    },
    purple: {
      text: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/30",
      bgIcon: "bg-purple-100 dark:bg-purple-800",
      border: "border-l-purple-500 dark:border-l-purple-400",
      iconColor: "text-purple-600 dark:text-purple-300",
    },
    red: {
      text: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/30",
      bgIcon: "bg-red-100 dark:bg-red-800",
      border: "border-l-red-500 dark:border-l-red-400",
      iconColor: "text-red-600 dark:text-red-300",
    },
  };

  const config = colorConfig[color] || colorConfig.green;

  // Formatear monto
  const formatMonto = (value) => {
    if (typeof value === "number") {
      return value.toFixed(2);
    }
    return value;
  };

  return (
    <div
      className={`p-4 lg:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-l-4 ${config.border} hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-700`}
    >
      <div className="flex justify-between items-start mb-3 lg:mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide truncate">
            {title}
          </p>
          <p
            className={`text-xl lg:text-3xl font-bold mt-1 lg:mt-2 ${config.text}`}
          >
            S/. {formatMonto(monto)}
          </p>
        </div>
        <div
          className={`p-2 lg:p-3 rounded-full ${config.bgIcon} flex-shrink-0 ml-2`}
        >
          <div className={config.iconColor}>{icon}</div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 truncate">
          {subTitle}
        </p>
      </div>
    </div>
  );
}

export default TargetCaja;
