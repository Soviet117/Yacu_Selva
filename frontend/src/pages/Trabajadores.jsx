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
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  loadTrabajadores,
  updateTrabajador,
  deleteTrabajador,
  createTrabajador,
} from "../api/apiTrabajadores";

function Trabajadores({ user }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [trabajadores, setTrabajadores] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError(null);
      const response = await loadTrabajadores();
      setTrabajadores(response.data);
    } catch (error) {
      console.error("Error al cargar trabajadores:", error);
      setError("No se pudieron cargar los trabajadores");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddWorker = async () => {
    try {
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
      alert("Trabajador agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar trabajador:", error);
      alert(
        "Error al agregar trabajador: " +
          (error.response?.data?.detail || error.message)
      );
    }
  };

  const handleDeleteWorker = async (selectedWorker) => {
    if (!selectedWorker) return;

    try {
      await deleteTrabajador(selectedWorker.id_trabajador);

      setTrabajadores((prev) =>
        prev.filter((t) => t.id_trabajador !== selectedWorker.id_trabajador)
      );

      setSelectedWorker(null);
      setShowDeleteModal(false);

      alert("Trabajador despedido exitosamente");
    } catch (error) {
      console.error("Error al eliminar trabajador:", error);
      alert(
        "Error al eliminar trabajador: " +
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
      alert("Error al cargar datos del trabajador");
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
      alert("Trabajador actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar trabajador:", error);
      alert(
        "Error al actualizar trabajador: " +
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600">Cargando trabajadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          GESTIÓN DE TRABAJADORES
        </h1>
        <p className="text-gray-600">
          Administra y gestiona tu equipo de trabajo
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <BotonesAccion
        onAgregarClick={() => setShowAddModal(true)}
        onDespedirClick={() => setShowDeleteModal(true)}
      />

      <Buscador
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar por nombre, DNI o tipo de trabajador..."
      />

      <TablaTrabajadores
        trabajadores={filteredWorkers}
        onEdit={handleEditWorker}
      />

      <div className="mt-4 text-gray-600">
        Total de trabajadores activos: {filteredWorkers.length}
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
  );
}

export default Trabajadores;
