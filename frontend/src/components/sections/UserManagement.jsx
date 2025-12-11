import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, User, RefreshCw } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Modal separado para editar
  const [editingUser, setEditingUser] = useState(null);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [error, setError] = useState("");

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
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/database/api/v1/users/`
      );
      if (!response.ok) throw new Error("Error cargando usuarios");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      throw error;
    }
  };

  const loadTiposUsuario = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/database/api/v1/tipos-usuario/`
      );
      if (response.ok) {
        const data = await response.json();
        setTiposUsuario(data);
      }
    } catch (error) {
      console.error("Error cargando tipos de usuario:", error);
      throw error;
    }
  };

  const loadTrabajadoresSinUsuario = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/database/api/v1/trabajadores-sin-usuario/`
      );
      if (response.ok) {
        const data = await response.json();
        setTrabajadores(data);
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
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/database/api/v1/users/`,
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
      id_tipo_user: user.id_tipo_user || "", // ID del tipo de usuario
      estado: user.estado !== undefined ? user.estado : true,
    });
    setShowEditModal(true);
    setError("");
  };

  const handleDelete = async (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
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
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        setError(error.message);
      }
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
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-lg font-semibold">Gestión de Usuarios</p>
          <p className="text-sm text-gray-600">
            Administra los usuarios del sistema ({users.length} usuarios)
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadInitialData}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Actualizar</span>
          </button>
          <button
            onClick={openNewUserModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Mostrar error */}
      {error && !showModal && !showEditModal && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por usuario, nombre o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando usuarios...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Usuario
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Nombre
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Rol
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Estado
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id_user}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium block">
                          {user.nom_user}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {user.id_user}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getNombreCompleto(user)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.tipo_usuario === "Administrador"
                          ? "bg-red-100 text-red-800"
                          : user.tipo_usuario === "Semi Admin"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.tipo_usuario}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.estado
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar usuario"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id_user)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "No se encontraron usuarios que coincidan con la búsqueda"
              : "No hay usuarios registrados"}
          </div>
        )}
      </div>

      {/* Modal para CREAR usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Nuevo Usuario</h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de usuario *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom_user}
                  onChange={(e) =>
                    setFormData({ ...formData, nom_user: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="usuario@yacuselva.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  required
                  value={formData.pass_user}
                  onChange={(e) =>
                    setFormData({ ...formData, pass_user: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de usuario *
                </label>
                <select
                  required
                  value={formData.id_tipo_user}
                  onChange={(e) =>
                    setFormData({ ...formData, id_tipo_user: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trabajador asociado *
                </label>
                <select
                  required
                  value={formData.id_trabajador}
                  onChange={(e) =>
                    setFormData({ ...formData, id_trabajador: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar trabajador</option>
                  {trabajadores.map((trab) => (
                    <option
                      key={trab.id_trabajador}
                      value={trab.id_trabajador}
                      disabled={trab.tiene_usuario}
                    >
                      {trab.nombre_completo} - {trab.dni_p}
                      {trab.tiene_usuario && " (Ya tiene usuario)"}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Solo se muestran trabajadores sin usuario asignado
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
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="estado" className="text-sm text-gray-700">
                  Usuario activo
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Editar Usuario</h3>

            {editingUser && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  <strong>Trabajador asociado:</strong>{" "}
                  {getNombreCompleto(editingUser)}
                  <br />
                  <span className="text-xs">
                    (El trabajador no se puede cambiar)
                  </span>
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de usuario *
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
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="usuario@yacuselva.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña (dejar en blanco para no cambiar)
                </label>
                <input
                  type="password"
                  value={editFormData.pass_user}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      pass_user: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de usuario *
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
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="editEstado" className="text-sm text-gray-700">
                  Usuario activo
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
