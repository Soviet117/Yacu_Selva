import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/auth/Login";
import MainLayout from "./components/layouts/MainLayout";
import Start from "./pages/Start";
import Entregas from "./pages/Entregas";
import Caja from "./pages/Caja";
import Reportes from "./pages/Reportes";
import Trabajadores from "./pages/Trabajadores";
import Configuraciones from "./pages/Configuraciones";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [userModules, setUserModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/database`;

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchUserModules(parsedUser.id_user);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserModules = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/user-modules/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.modules) {
        setUserModules(response.data.modules);
      }
    } catch (error) {
      console.error("Error al cargar módulos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    console.log("📊 Datos del usuario recibidos:", userData);
    setUser(userData);
    if (userData.id_user) {
      fetchUserModules(userData.id_user);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setUserModules([]);
    window.location.href = "/login";
  };

  const hasAccessToRoute = (route) => {
    // Siempre permitir acceso al inicio
    if (route === "/inicio") {
      return true;
    }

    if (!user || userModules.length === 0) return false;

    if (user.tipo_usuario === "Administrador") {
      return true;
    }

    return userModules.some((module) => module.ruta === route);
  };

  // Componente para rutas protegidas
  const ProtectedRoute = ({ children, requiredRoute }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    // Si aún no se cargaron los módulos, mostrar loading
    if (userModules.length === 0 && loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando permisos...</p>
          </div>
        </div>
      );
    }

    if (!hasAccessToRoute(requiredRoute)) {
      return <Navigate to="/inicio" />;
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

        {/* Layout principal con rutas protegidas */}
        <Route
          element={
            <ProtectedRoute requiredRoute="/inicio">
              <MainLayout
                onLogout={handleLogout}
                user={user}
                userModules={userModules}
              />
            </ProtectedRoute>
          }
        >
          {/* Rutas hijas */}
          <Route path="inicio" element={<Start user={user} />} />

          <Route
            path="entregas"
            element={
              <ProtectedRoute requiredRoute="/entregas">
                <Entregas user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="caja"
            element={
              <ProtectedRoute requiredRoute="/caja">
                <Caja user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="reportes"
            element={
              <ProtectedRoute requiredRoute="/reportes">
                <Reportes user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="trabajadores"
            element={
              <ProtectedRoute requiredRoute="/trabajadores">
                <Trabajadores user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="conf"
            element={
              <ProtectedRoute requiredRoute="/conf">
                <Configuraciones user={user} />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/inicio" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
