import Menu from "../components/layouts/Menu";
import TopBar from "../components/layouts/TopBar";

function Reportes() {
  
  return (
    <div className="flex items-center">
      <Menu />
      <div className="h-screen flex-grow overflow-auto bg-gray-50">
        <TopBar />

      </div>

      
    </div>
  );
}

export default Reportes;