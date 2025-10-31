import TablaCaja from "../ui/TablaCaja";

function SecctionTablaCaja() {
  return (
    <div>
      <div className=" p-4 pb-5 border-b border-gray-200 bg-white rounded-t-xl">
        <h2 className="text-lg font-semibold text-gray-800">
          Ingresos del Día
        </h2>
      </div>
      <TablaCaja />
    </div>
  );
}

export default SecctionTablaCaja;
