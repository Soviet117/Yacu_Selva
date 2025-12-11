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
    <>
      <p className="text-3xl font-semibold mb-3">
        GESTIÓN DE ENTREGAS Y SALIDAS
      </p>

      {/* Botón POS */}
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

      {/* Modal POS */}
      <ModalPOS
        isOpen={isPOSModalOpen}
        onClose={() => setIsPOSModalOpen(false)}
        onSuccess={handlePOSSuccess}
      />
    </>
  );
}

export default Entregas;
