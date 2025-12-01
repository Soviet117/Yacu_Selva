import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Building2 } from "lucide-react";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor, complete todos los campos");
      setLoading(false);
      return;
    }

    try {
      // CAMBIAR ESTA URL - agregar /database/ antes de /api/v1/
      const response = await fetch(
        "http://localhost:8000/database/api/v1/login/",
        {
          // ← Agregar /database/
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom_user: formData.email,
            pass_user: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("✅ Login exitoso:", data.user);

        // Guardar en localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", "real-token-" + Date.now());
        localStorage.setItem("isAuthenticated", "true");

        // Llamar a la función onLogin del padre
        onLogin(data.user);
      } else {
        setError(data.message || "Error en el login");
      }
    } catch (err) {
      setError("Error de conexión. Verifique el servidor.");
      console.error("Error en login:", err);
    } finally {
      setLoading(false);
    }
  };
  // Credenciales fijas para prueba
  const validUsers = [
    {
      email: "admin@yacuselva.com",
      password: "admin123",
      userData: {
        id: 1,
        name: "Admin Principal",
        email: "admin@yacuselva.com",
        role: "Administrador",
        empresa: "Yacu Selva",
        loginTime: new Date().toISOString(),
      },
    },
    {
      email: "usuario@yacuselva.com",
      password: "user123",
      userData: {
        id: 2,
        name: "Usuario de Prueba",
        email: "usuario@yacuselva.com",
        role: "Usuario",
        empresa: "Yacu Selva",
        loginTime: new Date().toISOString(),
      },
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleForgotPassword = () => {
    alert(
      `Para esta demo use:\nEmail: ${validCredentials.email}\nContraseña: ${validCredentials.password}`
    );
  };

  // Función para llenar automáticamente (útil para testing)
  const autoFill = () => {
    setFormData({
      email: validCredentials.email,
      password: validCredentials.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Building2 className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">YACU SELVA</h1>
            </div>
            <p className="text-blue-100 text-sm">
              Sistema de Gestión Integral - MODO PRUEBA
            </p>
          </div>

          {/* Formulario */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gray-600">
                Ingrese sus credenciales para acceder al sistema
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="admin@yacuselva.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="admin123"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>

            {/* Información adicional */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿Necesita ayuda?{" "}
                  <button
                    onClick={handleForgotPassword}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Recuperar contraseña
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © 2024 Yacu Selva. Sistema de Gestión v1.0.0 - MODO DEMO
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
