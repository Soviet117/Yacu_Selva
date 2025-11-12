import TargetCaja from "../ui/TargetCaja";
import { useState, useEffect } from "react";
import { loadCajaR } from "../../api/api.cajad";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

function StartCaja() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const datax = await loadCajaR();
        setData(datax.data || {});
      } catch (error) {
        console.error("Error loading caja data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <TargetCaja
        title={"Total del Día"}
        monto={data.total_hoy || 0}
        subTitle={"Ingresos registrados"}
        color={"green"}
        icon={<DollarSign className="h-6 w-6" />}
        trend="up"
      />
      <TargetCaja
        title={"Por Delivery"}
        monto={data.total_repartidores || 0}
        subTitle={"Canal delivery"}
        color={"blue"}
        icon={<TrendingUp className="h-6 w-6" />}
        trend="up"
      />
      <TargetCaja
        title={"Venta Local"}
        monto={data.total_no_repartidores || 0}
        subTitle={"Punto de venta"}
        color={"purple"}
        icon={<TrendingUp className="h-6 w-6" />}
        trend="up"
      />
      <TargetCaja
        title={"Egresos del Día"}
        monto={data.total_egresos || 0}
        subTitle={"Gastos operativos"}
        color={"red"}
        icon={<TrendingDown className="h-6 w-6" />}
        trend="down"
      />
    </div>
  );
}

export default StartCaja;
