import GraficoPerformance from "../ui/GraficoPerformance";

function GraficoDashboard() {
  return (
    <div className="p-4 bg-white h-50 rounded-2xl shadow-md mb-4">
      <div className="text-center">
        <GraficoPerformance />
      </div>
    </div>
  );
}

export default GraficoDashboard;
