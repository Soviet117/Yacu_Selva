import Menu from "../components/layouts/Menu";
import TopBar from "../components/layouts/TopBar";
import RegisES from "../components/sections/RegisES";
import SectionTabla from "../components/sections/SectionTabla";
import { useState } from "react";

function Entregas() {
  const [refreshTable, setRefleshTable] = useState(false);

  const handleRefreshTable = () => {
    setRefleshTable((prev) => !prev);
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
          <RegisES onRegister={handleRefreshTable} />
          <SectionTabla
            refreshTable={refreshTable}
            onRegister={handleRefreshTable}
          />
        </div>
      </div>
    </div>
  );
}

export default Entregas;
