import { useState, useEffect } from "react";
import {
  Download,
  Calendar,
  User,
  Package,
  Filter,
  Eye,
  BarChart3,
  Table,
  X,
  Loader2,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";
import axios from "axios";

export function CardReporteFlexible({ titulo, descrip, tipo, icono }) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const [vistaPreviaDatos, setVistaPreviaDatos] = useState(null);
  const [tipoVista, setTipoVista] = useState("tabla");
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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mostrarFiltros) {
      cargarDatosFiltros();
    }
  }, [mostrarFiltros]);

  const cargarDatosFiltros = async () => {
    try {
      const [trabRes, prodRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/database/api/v1/trabajadores/"),
        axios.get("http://127.0.0.1:8000/database/api/v1/producto/"),
      ]);

      setTrabajadores(trabRes.data || []);
      setProductos(prodRes.data || []);
      setError(null);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("No se pudieron cargar los datos de filtros");
    }
  };

  const generarVistaPrevia = async () => {
    setCargandoVistaPrevia(true);
    setError(null);

    try {
      const datosEnvio = {
        tipo_reporte: tipo,
        ...filtros,
        vista_previa: true,
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
      setError("Error al generar vista previa. Verifica los datos.");
    } finally {
      setCargandoVistaPrevia(false);
    }
  };

  const generarReporte = async () => {
    setCargando(true);
    setError(null);

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
      setMostrarVistaPrevia(false);

      setTimeout(() => {
        alert(`✅ Reporte "${titulo}" generado exitosamente`);
      }, 100);
    } catch (error) {
      console.error("Error generando reporte:", error);
      setError("Error al generar el reporte. Verifica la conexión.");
    } finally {
      setCargando(false);
    }
  };

  const abrirFiltros = () => {
    setMostrarFiltros(true);
  };

  const cerrarFiltros = () => {
    setMostrarFiltros(false);
    setError(null);
  };

  const cerrarVistaPrevia = () => {
    setMostrarVistaPrevia(false);
    setError(null);
  };

  const renderizarGrafico = () => {
    if (!vistaPreviaDatos) return null;

    if (tipo === "ventas") {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
          <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">
            Ventas por Producto
          </h4>
          <div className="space-y-3">
            {vistaPreviaDatos.grafico_ventas?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.producto}
                </span>
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  S/ {item.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (tipo === "trabajadores") {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
          <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">
            Eficiencia de Trabajadores
          </h4>
          <div className="space-y-3">
            {vistaPreviaDatos.grafico_trabajadores?.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.nombre}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {item.eficiencia}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      item.eficiencia >= 80
                        ? "bg-green-500"
                        : item.eficiencia >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
          <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">
            Estados de Entrega
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {vistaPreviaDatos.grafico_entregas?.map((item, index) => (
              <div
                key={index}
                className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {item.cantidad}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {item.estado}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 text-center py-4">
          Gráfico no disponible para este tipo de reporte
        </p>
      </div>
    );
  };

  const renderizarTabla = () => {
    if (!vistaPreviaDatos) return null;

    const headers = vistaPreviaDatos.headers || [];
    const datos = vistaPreviaDatos.datos || [];

    if (datos.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            No hay datos para mostrar con los filtros seleccionados
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {datos.slice(0, 10).map((fila, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300"
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
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
            Mostrando 10 de {datos.length} registros
          </div>
        )}
      </div>
    );
  };

  const filtrosActivos =
    filtros.fecha_inicio ||
    filtros.fecha_fin ||
    filtros.id_trabajador ||
    filtros.id_producto ||
    filtros.metodo_pago !== "todos";

  return (
    <>
      {/* Tarjeta principal */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 lg:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{icono}</span>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                {titulo}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
              {descrip}
            </p>
          </div>
        </div>

        {error && mostrarFiltros && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={abrirFiltros}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm lg:text-base"
          >
            <Filter className="h-4 w-4 lg:h-5 lg:w-5" />
            Configurar Filtros
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={generarVistaPrevia}
              disabled={cargandoVistaPrevia}
              className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm"
            >
              {cargandoVistaPrevia ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Cargando...
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                  Vista Previa
                </>
              )}
            </button>

            <button
              onClick={generarReporte}
              disabled={cargando}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm"
            >
              {cargando ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="h-3 w-3 lg:h-4 lg:w-4" />
                  Descargar Excel
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Filtros */}
      {mostrarFiltros && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={cerrarFiltros}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 lg:p-6 border-b dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Filtros - {titulo}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Selecciona los filtros para el reporte
                </p>
              </div>
              <button
                onClick={cerrarFiltros}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-4 lg:p-6 space-y-4">
              {/* Fechas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={filtros.fecha_inicio}
                    onChange={(e) =>
                      setFiltros({ ...filtros, fecha_inicio: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={filtros.fecha_fin}
                    onChange={(e) =>
                      setFiltros({ ...filtros, fecha_fin: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Trabajador */}
              {(tipo === "ventas" ||
                tipo === "entregas" ||
                tipo === "trabajadores" ||
                tipo === "completo") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Trabajador
                  </label>
                  <select
                    value={filtros.id_trabajador}
                    onChange={(e) =>
                      setFiltros({ ...filtros, id_trabajador: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Package className="h-4 w-4 inline mr-1" />
                    Producto
                  </label>
                  <select
                    value={filtros.id_producto}
                    onChange={(e) =>
                      setFiltros({ ...filtros, id_producto: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    💳 Método de Pago
                  </label>
                  <select
                    value={filtros.metodo_pago}
                    onChange={(e) =>
                      setFiltros({ ...filtros, metodo_pago: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
              {filtrosActivos && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    🎯 Filtros activos:
                  </p>
                  <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                    {filtros.fecha_inicio && (
                      <p>• Desde: {filtros.fecha_inicio}</p>
                    )}
                    {filtros.fecha_fin && <p>• Hasta: {filtros.fecha_fin}</p>}
                    {filtros.id_trabajador && (
                      <p>
                        • Trabajador:{" "}
                        {trabajadores.find(
                          (t) => t.id_trabajador == filtros.id_trabajador
                        )?.nombre_completo || "Seleccionado"}
                      </p>
                    )}
                    {filtros.id_producto && (
                      <p>
                        • Producto:{" "}
                        {productos.find(
                          (p) => p.id_producto == filtros.id_producto
                        )?.nom_producto || "Seleccionado"}
                      </p>
                    )}
                    {filtros.metodo_pago !== "todos" && (
                      <p>• Método: {filtros.metodo_pago}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-wrap gap-2 pt-4">
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
                  className="flex-1 min-w-[100px] p-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Limpiar
                </button>
                <button
                  onClick={cerrarFiltros}
                  className="flex-1 min-w-[100px] p-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={generarVistaPrevia}
                  disabled={cargandoVistaPrevia}
                  className="flex-1 min-w-[100px] p-3 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-700 text-sm"
                >
                  {cargandoVistaPrevia ? "Cargando..." : "Vista Previa"}
                </button>
                <button
                  onClick={generarReporte}
                  disabled={cargando}
                  className="flex-1 min-w-[100px] p-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-700 text-sm"
                >
                  {cargando ? "Generando..." : "Generar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vista Previa */}
      {mostrarVistaPrevia && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={cerrarVistaPrevia}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 lg:p-6 border-b dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Vista Previa - {titulo}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filtrosActivos
                    ? "Datos con filtros aplicados"
                    : "Todos los datos disponibles"}
                </p>
              </div>
              <button
                onClick={cerrarVistaPrevia}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-4 lg:p-6">
              {/* Selector de tipo de vista */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setTipoVista("tabla")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                    tipoVista === "tabla"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <Table className="h-4 w-4" />
                  Vista de Tabla
                </button>
                <button
                  onClick={() => setTipoVista("grafico")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                    tipoVista === "grafico"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
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
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">
                    Resumen del Reporte
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Total registros:
                      </span>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {vistaPreviaDatos.total_registros || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Período:
                      </span>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {filtros.fecha_inicio || "Inicio"} -{" "}
                        {filtros.fecha_fin || "Fin"}
                      </div>
                    </div>
                    {vistaPreviaDatos.total_ventas && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Total ventas:
                        </span>
                        <div className="font-semibold text-green-600 dark:text-green-400">
                          S/ {vistaPreviaDatos.total_ventas}
                        </div>
                      </div>
                    )}
                    {vistaPreviaDatos.promedio_eficiencia && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Eficiencia promedio:
                        </span>
                        <div className="font-semibold text-blue-600 dark:text-blue-400">
                          {vistaPreviaDatos.promedio_eficiencia}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex flex-wrap gap-2 mt-6">
                <button
                  onClick={cerrarVistaPrevia}
                  className="flex-1 min-w-[100px] p-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Cerrar
                </button>
                <button
                  onClick={generarReporte}
                  disabled={cargando}
                  className="flex-1 min-w-[100px] p-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-700 flex items-center justify-center gap-2 text-sm"
                >
                  <FileSpreadsheet className="h-4 w-4" />
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
