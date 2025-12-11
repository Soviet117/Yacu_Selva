import axios from "axios";

function loadProducto() {
  return axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/database/api/v1/producto/`);
}
export default loadProducto;
