import GraficoPerformance from "../ui/GraficoPerformance";

function GraficoDashboard() {
  return (
    <div className="p-4 lg:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md mb-4 border border-gray-200 dark:border-gray-700">
      <GraficoPerformance />
    </div>
  );
}

export default GraficoDashboard;
