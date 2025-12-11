import TablaES from "../ui/TablaES";

function SectionTabla({ refreshTable, onRegister }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-4 pb-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white">
          📋 Entregas del Día
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Lista de entregas y ventas POS registradas hoy
        </p>
      </div>
      <TablaES
        key={"tabla_ES"}
        refreshTable={refreshTable}
        onRegister={onRegister}
      />
    </div>
  );
}

export default SectionTabla;
