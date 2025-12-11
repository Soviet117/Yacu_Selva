// pages/Caja.jsx
import StartCaja from "../components/sections/StartCaja";
import SecctionTablaCaja from "../components/sections/SecctionTablaCaja";

function Caja({ user }) {
  return (
    <>
      <p className="text-3xl font-semibold mb-3">GESTIÓN DE CAJA</p>
      <StartCaja />
      <SecctionTablaCaja />
    </>
  );
}

export default Caja;
