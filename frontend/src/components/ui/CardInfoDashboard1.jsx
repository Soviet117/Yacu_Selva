import SubCardDashboard from "./SubCardDashboard";
function formatHora(horaCompleta) {
  if (!horaCompleta) return "";
  // Extraer solo HH:MM:SS (eliminar microsegundos)
  return horaCompleta.split(".")[0];
}

function redondearADosDecimales(valor) {
  return Number(parseFloat(valor).toFixed(2));
}

function CardDashboard1({ title, data }) {
  if (data.length === 0) {
    return;
  }

  return (
    <div className="bg-white shadow-md p-4 rounded-2xl">
      <p className="text-lg font-semibold">{title}</p>
      <div>
        <SubCardDashboard
          key={data[0].id_salida}
          p={`S/. ${redondearADosDecimales(data[0].total_cancelado)}`}
          p1={data[0].responsable}
          p2={formatHora(data[0].hora)}
          p3={data[0].fecha}
        />
        <SubCardDashboard
          key={data[1].id_salida}
          p={`S/. ${redondearADosDecimales(data[0].total_cancelado)}`}
          p1={data[1].responsable}
          p2={formatHora(data[1].hora)}
          p3={data[1].fecha}
        />
      </div>
    </div>
  );
}

export default CardDashboard1;
