import CardDashboard from "../ui/CardDashboard";
import { useState, useEffect } from "react";
import { loadDataStartDashboard } from "../../api/api.startdashboard";

function InicioDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const datax = await loadDataStartDashboard();
      setData(datax.data);
    }
    loadData();
  }, []);

  if (data.length === 0) {
    return;
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <CardDashboard
        titulo={"Entergas Hoy"}
        cantidad={data.entregas_hoy}
        descripcion={`${data.crecimiento_entregas} vs ayer`}
        color={"blue"}
      />
      <CardDashboard
        titulo={"Ingresos hoy"}
        cantidad={`S/. ${data.ingresos_hoy}`}
        descripcion={`${data.crecimiento_ingresos} vs ayer`}
        color={"green"}
      />
      <CardDashboard
        titulo={"Trabajadores"}
        cantidad={data.total_trabajadores}
        descripcion={data.estado_trabajadores}
        color={"purple"}
      />
    </div>
  );
}

export default InicioDashboard;
