import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/database/api/v1";

export function loadCajaData() {
  return axios.get(`${BASE_URL}/retorno_res/`);
}

export function loadMovimientosCompletos(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
  if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);
  if (filtros.tipo && filtros.tipo !== "todos")
    params.append("tipo", filtros.tipo);
  if (filtros.metodo && filtros.metodo !== "todos")
    params.append("metodo", filtros.metodo);

  return axios.get(
    `${BASE_URL}/movimientos-caja/movimientos_caja_completos/?${params}`
  );
}

export function registrarMovimientoCaja(datos) {
  return axios.post(
    `${BASE_URL}/movimientos-caja/registrar_movimiento/`,
    datos,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

// AÑADE ESTA NUEVA FUNCIÓN para obtener trabajadores
export function obtenerTrabajadores() {
  return axios.get(`${BASE_URL}/movimientos-caja/obtener_trabajadores/`);
}
