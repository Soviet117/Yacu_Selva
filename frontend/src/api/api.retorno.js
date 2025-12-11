import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/database/api/v1/retorno`;

export function loadRetorno(foreignKey) {
  return axios.get(`${API_BASE}/${foreignKey}`);
}

export function loadRetornoAll() {
  return axios.get(API_BASE);
}

export function updateRetorno(retornoId, updateData) {
  return axios.patch(`${API_BASE}/${retornoId}/`, updateData);
}
