// En tu Entregas.jsx existente - agrega estas importaciones y el botón
import { useState } from "react";
import { Store } from "lucide-react";
import ModalPOS from "../components/ui/ModalPOS";
import Menu from "../components/layouts/Menu"; // Asegúrate de tener el componente Menu importado
import TopBar from "../components/layouts/TopBar";
import RegisES from "../components/sections/RegisES";
import SectionTabla from "../components/sections/SectionTabla";

function Entregas() {
  const [refreshTable, setRefleshTable] = useState(false);
  const [isPOSModalOpen, setIsPOSModalOpen] = useState(false); // Nuevo estado para el modal

  const handleRefreshTable = () => {
    setRefleshTable((prev) => !prev);
  };

  const handlePOSSuccess = () => {
    handleRefreshTable(); // Refrescar la tabla cuando se complete una venta POS
  };

  return (
    <div className="flex items-center">
      <Menu />
      <div className="h-screen flex-grow">
        <TopBar />
        <div className="p-6">
          <p className="text-3xl font-semibold mb-3">
            GESTIÓN DE ENTREGAS Y SALIDAS
          </p>

          {/* 🔥 NUEVO BOTÓN POS - Agrega esto */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setIsPOSModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Store className="h-5 w-5" />
              Punto de Venta
            </button>
          </div>

          <RegisES onRegister={handleRefreshTable} />
          <SectionTabla
            refreshTable={refreshTable}
            onRegister={handleRefreshTable}
          />
        </div>
      </div>

      {/* 🔥 MODAL POS - Agrega esto al final */}
      <ModalPOS
        isOpen={isPOSModalOpen}
        onClose={() => setIsPOSModalOpen(false)}
        onSuccess={handlePOSSuccess}
      />
    </div>
  );
}

export default Entregas;
