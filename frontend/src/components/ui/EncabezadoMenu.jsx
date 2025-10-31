function EncabezadoMenu({ span, negocio, tipo }) {
  return (
    <div className="flex items-center space-x-3 mb-6 p-6 pb-2">
      <span className="p-2 bg-blue-500 rounded-lg font-extrabold">{span}</span>
      <div>
        <p className="text-lg font-semibold">{negocio}</p>
        <p className="text-gray-500">{tipo}</p>
      </div>
    </div>
  );
}

export default EncabezadoMenu;
