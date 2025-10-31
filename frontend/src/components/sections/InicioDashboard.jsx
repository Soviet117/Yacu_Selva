import CardDashboard from "../ui/CardDashboard";

function InicioDashboard() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      <CardDashboard
        titulo={"Entergas Hoy"}
        cantidad={"24"}
        descripcion={"+12% vs ayer"}
        color={"blue"}
      />
      <CardDashboard
        titulo={"Ingresos hoy"}
        cantidad={"S/. 1,000"}
        descripcion={"+8% vs ayer"}
        color={"green"}
      />
      <CardDashboard
        titulo={"Ingresos hoy"}
        cantidad={"S/. 1,000"}
        descripcion={"+8% vs ayer"}
        color={"purple"}
      />
      <CardDashboard
        titulo={"Ingresos hoy"}
        cantidad={"S/. 1,000"}
        descripcion={"+8% vs ayer"}
        color={"orange"}
      />
    </div>
  );
}

export default InicioDashboard;
