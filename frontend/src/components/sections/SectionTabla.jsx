import TablaES from "../ui/TablaES";

function SectionTabla({ refreshTable, onRegister }) {
  return (
    <div>
      <div className=" p-4 pb-5 border-b border-gray-200 bg-white rounded-t-xl">
        <h2 className="text-lg font-semibold text-gray-800">
          Entregas del Día
        </h2>
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
