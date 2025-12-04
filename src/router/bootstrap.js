// src/router/bootstrap.js
import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000/api"; // ← FIXED
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Attach token automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token"); // Vuex not needed here
  console.log("Sending Token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axios;

// import axios from "axios";

// axios.defaults.baseURL = "http://127.0.0.1:8000";
// // axios.defaults.withCredentials = true;

// axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
// axios.defaults.headers.common["Accept"] = "application/json";
// axios.defaults.headers.common["Content-Type"] = "application/json";

// // Attach token automatically
// axios.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth-token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default axios;

// import axios from "axios";
// import store from "../store";
// // app.config.globalProperties.$axios = axios;

// axios.defaults.baseURL = "http://127.0.0.1:8000";
// axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
// axios.defaults.headers.common["Accept"] = "application/json";
// axios.defaults.headers.common["Content-Type"] = "application/json";

// axios.interceptors.request.use((config) => {
//   const token = store.state.authToken || localStorage.getItem("auth-token");
//   console.log("Token from localStorage:", token); // Debug: Check if token exists
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     console.log("Authorization header added:", config.headers.Authorization); // Debug: Confirm header
//   } else {
//     console.warn("No auth-token found in localStorage!"); // Debug: Alert if missing
//   }
//   return config;
// });

// export default axios;
