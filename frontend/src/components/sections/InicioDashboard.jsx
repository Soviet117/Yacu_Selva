import CardDashboard from "../ui/CardDashboard";
import { useState, useEffect } from "react";
import { loadDataStartDashboard } from "../../api/api.startdashboard";

function InicioDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const datax = await loadDataStartDashboard();
        setData(datax.data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-xl p-4 animate-pulse h-32"
          ></div>
        ))}
      </div>
    );
  }

  if (data.length === 0 || !data) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          No hay datos disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <CardDashboard
        titulo={"Entregas Hoy"}
        cantidad={data.entregas_hoy || 0}
        descripcion={`${data.crecimiento_entregas || 0}% vs ayer`}
        color={"blue"}
      />
      <CardDashboard
        titulo={"Ingresos Hoy"}
        cantidad={`S/. ${data.ingresos_hoy || 0}`}
        descripcion={`${data.crecimiento_ingresos || 0}% vs ayer`}
        color={"green"}
      />
      <CardDashboard
        titulo={"Trabajadores"}
        cantidad={data.total_trabajadores || 0}
        descripcion={data.estado_trabajadores || "Activos"}
        color={"purple"}
      />
    </div>
  );
}

export default InicioDashboard;
