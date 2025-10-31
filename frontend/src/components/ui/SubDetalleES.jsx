import InputCheck from "../ui/InputCheck";
function SubDetallesES({ id }) {
  const options = [
    { id: "prestado", nombre: "Prestado" },
    { id: "roto", nombre: "Roto" },
    { id: "perdido", nombre: "Perdido" },
    { id: "vendido", nombre: "Vendido" },
  ];
  return (
    <div className=" bg-gray-100 p-2 rounded-2xl space-y-2 mt-2">
      <p className="text-center text-lg font-semibold">Agregar detalle {id}</p>
      <InputCheck title={"Estado de bidon"} items={options} />
      <input type="checkbox" id="nose" />
      <label htmlFor="nose">Descontar</label>
    </div>
  );
}

export default SubDetallesES;
