import { useState } from 'react';
import Menu from "../components/layouts/Menu";
import TopBar from "../components/layouts/TopBar";
import { Modal } from "../components/ui/Modal";
import { FormularioAgregarTrabajador } from "../components/ui/FormAgregarTrabajador";
import { FormularioDespedirTrabajador } from "../components/ui/FormDespedirTrabajador";
import { BotonesAccion } from "../components/ui/BotonesAccion";
import { Buscador } from "../components/ui/Buscador";
import { TablaTrabajadores } from "../components/ui/TablaTrabajadores";

function Trabajadores() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [trabajadores, setTrabajadores] = useState([
    { id: 1, nombre: 'Juan Pérez', puesto: 'Desarrollador', telefono: '987654321', email: 'juan@example.com', fechaIngreso: '2024-01-15' },
    { id: 2, nombre: 'María García', puesto: 'Diseñadora', telefono: '912345678', email: 'maria@example.com', fechaIngreso: '2024-03-20' },
    { id: 3, nombre: 'Carlos López', puesto: 'Gerente', telefono: '998877665', email: 'carlos@example.com', fechaIngreso: '2023-11-10' }
  ]);
  
  const [formData, setFormData] = useState({
    nombre: '',
    puesto: '',
    telefono: '',
    email: '',
    fechaIngreso: ''
  });

  const [selectedWorker, setSelectedWorker] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddWorker = () => {
    if (formData.nombre && formData.puesto && formData.telefono && formData.email && formData.fechaIngreso) {
      const newWorker = {
        id: trabajadores.length + 1,
        ...formData
      };
      setTrabajadores([...trabajadores, newWorker]);
      setFormData({ nombre: '', puesto: '', telefono: '', email: '', fechaIngreso: '' });
      setShowAddModal(false);
    }
  };

  const handleDeleteWorker = () => {
    if (selectedWorker) {
      setTrabajadores(trabajadores.filter(t => t.id !== selectedWorker.id));
      setSelectedWorker(null);
      setShowDeleteModal(false);
    }
  };

  const filteredWorkers = trabajadores.filter(t =>
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.puesto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <Menu />
      <div className="h-screen flex-grow overflow-y-auto">
        <TopBar />
        <div className="bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">TRABAJADORES</h1>
              <p className="text-gray-600">Gestiona tu equipo de trabajo</p>
            </div>

            {/* Botones de acción */}
            <BotonesAccion 
              onAgregarClick={() => setShowAddModal(true)}
              onDespedirClick={() => setShowDeleteModal(true)}
            />

            {/* Buscador */}
            <Buscador 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            {/* Tabla de trabajadores */}
            <TablaTrabajadores trabajadores={filteredWorkers} />

            {/* Total de trabajadores */}
            <div className="mt-4 text-gray-600">
              Total de trabajadores: {filteredWorkers.length}
            </div>

            {/* Modal Agregar Trabajador */}
            <Modal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              title="Agregar Nuevo Trabajador"
            >
              <FormularioAgregarTrabajador
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleAddWorker}
                onCancel={() => setShowAddModal(false)}
              />
            </Modal>

            {/* Modal Despedir Trabajador */}
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