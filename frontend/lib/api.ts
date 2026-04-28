import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-api-k8z3.onrender.com/api/"
});

export default api;