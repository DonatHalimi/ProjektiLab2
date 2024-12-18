import axios from "axios";

const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: "https://localhost:44396/api",
  headers: { Authorization: `Bearer ${token}` },
});

export default axiosInstance;