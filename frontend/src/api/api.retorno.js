import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/database/api/v1/retorno";

export function loadRetorno(foreignKey) {
  return axios.get(`${API_BASE}/${foreignKey}`);
}

// ⭐ NUEVA: Función para actualización parcial (PATCH)
export function updateRetorno(retornoId, updateData) {
  return axios.patch(`${API_BASE}/${retornoId}/`, updateData);
}
