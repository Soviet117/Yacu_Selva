import NavListMenu from "../ui/NavListMenu";
import EncabezadoMenu from "../ui/EncabezadoMenu";

function Menu() {
  return (
    <div className="h-screen flex flex-col bg-white shadow-xl border-r-2 border-gray-100">
      <EncabezadoMenu
        span={"YS"}
        negocio={"Yacu Selva"}
        tipo={"Sistema de Gestión"}
      />
      <div className="flex flex-col">
        <NavListMenu url={"/inicio"} text={"Inicio"} />
        <NavListMenu url={"/entregas"} text={"Entregas"} />
        <NavListMenu url={"/caja"} text={"Caja"} />
        <NavListMenu url={"/reportes"} text={"Reportes"} />
        <NavListMenu url={"/trabajadores"} text={"Trabajadores"} />
        <NavListMenu url={"/conf"} text={"Configuraciones"} />
      </div>

      <div className="bg-gray-300 rounded-xl m-3 px-4 py-2 mt-auto">
        <p>"Admin principal"</p>
        <p>"Administrador"</p>
      </div>
      <div className="flex justify-center mb-4">
        <button className="text-red-500">Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Menu;
