import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  RefreshCw,
  AlertCircle,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";

function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const [formData, setFormData] = useState({
    nom_user: "",
    pass_user: "",
    id_tipo_user: "",
    id_trabajador: "",
    estado: true,
  });

  const [editFormData, setEditFormData] = useState({
    nom_user: "",
    pass_user: "",
    id_tipo_user: "",
    estado: true,
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadTiposUsuario(),
        loadTrabajadoresSinUsuario(),
      ]);
      setError("");
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
      setError("❌ Error al cargar los datos. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/database/api/v1/users/"
      );
      if (!response.ok) throw new Error("Error cargando usuarios");
      const data = await response.json();
      setUsers(data || []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      throw error;
    }
  };

  const loadTiposUsuario = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/database/api/v1/tipos-usuario/"
      );
      if (response.ok) {
        const data = await response.json();
        setTiposUsuario(data || []);
      }
    } catch (error) {
      console.error("Error cargando tipos de usuario:", error);
      throw error;
    }
  };

  const loadTrabajadoresSinUsuario = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/database/api/v1/trabajadores-sin-usuario/"
      );
      if (response.ok) {
        const data = await response.json();
        setTrabajadores(data || []);
      }
    } catch (error) {
      console.error("Error cargando trabajadores:", error);
      throw error;
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validaciones
      if (
        !formData.id_tipo_user ||
        !formData.id_trabajador ||
        !formData.nom_user
      ) {
        throw new Error("Todos los campos marcados con * son obligatorios");
      }

      if (!formData.pass_user || formData.pass_user.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      const submitData = {
        nom_user: formData.nom_user.trim(),
        pass_user: formData.pass_user,
        id_tipo_user: parseInt(formData.id_tipo_user),
        id_trabajador: parseInt(formData.id_trabajador),
        estado: formData.estado,
      };

      const response = await fetch(
        "http://localhost:8000/database/api/v1/users/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || responseData.detail || "Error creando usuario"
        );
      }

      // Recargar datos
      await loadInitialData();

      // Limpiar y cerrar modal
      setShowModal(false);
      setFormData({
        nom_user: "",
        pass_user: "",
        id_tipo_user: "",
        id_trabajador: "",
        estado: true,
      });
      setShowPassword(false);

      setTimeout(() => {
        alert("✅ Usuario creado exitosamente");
      }, 100);
    } catch (error) {
      console.error("Error creando usuario:", error);
      setError(error.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!editingUser) {
        throw new Error("No hay usuario seleccionado para editar");
      }

      const submitData = {
        nom_user: editFormData.nom_user.trim(),
        estado: editFormData.estado,
      };

      // Solo incluir tipo de usuario si se seleccionó uno
      if (editFormData.id_tipo_user) {
        submitData.id_tipo_user = parseInt(editFormData.id_tipo_user);
      }

      // Solo incluir contraseña si se proporcionó
      if (editFormData.pass_user && editFormData.pass_user.trim().length >= 6) {
        submitData.pass_user = editFormData.pass_user;
      }

      const response = await fetch(
        `http://localhost:8000/database/api/v1/users/${editingUser.id_user}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error ||
            responseData.detail ||
            "Error actualizando usuario"
        );
      }

      // Recargar datos
      await loadInitialData();

      // Limpiar y cerrar modal
      setShowEditModal(false);
      setEditingUser(null);
      setEditFormData({
        nom_user: "",
        pass_user: "",
        id_tipo_user: "",
        estado: true,
      });
      setShowEditPassword(false);

      setTimeout(() => {
        alert("✅ Usuario actualizado exitosamente");
      }, 100);
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      setError(error.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      nom_user: user.nom_user || "",
      pass_user: "", // Dejar en blanco para no cambiar
      id_tipo_user: user.id_tipo_user || "",
      estado: user.estado !== undefined ? user.estado : true,
    });
    setShowEditModal(true);
    setError("");
  };

  const handleDelete = async (userId) => {
    const userToDelete = users.find((u) => u.id_user === userId);
    if (!userToDelete) return;

    if (userId === currentUser?.id_user) {
      alert("⚠️ No puedes eliminar tu propio usuario");
      return;
    }

    if (
      !window.confirm(
        `¿Estás seguro de eliminar al usuario "${userToDelete.nom_user}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/database/api/v1/users/${userId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error eliminando usuario");
      }

      await loadUsers();
      setTimeout(() => {
        alert("✅ Usuario eliminado exitosamente");
      }, 100);
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      setError(error.message);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nom_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tipo_usuario?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNombreCompleto = (user) => {
    if (user.nombre_completo && user.nombre_completo !== "No asignado") {
      return user.nombre_completo;
    }
    if (user.trabajador_nombre && user.trabajador_apellido) {
      return `${user.trabajador_nombre} ${user.trabajador_apellido}`;
    }
    return "No asignado";
  };

  const openNewUserModal = () => {
    setFormData({
      nom_user: "",
      pass_user: "",
      id_tipo_user: "",
      id_trabajador: "",
      estado: true,
    });
    setShowModal(true);
    setError("");
    setShowPassword(false);
  };

  const closeCreateModal = () => {
    setShowModal(false);
    setFormData({
      nom_user: "",
      pass_user: "",
      id_tipo_user: "",
      id_trabajador: "",
      estado: true,
    });
    setError("");
    setShowPassword(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({
      nom_user: "",
      pass_user: "",
      id_tipo_user: "",
      estado: true,
    });
    setError("");
    setShowEditPassword(false);
  };

  const getTipoUsuarioClasses = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "administrador":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "semi admin":
      case "semi-admin":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case "vendedor":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "supervisor":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getEstadoClasses = (estado) => {
    return estado
      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white">
                Gestión de Usuarios
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Administra los usuarios del sistema ({users.length} usuarios
                registrados)
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadInitialData}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Actualizar</span>
          </button>
          <button
            onClick={openNewUserModal}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg flex items-center space-x-2 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Mostrar error */}
      {error && !showModal && !showEditModal && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por usuario, nombre o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Cargando usuarios...
            </span>
          </div>
        ) : (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    Usuario
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    Nombre
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    Rol
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    Estado
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id_user}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="font-medium block text-gray-900 dark:text-white">
                            {user.nom_user}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {user.id_user}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-800 dark:text-gray-200">
                        {getNombreCompleto(user)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoUsuarioClasses(
                          user.tipo_usuario
                        )}`}
                      >
                        {user.tipo_usuario || "Sin rol"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoClasses(
                          user.estado
                        )}`}
                      >
                        {user.estado ? "✅ Activo" : "❌ Inactivo"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors"
                          title="Editar usuario"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id_user)}
                          className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={user.id_user === currentUser?.id_user}
                          title={
                            user.id_user === currentUser?.id_user
                              ? "No puedes eliminar tu propio usuario"
                              : "Eliminar usuario"
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <User className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
            <p className="text-lg font-medium mb-2">
              {searchTerm
                ? "No se encontraron usuarios que coincidan"
                : "No hay usuarios registrados"}
            </p>
            <p className="text-sm">
              {searchTerm
                ? "Intenta con otros términos de búsqueda"
                : "¡Crea el primer usuario para comenzar!"}
            </p>
          </div>
        )}
      </div>

      {/* Modal para CREAR usuario */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={closeCreateModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white">
                Crear Nuevo Usuario
              </h3>
              <button
                onClick={closeCreateModal}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <span className="text-xl text-gray-600 dark:text-gray-400">
                  ×
                </span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre de usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom_user}
                  onChange={(e) =>
                    setFormData({ ...formData, nom_user: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="ejemplo@yacuselva.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.pass_user}
                    onChange={(e) =>
                      setFormData({ ...formData, pass_user: e.target.value })
                    }
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 pr-10"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de usuario <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.id_tipo_user}
                  onChange={(e) =>
                    setFormData({ ...formData, id_tipo_user: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposUsuario.map((tipo) => (
                    <option key={tipo.id_tipo_user} value={tipo.id_tipo_user}>
                      {tipo.nom_user}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trabajador asociado <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.id_trabajador}
                  onChange={(e) =>
                    setFormData({ ...formData, id_trabajador: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Seleccionar trabajador</option>
                  {trabajadores.map((trab) => (
                    <option
                      key={trab.id_trabajador}
                      value={trab.id_trabajador}
                      disabled={trab.tiene_usuario}
                      className="disabled:text-gray-400 dark:disabled:text-gray-600"
                    >
                      {trab.nombre_completo} - {trab.dni_p}
                      {trab.tiene_usuario && " (Ya tiene usuario)"}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Solo trabajadores sin usuario asignado
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="estado"
                  checked={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.checked })
                  }
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                />
                <label
                  htmlFor="estado"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Usuario activo
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para EDITAR usuario */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={closeEditModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white">
                Editar Usuario
              </h3>
              <button
                onClick={closeEditModal}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <span className="text-xl text-gray-600 dark:text-gray-400">
                  ×
                </span>
              </button>
            </div>

            {editingUser && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  <strong>👤 Trabajador asociado:</strong>{" "}
                  {getNombreCompleto(editingUser)}
                  <br />
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    (El trabajador no se puede cambiar)
                  </span>
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre de usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.nom_user}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      nom_user: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="usuario@yacuselva.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nueva contraseña
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    (dejar en blanco para no cambiar)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? "text" : "password"}
                    value={editFormData.pass_user}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        pass_user: e.target.value,
                      })
                    }
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 pr-10"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showEditPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Mínimo 6 caracteres si desea cambiar
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de usuario <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={editFormData.id_tipo_user}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      id_tipo_user: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposUsuario.map((tipo) => (
                    <option key={tipo.id_tipo_user} value={tipo.id_tipo_user}>
                      {tipo.nom_user}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editEstado"
                  checked={editFormData.estado}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      estado: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                />
                <label
                  htmlFor="editEstado"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Usuario activo
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Actualizar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
