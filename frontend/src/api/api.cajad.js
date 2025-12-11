// api.cajad.js
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/database/api/v1`;

// Esta función debería apuntar a resumen_caja_completo
export function loadCajaR() {
  return axios.get(`${BASE_URL}/retorno_res/resumen_caja_completo/`);
}
