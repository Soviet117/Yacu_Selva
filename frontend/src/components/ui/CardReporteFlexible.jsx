import { useState } from "react";
import {
  Download,
  Calendar,
  User,
  Package,
  Filter,
  Eye,
  BarChart3,
  Table,
} from "lucide-react";
import axios from "axios";

export function CardReporteFlexible({ titulo, descrip, tipo, icono }) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const [vistaPreviaDatos, setVistaPreviaDatos] = useState(null);
  const [tipoVista, setTipoVista] = useState("tabla"); // 'tabla' o 'grafico'
  const [filtros, setFiltros] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    id_trabajador: "",
    id_producto: "",
    metodo_pago: "todos",
    incluir_detalles: true,
  });
  const [trabajadores, setTrabajadores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoVistaPrevia, setCargandoVistaPrevia] = useState(false);

  const cargarDatosFiltros = async () => {
    try {
      const [trabRes, prodRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/database/api/v1/trabajadores/"),
        axios.get("http://127.0.0.1:8000/database/api/v1/producto/"),
      ]);

      setTrabajadores(trabRes.data);
      setProductos(prodRes.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const generarVistaPrevia = async () => {
    setCargandoVistaPrevia(true);
    try {
      const datosEnvio = {
        tipo_reporte: tipo,
        ...filtros,
        vista_previa: true, // Nueva bandera para vista previa
      };

      // Limpiar campos vacíos
      Object.keys(datosEnvio).forEach((key) => {
        if (datosEnvio[key] === "" || datosEnvio[key] === "todos") {
          delete datosEnvio[key];
        }
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/database/api/v1/reportes/generar_vista_previa/",
        datosEnvio,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setVistaPreviaDatos(response.data);
      setMostrarVistaPrevia(true);
    } catch (error) {
      console.error("Error generando vista previa:", error);
      alert(
        "Error al generar vista previa. Revisa la consola para más detalles."
      );
    } finally {
      setCargandoVistaPrevia(false);
    }
  };

  const generarReporte = async () => {
    setCargando(true);
    try {
      const datosEnvio = {
        tipo_reporte: tipo,
        ...filtros,
      };

      // Limpiar campos vacíos
      Object.keys(datosEnvio).forEach((key) => {
        if (datosEnvio[key] === "" || datosEnvio[key] === "todos") {
          delete datosEnvio[key];
        }
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/database/api/v1/reportes/generar_reporte_flexible/",
        datosEnvio,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const fecha = new Date().toISOString().split("T")[0];
      const nombreArchivo = `reporte_${tipo}_${fecha}.xlsx`;
      link.setAttribute("download", nombreArchivo);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setMostrarFiltros(false);
    } catch (error) {
      console.error("Error generando reporte:", error);
      alert(
        "Error al generar el reporte. Revisa la consola para más detalles."
      );
    } finally {
      setCargando(false);
    }
  };

  const abrirFiltros = () => {
    cargarDatosFiltros();
    setMostrarFiltros(true);
  };

  // Función para renderizar gráficos simples
  const renderizarGrafico = () => {
    if (!vistaPreviaDatos) return null;

    if (tipo === "ventas") {
      return (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-4">Ventas por Producto</h4>
          <div className="space-y-2">
            {vistaPreviaDatos.grafico_ventas?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.producto}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (item.total /
                          Math.max(
                            ...vistaPreviaDatos.grafico_ventas.map(
                              (i) => i.total
                            )
                          )) *
                          100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium">S/ {item.total}</span>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (tipo === "trabajadores") {
      return (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-4">Eficiencia de Trabajadores</h4>
          <div className="space-y-3">
            {vistaPreviaDatos.grafico_trabajadores?.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.nombre}</span>
                  <span>{item.eficiencia}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${Math.min(item.eficiencia, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (tipo === "entregas") {
      return (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-4">Estados de Entrega</h4>
          <div className="grid grid-cols-2 gap-4">
            {vistaPreviaDatos.grafico_entregas?.map((item, index) => (
              <div
                key={index}
                className="text-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl font-bold text-blue-600">
                  {item.cantidad}
                </div>
                <div className="text-sm text-gray-600">{item.estado}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <div>Gráfico no disponible para este tipo de reporte</div>;
  };

  // Función para renderizar tabla de vista previa
  const renderizarTabla = () => {
    if (!vistaPreviaDatos) return null;

    const headers = vistaPreviaDatos.headers || [];
    const datos = vistaPreviaDatos.datos || [];

    return (
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {datos.slice(0, 10).map((fila, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-2 text-sm text-gray-900"
                    >
                      {fila[header.toLowerCase().replace(/[^a-z]/g, "_")] ||
                        fila[colIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {datos.length > 10 && (
          <div className="bg-gray-50 px-4 py-2 text-sm text-gray-500">
            Mostrando 10 de {datos.length} registros
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{icono}</span>
              <h3 className="font-bold text-lg text-gray-800">{titulo}</h3>
            </div>
            <p className="text-gray-600 text-sm">{descrip}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={abrirFiltros}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
          >
            <Filter className="h-4 w-4" />
            Configurar Filtros
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={generarVistaPrevia}
              disabled={cargandoVistaPrevia}
              className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm"
            >
              {cargandoVistaPrevia ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  Cargando...
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3" />
                  Vista Previa
                </>
              )}
            </button>

            <button
              onClick={generarReporte}
              disabled={cargando}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm"
            >
              {cargando ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  Generando...
                </>
              ) : (
                <>
                  <Download className="h-3 w-3" />
                  Descargar Excel
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Filtros */}
      {mostrarFiltros && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Filtros - {titulo}
              </h2>
              <button
                onClick={() => setMostrarFiltros(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={filtros.fecha_inicio}
                    onChange={(e) =>
                      setFiltros({ ...filtros, fecha_inicio: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={filtros.fecha_fin}
                    onChange={(e) =>
                      setFiltros({ ...filtros, fecha_fin: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Trabajador */}
              {(tipo === "ventas" ||
                tipo === "entregas" ||
                tipo === "trabajadores" ||
                tipo === "completo") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Trabajador
                  </label>
                  <select
                    value={filtros.id_trabajador}
                    onChange={(e) =>
                      setFiltros({ ...filtros, id_trabajador: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos los trabajadores</option>
                    {trabajadores.map((trab) => (
                      <option
                        key={trab.id_trabajador}
                        value={trab.id_trabajador}
                      >
                        {trab.nombre_completo ||
                          `${trab.nombre_p} ${trab.apellido_p}`}{" "}
                        - {trab.tipo_trabajador}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Producto */}
              {(tipo === "ventas" ||
                tipo === "entregas" ||
                tipo === "productos" ||
                tipo === "completo") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="h-4 w-4 inline mr-1" />
                    Producto
                  </label>
                  <select
                    value={filtros.id_producto}
                    onChange={(e) =>
                      setFiltros({ ...filtros, id_producto: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos los productos</option>
                    {productos.map((prod) => (
                      <option key={prod.id_producto} value={prod.id_producto}>
                        {prod.nom_producto}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Método de Pago */}
              {(tipo === "ventas" || tipo === "completo") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💳 Método de Pago
                  </label>
                  <select
                    value={filtros.metodo_pago}
                    onChange={(e) =>
                      setFiltros({ ...filtros, metodo_pago: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="todos">Todos los métodos</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="yape">Yape</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="mixto">Mixto</option>
                  </select>
                </div>
              )}

              {/* Resumen de Filtros Activos */}
              {(filtros.fecha_inicio ||
                filtros.fecha_fin ||
                filtros.id_trabajador ||
                filtros.id_producto ||
                filtros.metodo_pago !== "todos") && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-800 mb-2">
                    🎯 Filtros activos:
                  </p>
                  <div className="text-xs text-blue-700 space-y-1">
                    {filtros.fecha_inicio && (
                      <p>• Desde: {filtros.fecha_inicio}</p>
                    )}
                    {filtros.fecha_fin && <p>• Hasta: {filtros.fecha_fin}</p>}
                    {filtros.id_trabajador && (
                      <p>
                        • Trabajador:{" "}
                        {
                          trabajadores.find(
                            (t) => t.id_trabajador == filtros.id_trabajador
                          )?.nombre_completo
                        }
                      </p>
                    )}
                    {filtros.id_producto && (
                      <p>
                        • Producto:{" "}
                        {
                          productos.find(
                            (p) => p.id_producto == filtros.id_producto
                          )?.nom_producto
                        }
                      </p>
                    )}
                    {filtros.metodo_pago !== "todos" && (
                      <p>• Método: {filtros.metodo_pago}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() =>
                    setFiltros({
                      fecha_inicio: "",
                      fecha_fin: "",
                      id_trabajador: "",
                      id_producto: "",
                      metodo_pago: "todos",
                      incluir_detalles: true,
                    })
                  }
                  className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setMostrarFiltros(false)}
                  className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={generarVistaPrevia}
                  disabled={cargandoVistaPrevia}
                  className="flex-1 p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-400"
                >
                  {cargandoVistaPrevia ? "Cargando..." : "Vista Previa"}
                </button>
                <button
                  onClick={generarReporte}
                  disabled={cargando}
                  className="flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                >
                  {cargando ? "Generando..." : "Aplicar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vista Previa */}
      {mostrarVistaPrevia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Vista Previa - {titulo}
              </h2>
              <button
                onClick={() => setMostrarVistaPrevia(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            <div className="p-6">
              {/* Selector de tipo de vista */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setTipoVista("tabla")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    tipoVista === "tabla"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <Table className="h-4 w-4" />
                  Vista de Tabla
                </button>
                <button
                  onClick={() => setTipoVista("grafico")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    tipoVista === "grafico"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  Vista de Gráficos
                </button>
              </div>

              {/* Contenido de vista previa */}
              <div className="space-y-4">
                {tipoVista === "tabla"
                  ? renderizarTabla()
                  : renderizarGrafico()}
              </div>

              {/* Información de resumen */}
              {vistaPreviaDatos && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Resumen del Reporte</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total registros:</span>
                      <div className="font-semibold">
                        {vistaPreviaDatos.total_registros || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Período:</span>
                      <div className="font-semibold">
                        {filtros.fecha_inicio || "Inicio"} -{" "}
                        {filtros.fecha_fin || "Fin"}
                      </div>
                    </div>
                    {vistaPreviaDatos.total_ventas && (
                      <div>
                        <span className="text-gray-600">Total ventas:</span>
                        <div className="font-semibold">
                          S/ {vistaPreviaDatos.total_ventas}
                        </div>
                      </div>
                    )}
                    {vistaPreviaDatos.promedio_eficiencia && (
                      <div>
                        <span className="text-gray-600">
                          Eficiencia promedio:
                        </span>
                        <div className="font-semibold">
                          {vistaPreviaDatos.promedio_eficiencia}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setMostrarVistaPrevia(false)}
                  className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={generarReporte}
                  disabled={cargando}
                  className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                >
                  {cargando ? "Generando..." : "Descargar Excel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
