// src/api/api.salida.js - VERSIÓN CORREGIDA
import axios from "axios";

// ✅ CAMBIADO: Usar variable de entorno
const BASE_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:8000"
}/database/api/v1`;

// Endpoint original para salidas (mantener por compatibilidad)
export function loadSalida() {
  return axios.get(`${BASE_URL}/salida/`);
}

// NUEVO: Endpoint para operaciones híbridas (salidas + ventas POS)
export function loadOperacionesHibridas() {
  return axios.get(`${BASE_URL}/operaciones/`);
}

export function loadOperacionesHoy() {
  return axios.get(`${BASE_URL}/operaciones/operaciones_hoy/`);
}

export function createSalida(formData) {
  return axios.post(`${BASE_URL}/salida/`, formData);
}
