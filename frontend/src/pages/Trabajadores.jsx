// pages/Trabajadores.jsx
import { useState, useEffect } from "react";
import { Modal } from "../components/ui/Modal";
import { FormularioAgregarTrabajador } from "../components/ui/FormAgregarTrabajador";
import { FormularioDespedirTrabajador } from "../components/ui/FormDespedirTrabajador";
import { FormularioEditarTrabajador } from "../components/ui/FormularioEditarTrabajador";
import { BotonesAccion } from "../components/ui/BotonesAccion";
import { Buscador } from "../components/ui/Buscador";
import TablaTrabajadores from "../components/ui/TablaTrabajadores";
import {
  loadTrabajadores,
  updateTrabajador,
  deleteTrabajador,
  createTrabajador,
} from "../api/apiTrabajadores";
import { Users, AlertCircle, RefreshCw } from "lucide-react";

function Trabajadores({ user }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [trabajadores, setTrabajadores] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    nombre_p: "",
    apellido_p: "",
    dni_p: "",
    direccion: "",
    url_dni: "",
    id_tipo_trabajador: "",
    id_horario: "",
    sueldo: "",
  });

  const [editData, setEditData] = useState({
    id_trabajador: "",
    nombre_p: "",
    apellido_p: "",
    dni_p: "",
    direccion: "",
    url_dni: "",
    id_tipo_trabajador: "",
    id_horario: "",
    sueldo: "",
  });

  useEffect(() => {
    fetchTrabajadores();
  }, []);

  const fetchTrabajadores = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);
      const response = await loadTrabajadores();
      setTrabajadores(response.data || []);
    } catch (error) {
      console.error("Error al cargar trabajadores:", error);
      setError("No se pudieron cargar los trabajadores. Verifica tu conexión.");
      setTrabajadores([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddWorker = async () => {
    try {
      // Validación básica
      if (!formData.nombre_p || !formData.apellido_p || !formData.dni_p) {
        alert(
          "Por favor, complete los campos obligatorios: nombre, apellido y DNI"
        );
        return;
      }

      const response = await createTrabajador(formData);
      setTrabajadores([...trabajadores, response.data]);
      setFormData({
        nombre_p: "",
        apellido_p: "",
        dni_p: "",
        direccion: "",
        url_dni: "",
        id_tipo_trabajador: "",
        id_horario: "",
        sueldo: "",
      });
      setShowAddModal(false);
      alert("✅ Trabajador agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar trabajador:", error);
      alert(
        "❌ Error al agregar trabajador: " +
          (error.response?.data?.detail || error.message)
      );
    }
  };

  const handleDeleteWorker = async (selectedWorker) => {
    if (!selectedWorker) return;

    if (
      !window.confirm(
        `¿Está seguro de despedir a ${
          selectedWorker.nombre_completo || selectedWorker.nombre_p
        }?`
      )
    ) {
      return;
    }

    try {
      await deleteTrabajador(selectedWorker.id_trabajador);

      setTrabajadores((prev) =>
        prev.filter((t) => t.id_trabajador !== selectedWorker.id_trabajador)
      );

      setSelectedWorker(null);
      setShowDeleteModal(false);

      alert("✅ Trabajador despedido exitosamente");
    } catch (error) {
      console.error("Error al eliminar trabajador:", error);
      alert(
        "❌ Error al eliminar trabajador: " +
          (error.response?.data?.detail || error.message)
      );
      throw error;
    }
  };

  const handleEditWorker = async (trabajador) => {
    try {
      const response = await fetch(
        `http://localhost:8000/database/api/v1/trabajadores/${trabajador.id_trabajador}/`
      );
      const trabajadorCompleto = await response.json();

      setEditData({
        id_trabajador: trabajadorCompleto.id_trabajador,
        nombre_p: trabajadorCompleto.nombre_p || "",
        apellido_p: trabajadorCompleto.apellido_p || "",
        dni_p: trabajadorCompleto.dni_p || "",
        direccion: trabajadorCompleto.direccion || "",
        url_dni: trabajadorCompleto.url_dni || "",
        id_tipo_trabajador: trabajadorCompleto.id_tipo_trabajador || "",
        id_horario: trabajadorCompleto.id_horario || "",
        sueldo: trabajadorCompleto.sueldo || "",
      });

      setShowEditModal(true);
    } catch (error) {
      console.error("Error al cargar datos del trabajador:", error);
      alert("❌ Error al cargar datos del trabajador");
    }
  };

  const handleUpdateWorker = async () => {
    try {
      const response = await updateTrabajador(editData.id_trabajador, editData);

      setTrabajadores((prev) =>
        prev.map((t) =>
          t.id_trabajador === response.data.id_trabajador ? response.data : t
        )
      );

      setShowEditModal(false);
      alert("✅ Trabajador actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar trabajador:", error);
      alert(
        "❌ Error al actualizar trabajador: " +
          (error.response?.data?.detail || error.message)
      );
    }
  };

  const filteredWorkers = trabajadores.filter(
    (t) =>
      (t.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tipo_trabajador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.dni_p?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.dni?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      t.estado !== "inactivo"
  );

  const trabajadoresActivos = trabajadores.filter(
    (t) => t.estado !== "inactivo"
  );
  const trabajadoresInactivos = trabajadores.filter(
    (t) => t.estado === "inactivo"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Cargando trabajadores...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
                <Users className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600 dark:text-blue-400" />
                GESTIÓN DE TRABAJADORES
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                Administra y gestiona tu equipo de trabajo
              </p>
            </div>

            <button
              onClick={fetchTrabajadores}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Actualizando..." : "Actualizar"}
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-l-4 border-blue-500 dark:border-blue-400">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Total Trabajadores
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {trabajadores.length}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border-l-4 border-green-500 dark:border-green-400">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Activos
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {trabajadoresActivos.length}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border-l-4 border-gray-400 dark:border-gray-600">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Inactivos
              </p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {trabajadoresInactivos.length}
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="mb-6">
          <BotonesAccion
            onAgregarClick={() => setShowAddModal(true)}
            onDespedirClick={() => setShowDeleteModal(true)}
          />
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <Buscador
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar por nombre, DNI o tipo de trabajador..."
          />
        </div>

        {/* Tabla de trabajadores */}
        <div className="mb-6">
          <TablaTrabajadores
            trabajadores={filteredWorkers}
            onEdit={handleEditWorker}
          />
        </div>

        {/* Resumen */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>
              Total de trabajadores activos:{" "}
              <span className="font-semibold">{filteredWorkers.length}</span>
            </span>
          </div>
          {searchTerm && (
            <div className="text-blue-600 dark:text-blue-400">
              Filtrado por: "{searchTerm}"
            </div>
          )}
        </div>

        {/* Modal para Agregar Trabajador */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Agregar Nuevo Trabajador"
        >
          <FormularioAgregarTrabajador
            formData={formData}
            onInputChange={(e) => handleInputChange(e, setFormData)}
            onSubmit={handleAddWorker}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>

        {/* Modal para Despedir Trabajador */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedWorker(null);
          }}
          title="Despedir Trabajador"
        >
          <FormularioDespedirTrabajador
            onConfirm={handleDeleteWorker}
            onCancel={() => {
              setShowDeleteModal(false);
              setSelectedWorker(null);
            }}
          />
        </Modal>

        {/* Modal para Editar Trabajador */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Editar Trabajador"
        >
          <FormularioEditarTrabajador
            formData={editData}
            onInputChange={(e) => handleInputChange(e, setEditData)}
            onSubmit={handleUpdateWorker}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      </div>
    </div>
  );
}

export default Trabajadores;
