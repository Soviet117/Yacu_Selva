// pages/Entregas.jsx
import { useState } from "react";
import { Store } from "lucide-react";
import ModalPOS from "../components/ui/ModalPOS";
import RegisES from "../components/sections/RegisES";
import SectionTabla from "../components/sections/SectionTabla";

function Entregas({ user }) {
  const [refreshTable, setRefleshTable] = useState(false);
  const [isPOSModalOpen, setIsPOSModalOpen] = useState(false);

  const handleRefreshTable = () => {
    setRefleshTable((prev) => !prev);
  };

  const handlePOSSuccess = () => {
    handleRefreshTable();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 lg:p-6">
      <p className="text-2xl lg:text-3xl font-semibold mb-4 lg:mb-6 dark:text-white">
        GESTIÓN DE ENTREGAS Y SALIDAS
      </p>

      {/* Botón POS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setIsPOSModalOpen(true)}
          className="flex items-center gap-2 px-4 lg:px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Store className="h-5 w-5" />
          <span className="text-sm lg:text-base">Punto de Venta</span>
        </button>
      </div>

      <RegisES onRegister={handleRefreshTable} />
      <SectionTabla
        refreshTable={refreshTable}
        onRegister={handleRefreshTable}
      />

      {/* Modal POS */}
      <ModalPOS
        isOpen={isPOSModalOpen}
        onClose={() => setIsPOSModalOpen(false)}
        onSuccess={handlePOSSuccess}
      />
    </div>
  );
}

export default Entregas;
