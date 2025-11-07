import CardInfoDashboard from "../ui/CardInfoDashboard";
import CardInfoDashboard1 from "../ui/CardInfoDashboard1";
import { loadSalida } from "../../api/api.salida";
import { loadRetornoAll } from "../../api/api.retorno";
import { useState, useEffect, use } from "react";

function EndDashboard() {
  const [dataSalida, setDataSalida] = useState([]);
  const [dataRetorno, setDataRetorno] = useState([]);
  useEffect(() => {
    async function loadData() {
      const datax = await loadSalida();
      setDataSalida(datax.data);
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadDatax() {
      const datax = await loadRetornoAll();
      setDataRetorno(datax.data);
    }
    loadDatax();
  }, []);

  return (
    <div className="bg-gray-100 ">
      <div className="grid grid-cols-2 gap-4">
        <CardInfoDashboard title={"Entregas Recientes"} data={dataSalida} />
        <CardInfoDashboard1 title={"Ingresos Recientes"} data={dataRetorno} />
      </div>
    </div>
  );
}

export default EndDashboard;
