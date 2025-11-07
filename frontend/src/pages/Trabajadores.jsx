import { useState, useEffect } from "react";
import Menu from "../components/layouts/Menu";
import TopBar from "../components/layouts/TopBar";
import { Modal } from "../components/ui/Modal";
import { FormularioAgregarTrabajador } from "../components/ui/FormAgregarTrabajador";
import { FormularioDespedirTrabajador } from "../components/ui/FormDespedirTrabajador";
import { FormularioEditarTrabajador } from "../components/ui/FormularioEditarTrabajador";
import { BotonesAccion } from "../components/ui/BotonesAccion";
import { Buscador } from "../components/ui/Buscador";
import TablaTrabajadores from "../components/ui/TablaTrabajadores";
import { loadTrabajadores, updateTrabajador, deleteTrabajador, createTrabajador } from "../api/apiTrabajadores";

function Trabajadores() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [trabajadores, setTrabajadores] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nombre_completo: "",
    dni: "",
    tipo_trabajador: "",
    sueldo: "",
  });

  const [editData, setEditData] = useState({
    id_trabajador: "",
    nombre_completo: "",
    dni: "",
    tipo_trabajador: "",
    sueldo: "",
  });

  // 🔹 Cargar trabajadores desde la BD
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

  // 🔹 Control de inputs genérico
  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Agregar nuevo trabajador
  const handleAddWorker = async () => {
    try {
      const response = await createTrabajador(formData);
      setTrabajadores([...trabajadores, response.data]);
      setFormData({
        nombre_completo: "",
        dni: "",
        tipo_trabajador: "",
        sueldo: "",
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error al agregar trabajador:", error);
      alert("Error al agregar trabajador");
    }
  };

  // 🔹 Eliminar trabajador
  const handleDeleteWorker = async () => {
    if (!selectedWorker) return;
    try {
      await deleteTrabajador(selectedWorker.id_trabajador);
      setTrabajadores(trabajadores.filter((t) => t.id_trabajador !== selectedWorker.id_trabajador));
      setSelectedWorker(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error al eliminar trabajador:", error);
      alert("Error al eliminar trabajador");
    }
  };

  // 🔹 Abrir modal de edición con datos del trabajador
  const handleEditWorker = (trabajador) => {
    setEditData({
      id_trabajador: trabajador.id_trabajador,
      nombre_completo: trabajador.nombre_completo,
      dni: trabajador.dni,
      tipo_trabajador: trabajador.tipo_trabajador,
      sueldo: trabajador.sueldo,
    });
    setShowEditModal(true);
  };

  // 🔹 Actualizar trabajador (PATCH)
  const handleUpdateWorker = async () => {
    try {
      const response = await updateTrabajador(editData.id_trabajador, editData);
      
      // Actualizar lista en memoria
      setTrabajadores((prev) =>
        prev.map((t) => (t.id_trabajador === response.data.id_trabajador ? response.data : t))
      );

      setShowEditModal(false);
      alert("Trabajador actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar trabajador:", error);
      alert("Error al actualizar trabajador");
    }
  };

  // 🔹 Filtrar trabajadores
  const filteredWorkers = trabajadores.filter(
    (t) =>
      t.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tipo_trabajador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.dni?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex">
        <Menu />
        <div className="h-screen flex-grow overflow-y-auto">
          <TopBar />
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-lg text-gray-600">Cargando trabajadores...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Menu />
      <div className="h-screen flex-grow overflow-y-auto">
        <TopBar />
        <div className="bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                TRABAJADORES
              </h1>
              <p className="text-gray-600">Gestiona tu equipo de trabajo</p>
            </div>

            {/* Botones de acción */}
            <BotonesAccion
              onAgregarClick={() => setShowAddModal(true)}
              onDespedirClick={() => setShowDeleteModal(true)}
            />

            {/* Buscador */}
            <Buscador searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            {/* Tabla */}
            <TablaTrabajadores
              trabajadores={filteredWorkers}
              onEdit={handleEditWorker}
            />

            {/* Total */}
            <div className="mt-4 text-gray-600">
              Total de trabajadores: {filteredWorkers.length}
            </div>

            {/* Modal Agregar */}
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

            {/* Modal Despedir */}
            <Modal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              title="Despedir Trabajador"
            >
              <FormularioDespedirTrabajador
                trabajadores={trabajadores}
                selectedWorker={selectedWorker}
                onSelectWorker={setSelectedWorker}
                onConfirm={handleDeleteWorker}
                onCancel={() => {
                  setShowDeleteModal(false);
                  setSelectedWorker(null);
                }}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trabajadores;