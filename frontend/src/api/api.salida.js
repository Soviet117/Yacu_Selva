import axios from "axios";

const API_URL = "http://localhost:8000/database/api/v1/salida/";

export function loadSalida() {
  return axios.get(API_URL);
}

export function createSalida(formData){
  return axios.post(API_URL,formData);
}
  