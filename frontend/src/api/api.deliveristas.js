import axios from "axios"

function loadDeliveristas(){
    return axios.get("http://127.0.0.1:8000/database/api/v1/delivery/")
}

export default loadDeliveristas;