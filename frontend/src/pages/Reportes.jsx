// pages/Reportes.jsx
import { CardReporteFlexible } from "../components/ui/CardReporteFlexible";

function Reportes({ user }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 lg:p-6">
      <p className="text-2xl lg:text-3xl font-semibold mb-6 dark:text-white">
        📊 GESTIÓN DE REPORTES AVANZADOS
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
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
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 lg:p-6">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
          <span className="text-lg">🎯</span>
          Características de los Reportes
        </h3>
        <ul className="text-sm lg:text-base text-blue-700 dark:text-blue-200 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-800 dark:text-blue-300 mt-1">•</span>
            <div>
              <strong>Filtros flexibles:</strong> Por fecha, trabajador,
              producto y método de pago
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-800 dark:text-blue-300 mt-1">•</span>
            <div>
              <strong>Formato profesional:</strong> Excel con diseño corporativo
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-800 dark:text-blue-300 mt-1">•</span>
            <div>
              <strong>Datos en tiempo real:</strong> Información actualizada al
              momento
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-800 dark:text-blue-300 mt-1">•</span>
            <div>
              <strong>Múltiples vistas:</strong> Ventas, entregas, trabajadores
              y productos
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-800 dark:text-blue-300 mt-1">•</span>
            <div>
              <strong>Métricas de eficiencia:</strong> Porcentajes de
              completitud y rendimiento
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Reportes;
