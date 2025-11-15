import TargetCaja from "../ui/TargetCaja";
import { useState, useEffect } from "react";
import { loadCajaR } from "../../api/api.cajad"; // Verifica que esta función apunte al endpoint correcto
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Store,
  CreditCard,
} from "lucide-react";

function StartCaja() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await loadCajaR();
        console.log("Datos recibidos:", response.data); // Para debug
        setData(response.data || {});
      } catch (error) {
        console.error("Error loading caja data:", error);
        // Set datos por defecto en caso de error
        setData({
          total_hoy: 0,
          total_repartidores: 0,
          total_no_repartidores: 0,
          total_egresos: 0,
          balance_neto: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
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
        subTitle={"Ingresos totales"}
        color={"green"}
        icon={<DollarSign className="h-6 w-6" />}
      />
      <TargetCaja
        title={"Por Delivery"}
        monto={data.total_repartidores || 0}
        subTitle={"Ventas por repartidores"}
        color={"blue"}
        icon={<Package className="h-6 w-6" />}
      />
      <TargetCaja
        title={"Venta Local"}
        monto={data.total_no_repartidores || 0}
        subTitle={"Ventas en punto físico"}
        color={"purple"}
        icon={<Store className="h-6 w-6" />}
      />
      <TargetCaja
        title={"Egresos del Día"}
        monto={data.total_egresos || 0}
        subTitle={"Gastos operativos"}
        color={"red"}
        icon={<CreditCard className="h-6 w-6" />}
      />
    </div>
  );
}

export default StartCaja;
