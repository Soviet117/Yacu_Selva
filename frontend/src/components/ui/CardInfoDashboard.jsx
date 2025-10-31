import SubCardDashboard from "./SubCardDashboard";

function CardDashboard({ title, tipo }) {
  const data = {
    entrega: {
      rick: {
        p: "Rick Diaz",
        p1: "12 Bidones 20L",
        p2: "08:30",
        p3: "Completado",
      },
      Luis: {
        p: "Luis Nose",
        p1: "15 Bidones 20L",
        p2: "09:15",
        p3: "En ruta",
      },
    },
    ingresos: {
      1: { p: "S/. 20.0", p1: "Efectivo", p2: "Rick Neser", p3: "Hace 2h" },
      2: { p: "S/. 25.0", p1: "Yape", p2: "Luis Nose", p3: "Hace 4h" },
    },
  };

  const currentData = data[tipo] || {};
  const keys = Object.keys(currentData);

  return (
    <div className="bg-white shadow-md p-4 rounded-2xl">
      <p className="text-lg font-semibold">{title}</p>
      {keys.map((key) => {
        const item = currentData[key];
        return (
          <SubCardDashboard
            key={key}
            p={item.p}
            p1={item.p1}
            p2={item.p2}
            p3={item.p3}
          />
        );
      })}
    </div>
  );
}

export default CardDashboard;
