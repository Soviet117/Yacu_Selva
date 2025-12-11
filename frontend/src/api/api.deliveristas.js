import axios from "axios"

function loadDeliveristas(){
    return axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/database/api/v1/delivery/`)
}

export default loadDeliveristas;