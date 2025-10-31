import axios from "axios";

export function loadCajaR() {
  return axios.get(
    "http://127.0.0.1:8000/database/api/v1/retorno_res/resumen_retornos/"
  );
}
