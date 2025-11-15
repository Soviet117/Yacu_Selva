import axios from "axios";

function loadProducto() {
  return axios.get("http://127.0.0.1:8000/database/api/v1/producto/");
}
export default loadProducto;
