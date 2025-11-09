// Reportes.jsx - Actualizado
import Menu from "../components/layouts/Menu";
import TopBar from "../components/layouts/TopBar";
import { CardReporte } from "../components/ui/CardReporte";

function Reportes() {
  return (
    <div className="flex items-center">
      <Menu />
      <div className="h-screen flex-grow overflow-auto bg-gray-50">
        <TopBar />
        <div className="p-6">
          <p className="text-3xl font-semibold mb-6">GESTIÓN DE REPORTES</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardReporte
              titulo={"Reporte Diario"}
              descrip={"Ventas y entregas del día actual"}
              tipo={"diario"}
            />
            <CardReporte
              titulo={"Reporte Semanal"}
              descrip={"Últimos 7 días de actividad"}
              tipo={"semanal"}
            />
            <CardReporte
              titulo={"Reporte Mensual"}
              descrip={"Resumen completo del mes"}
              tipo={"mensual"}
            />
          </div>

          {/* Información adicional */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              📊 Información de Reportes
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • <strong>Reporte Diario:</strong> Actividad del día actual
              </li>
              <li>
                • <strong>Reporte Semanal:</strong> Últimos 7 días de
                operaciones
              </li>
              <li>
                • <strong>Reporte Mensual:</strong> Todo el mes hasta la fecha
              </li>
              <li>
                • Todos los reportes incluyen: Ventas, Entregas y Métricas de
                eficiencia
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reportes;
