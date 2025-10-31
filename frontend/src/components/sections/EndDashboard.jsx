import CardInfoDashboard from "../ui/CardInfoDashboard";

function EndDashboard() {
  return (
    <div className="bg-gray-100 ">
      <div className="grid grid-cols-2 gap-4">
        <CardInfoDashboard title={"Entregas Recientes"} tipo={"entrega"} />
        <CardInfoDashboard title={"Ingresos Recientes"} tipo={"ingresos"} />
      </div>
    </div>
  );
}

export default EndDashboard;
