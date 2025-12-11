import TargetCaja from "../ui/TargetCaja";
import { useState, useEffect } from "react";
import { loadCajaR } from "../../api/api.cajad";
import {
  DollarSign,
  Package,
  Store,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";

function StartCaja() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const response = await loadCajaR();
        console.log("Datos recibidos:", response.data);
        setData(response.data || {});
      } catch (error) {
        console.error("Error loading caja data:", error);
        setError("No se pudieron cargar los datos de caja");
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg animate-pulse border border-gray-200 dark:border-gray-700"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error && Object.keys(data).length === 0) {
    return (
      <div className="mb-6 lg:mb-8">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg p-4 mb-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">
                Datos no disponibles
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calcular balance neto si no viene en los datos
  const balanceNeto =
    data.balance_neto !== undefined
      ? data.balance_neto
      : (data.total_hoy || 0) - (data.total_egresos || 0);

  return (
    <div className="mb-6 lg:mb-8">
      {/* Balance neto destacado */}
      <div className="mb-6">
        <div
          className={`p-4 lg:p-6 rounded-2xl shadow-lg border-l-4 ${
            balanceNeto >= 0
              ? "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400"
              : "bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400"
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Balance Neto del Día
              </p>
              <p
                className={`text-2xl lg:text-3xl font-bold mt-2 ${
                  balanceNeto >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                S/.{" "}
                {typeof balanceNeto === "number"
                  ? Math.abs(balanceNeto).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div className="flex items-center">
              <Wallet
                className={`h-8 w-8 ${
                  balanceNeto >= 0
                    ? "text-green-500 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              />
              {balanceNeto >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500 dark:text-green-400 ml-2" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500 dark:text-red-400 ml-2" />
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {balanceNeto >= 0 ? "💰 Ganancia neta" : "⚠️ Pérdida neta"} del día
          </p>
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <TargetCaja
          title={"Total del Día"}
          monto={data.total_hoy || 0}
          subTitle={"Ingresos totales"}
          color={"green"}
          icon={<DollarSign className="h-5 w-5 lg:h-6 lg:w-6" />}
        />
        <TargetCaja
          title={"Por Delivery"}
          monto={data.total_repartidores || 0}
          subTitle={"Ventas por repartidores"}
          color={"blue"}
          icon={<Package className="h-5 w-5 lg:h-6 lg:w-6" />}
        />
        <TargetCaja
          title={"Venta Local"}
          monto={data.total_no_repartidores || 0}
          subTitle={"Ventas en punto físico"}
          color={"purple"}
          icon={<Store className="h-5 w-5 lg:h-6 lg:w-6" />}
        />
        <TargetCaja
          title={"Egresos del Día"}
          monto={data.total_egresos || 0}
          subTitle={"Gastos operativos"}
          color={"red"}
          icon={<CreditCard className="h-5 w-5 lg:h-6 lg:w-6" />}
        />
      </div>

      {/* Info adicional */}
      {data && (data.total_hoy > 0 || data.total_egresos > 0) && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">📊 Resumen:</span>{" "}
            <span className="text-green-600 dark:text-green-400">
              Ingresos: S/. {data.total_hoy?.toFixed(2) || "0.00"}
            </span>{" "}
            •{" "}
            <span className="text-red-600 dark:text-red-400">
              Egresos: S/. {data.total_egresos?.toFixed(2) || "0.00"}
            </span>{" "}
            •{" "}
            <span
              className={
                balanceNeto >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }
            >
              Balance: S/. {balanceNeto.toFixed(2)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default StartCaja;
