import Menu from "../components/layouts/Menu";
import TopBar from "../components/layouts/TopBar";
import { CardReporteFlexible } from "../components/ui/CardReporteFlexible";

function Reportes() {
  return (
    <div className="flex items-center">
      <Menu />
      <div className="h-screen flex-grow overflow-auto bg-gray-50">
        <TopBar />
        <div className="p-6">
          <p className="text-3xl font-semibold mb-6">
            GESTIÓN DE REPORTES AVANZADOS
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <CardReporteFlexible
              titulo={"Reporte de Ventas"}
              descrip={
                "Ventas detalladas con filtros por fecha, vendedor y producto"
              }
              tipo={"ventas"}
              icono="📈"
            />
            <CardReporteFlexible
              titulo={"Reporte de Entregas"}
              descrip={"Entregas y salidas con análisis de eficiencia"}
              tipo={"entregas"}
              icono="🚚"
            />
            <CardReporteFlexible
              titulo={"Reporte de Trabajadores"}
              descrip={"Desempeño y métricas por trabajador"}
              tipo={"trabajadores"}
              icono="👥"
            />
            <CardReporteFlexible
              titulo={"Reporte de Productos"}
              descrip={"Productos más vendidos y análisis de inventario"}
              tipo={"productos"}
              icono="📦"
            />
            <CardReporteFlexible
              titulo={"Reporte Completo"}
              descrip={"Resumen general de todas las operaciones"}
              tipo={"completo"}
              icono="📊"
            />
            <CardReporteFlexible
              titulo={"Reporte Personalizado"}
              descrip={"Crea tu propio reporte con filtros específicos"}
              tipo={"personalizado"}
              icono="⚙️"
            />
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              🎯 Características de los Reportes
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • <strong>Filtros flexibles:</strong> Por fecha, trabajador,
                producto y método de pago
              </li>
              <li>
                • <strong>Formato profesional:</strong> Excel con diseño
                corporativo
              </li>
              <li>
                • <strong>Datos en tiempo real:</strong> Información actualizada
                al momento
              </li>
              <li>
                • <strong>Múltiples vistas:</strong> Ventas, entregas,
                trabajadores y productos
              </li>
              <li>
                • <strong>Métricas de eficiencia:</strong> Porcentajes de
                completitud y rendimiento
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reportes;
