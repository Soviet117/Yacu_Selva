import TargetCaja from "../ui/TargetCaja";
import { useState, useEffect, use } from "react";
import { loadCajaR } from "../../api/api.cajad";

function StartCaja() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const datax = await loadCajaR();
      setData(datax.data);
    }
    loadData();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <TargetCaja
        title={"Total del Día"}
        monto={data.total_hoy}
        subTitle={"Ingresos registrados"}
        color={"green"}
      />
      <TargetCaja
        title={"Por Delivery"}
        monto={data.total_repartidores}
        subTitle={"Canal delivery"}
        color={"blue"}
      />
      <TargetCaja
        title={"Venta Local"}
        monto={data.total_no_repartidores}
        subTitle={"Punto de venta"}
        color={"purple"}
      />
    </div>
  );
}

export default StartCaja;
