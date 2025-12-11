function EncabezadoMenu({ span, negocio, tipo, isCollapsed = false }) {
  return (
    <div
      className={`flex items-center ${
        isCollapsed ? "justify-center p-4" : "space-x-3 mb-6 p-6 pb-2"
      }`}
    >
      <span className="p-2 bg-blue-500 rounded-lg font-extrabold text-white">
        {span}
      </span>

      {!isCollapsed && (
        <div className="overflow-hidden">
          <p className="text-lg font-semibold text-gray-800 dark:text-white truncate">
            {negocio}
          </p>
          <p className="text-grasy-500 dark:text-gray-400 text-sm truncate">
            {tipo}
          </p>
        </div>
      )}
    </div>
  );
}

export default EncabezadoMenu;
