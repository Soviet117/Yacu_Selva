import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/auth/Login";
import Start from "./pages/Start";
import Entregas from "./pages/Entregas";
import Caja from "./pages/Caja";
import Reportes from "./pages/Reportes";
import Trabajadores from "./pages/Trabajadores";
import Configuraciones from "./pages/Configuraciones";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario logueado al cargar la app
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // Componente protegido
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sistema Yacu Selva...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/inicio" /> : <Login onLogin={handleLogin} />
          }
        />

        {/* Ruta por defecto */}
        <Route
          path="/"
          element={user ? <Navigate to="/inicio" /> : <Navigate to="/login" />}
        />

        {/* Rutas protegidas */}
        <Route
          path="/inicio"
          element={
            <ProtectedRoute>
              <Start onLogout={handleLogout} user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/entregas"
          element={
            <ProtectedRoute>
              <Entregas onLogout={handleLogout} user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/caja"
          element={
            <ProtectedRoute>
              <Caja onLogout={handleLogout} user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Reportes onLogout={handleLogout} user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trabajadores"
          element={
            <ProtectedRoute>
              <Trabajadores onLogout={handleLogout} user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/conf"
          element={
            <ProtectedRoute>
              <Configuraciones onLogout={handleLogout} user={user} />
            </ProtectedRoute>
          }
        />

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
