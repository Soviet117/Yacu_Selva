import axios from "axios";

export function loadDataStartDashboard() {
  return axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/database/api/v1/dashboard/`);
}
