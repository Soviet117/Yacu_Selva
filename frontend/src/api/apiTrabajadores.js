import axios from "axios";
const BASE_URL = "http://127.0.0.1:8000/database/api/v1";

export const loadTrabajadores = () => {
  return axios.get(`${BASE_URL}/trabajadores/`);
};

export const createTrabajador = (data) => {
  return axios.post(`${BASE_URL}/trabajadores/`, data);
};

export const updateTrabajador = (id, data) => {
  return axios.put(`${BASE_URL}/trabajadores/${id}/`, data);
};

export const deleteTrabajador = (id) => {
  return axios.delete(`${BASE_URL}/trabajadores/${id}/`);
};

// NUEVO: Para vista previa
export const generarVistaPreviaTrabajadores = (filtros) => {
  return axios.post(`${BASE_URL}/reportes/generar_vista_previa/`, filtros);
};
