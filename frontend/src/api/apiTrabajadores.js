import axios from "axios";

const API_URL = "http://localhost:8000/database/api/v1/trabajadores/";

export function loadTrabajadores() {
  return axios.get(API_URL);
}

export function getTrabajador(id) {
  return axios.get(`${API_URL}${id}/`);
}

export function createTrabajador(formData) {
  return axios.post(API_URL, formData);
}

export function updateTrabajador(id, formData) {
  return axios.patch(`${API_URL}${id}/`, formData);
}

export function deleteTrabajador(id) {
  return axios.delete(`${API_URL}${id}/`);
}

export function getTrabajadoresPorTipo(tipoId) {
  return axios.get(`${API_URL}por_tipo/?tipo_id=${tipoId}`);
}