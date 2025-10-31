import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Start from "./pages/Start";
import Entregas from "./pages/Entregas";
import Caja from "./pages/Caja";
import Reportes from "./pages/Reportes";
import Trabajadores from "./pages/Trabajadores";
import Configuraciones from "./pages/Configuraciones";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/inicio"} />} />
        <Route path="/inicio" element={<Start />} />
        <Route path="/entregas" element={<Entregas />} />
        <Route path="/caja" element={<Caja />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/trabajadores" element={<Trabajadores />} />
        <Route path="/conf" element={<Configuraciones />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
