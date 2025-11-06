import axios from "axios";

export function loadDataStartDashboard() {
  return axios.get("http://127.0.0.1:8000/database/api/v1/dashboard/");
}
