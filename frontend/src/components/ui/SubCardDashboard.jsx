function SubCardDashboard({ p, p1, p2, p3 }) {
  const state = {
    Completado: "text-green-800 bg-green-200 px-2 rounded-2xl",
    "En ruta": "text-blue-800 bg-blue-200 px-2 rounded-2xl",
    Tiempo: "text-gray-500",
  };

  return (
    <div className="bg-gray-100 flex justify-between p-2 rounded-2xl mb-2">
      <div>
        <p className="font-semibold">{p}</p>
        <p className="text-gray-500">{p1}</p>
      </div>
      <div className="text-end">
        <p className="font-semibold">{p2}</p>
        <p className={`${state[p3]}`}>{p3}</p>
      </div>
    </div>
  );
}

export default SubCardDashboard;
