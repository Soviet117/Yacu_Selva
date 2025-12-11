// pages/Caja.jsx
import StartCaja from "../components/sections/StartCaja";
import SecctionTablaCaja from "../components/sections/SecctionTablaCaja";

function Caja({ user }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <p className="text-3xl font-semibold mb-3">GESTIÓN DE CAJA</p>
      <StartCaja />
      <SecctionTablaCaja />
    </div>
  );
}

export default Caja;
