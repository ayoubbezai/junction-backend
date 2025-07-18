import axios from "axios";

// Extract subdomain (e.g., drsmile from drsmile.ayoubbezai.site)
const host = window.location.hostname;
const subdomain = host.split(".")[0];
console.log("hostis", host, subdomain);
// Build API URL dynamically
const isLocalhost = host.includes("localhost");
const API_URL = "http://localhost:8000/api"

console.log("API URL:", API_URL);

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Add Bearer token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;