// En src/api/api.pos.js - VERSIÓN CORREGIDA
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/database/api/v1";

export function registrarSalidaPOS(datos) {
  return axios.post(`${BASE_URL}/pos/registrar_salida_pos/`, datos, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function loadClientes() {
  return axios.get(`${BASE_URL}/clientes/clientes_lista/`);
}

export function loadTrabajadoresPlanta() {
  return axios.get(`${BASE_URL}/pos/trabajadores_planta/`);
}

export function loadProducto() {
  return axios.get(`${BASE_URL}/producto/`);
}
