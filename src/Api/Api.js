import axios from "axios";
import { useState } from "react";

/* this is the backend URL */
function Domain() {
  const baseUrl =
    process.env.REACT_APP_URL_API_DOMAIN || "https://doa-backend.my.id/api/v1"; // Fallback to localhost
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
  return authToken;
}

/* Retrieve the admin name from session storage */
export function AdminName() {
  const adminName = sessionStorage.getItem("adminName");
  sessionStorage.setItem("adminName", adminName);

  return adminName;
}

/* Logout function */
export function Logout(navigate) {
  // Clear session storage
  sessionStorage.clear();
  console.log("Logged out and cleared sessionStorage.");

  // Redirect using React Router's navigate function
  if (navigate) {
    navigate("/Login", { replace: true });
  } else {
    // Fallback: direct redirection for non-React navigation
    window.location.href = "/Login";
  }
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
