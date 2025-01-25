import axios from "axios";
import { useState } from "react";

/* this is the backend URL */
function Domain() {
  const baseUrl =
    process.env.REACT_APP_URL_API_DOMAIN || "http://127.0.0.1:8080/api/v1"; // Fallback to localhost
  return baseUrl;
}

/* Test connection to the backend by hitting the sys/ping API */
export async function testBackendConnection() {
  const domain = Domain();
  console.log("Testing connection to backend at:", domain);

  try {
    const response = await axios.get(`${domain}/sys/ping`);
    console.log("Ping response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error pinging the backend:", error);
    return null;
  }
}

/* Retrieve the token from session storage */
export function AuthToken() {
  const authToken = sessionStorage.getItem("authToken");
  sessionStorage.setItem("authToken", authToken);
  console.log("Auth token from sessionStorage:", authToken);
  return authToken;
}

/* Retrieve the admin name from session storage */
export function AdminName() {
  const adminName = sessionStorage.getItem("adminName");
  sessionStorage.setItem("adminName", adminName);
  console.log("dari Api.js", adminName);
  console.log("Admin name from sessionStorage:", adminName);

  return adminName;
}

/* Logout function */
export function Logout() {
  sessionStorage.clear();
  console.log("Logged out and cleared sessionStorage.");

  window.addEventListener("beforeunload", function () {
    localStorage.removeItem("authToken");
    console.log("Auth token removed from localStorage.");
  });

  window.location.href = "http://localhost:3000/users/login";
}

/* Uncomment and modify this if you need an API instance with headers */
const api = axios.create({
  baseURL: Domain(),
});

// Add an interceptor to include the token in headers for requests
api.interceptors.request.use(
  (config) => {
    const authToken = sessionStorage.getItem("authToken");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
      console.log("Added token to headers:", authToken);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Domain;
