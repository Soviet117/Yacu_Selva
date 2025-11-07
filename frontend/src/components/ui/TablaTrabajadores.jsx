import React, { useState, useEffect } from "react";
import { FormularioEditarTrabajador } from "./FormularioEditarTrabajador";

const API_URL = "http://localhost:8000/database/api/v1/trabajadores/";

function TablaTrabajadores({ trabajadores, onEdit }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">DNI</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sueldo</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {trabajadores.length > 0 ? (
              trabajadores.map((t, i) => (
                <tr key={t.id_trabajador} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{t.nombre_completo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{t.dni}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {t.tipo_trabajador}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-semibold">S/. {parseFloat(t.sueldo).toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onEdit(t.id_trabajador)}
                      className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors text-sm font-medium shadow-sm"
                    >
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No se encontraron trabajadores
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchTrabajadores();
  }, []);

  const fetchTrabajadores = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al cargar los trabajadores");
      const data = await res.json();
      setTrabajadores(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrabajadorById = async (id) => {
    try {
      const res = await fetch(`${API_URL}${id}/`);
      if (!res.ok) throw new Error("Error al obtener trabajador");
      const data = await res.json();
      setFormData(data);
      setModoEdicion(true);
    } catch (err) {
      alert("No se pudo obtener el trabajador. Verifica el servidor.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_URL}${formData.id_trabajador}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al actualizar trabajador");
      alert("✅ Trabajador actualizado correctamente");
      setModoEdicion(false);
      fetchTrabajadores();
    } catch (err) {
      alert("❌ Error al guardar cambios: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Cargando trabajadores...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {!modoEdicion ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Trabajadores</h1>
                <p className="text-gray-600">
                  Total:{" "}
                  <span className="font-semibold text-blue-600">{trabajadores.length}</span>{" "}
                  trabajadores
                </p>
              </div>
              <button
                onClick={fetchTrabajadores}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
              >
                🔄 Recargar
              </button>
            </div>

            <TablaTrabajadores trabajadores={trabajadores} onEdit={fetchTrabajadorById} />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">✏️ Editar Trabajador</h2>
            <FormularioEditarTrabajador
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={() => setModoEdicion(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
