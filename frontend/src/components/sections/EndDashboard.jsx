import CardEntregasRecientes from "../ui/CardEntregasRecientes";
import CardIngresosRecientes from "../ui/CardIngresosRecientes"; // Renombrar archivo
import { loadSalida } from "../../api/api.salida";
import { loadRetornoAll } from "../../api/api.retorno";
import { useState, useEffect } from "react";

function EndDashboard() {
  const [dataSalida, setDataSalida] = useState([]);
  const [dataRetorno, setDataRetorno] = useState([]);
  const [loading, setLoading] = useState({ salida: true, retorno: true });

  useEffect(() => {
    async function loadData() {
      try {
        const datax = await loadSalida();
        setDataSalida(datax.data || []);
      } catch (error) {
        console.error("Error loading salida data:", error);
        setDataSalida([]);
      } finally {
        setLoading((prev) => ({ ...prev, salida: false }));
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadDatax() {
      try {
        const datax = await loadRetornoAll();
        setDataRetorno(datax.data || []);
      } catch (error) {
        console.error("Error loading retorno data:", error);
        setDataRetorno([]);
      } finally {
        setLoading((prev) => ({ ...prev, retorno: false }));
      }
    }
    loadDatax();
  }, []);

  const isLoading = loading.salida || loading.retorno;

  if (isLoading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-2xl p-4 animate-pulse h-48"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardEntregasRecientes title={"Entregas Recientes"} data={dataSalida} />
        <CardIngresosRecientes
          title={"Ingresos Recientes"}
          data={dataRetorno}
        />
      </div>
    </div>
  );
}

export default EndDashboard;
