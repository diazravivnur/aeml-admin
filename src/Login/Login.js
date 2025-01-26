import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation

import Domain from "../Api/Api";

function Login() {
  const [email, setEmail] = useState("diazravivn2@gmail.com");
  const [password, setPassword] = useState("test");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Navigation hook

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${Domain()}/users/login`, {
        userIdentifier: email,
        password,
      });

      // Extract response data
      const authToken = response?.data?.data?.token;
      const adminName = response?.data?.data?.user?.username;

      if (!authToken || !adminName) {
        throw new Error("Invalid response data");
      }

      // Save token and username to sessionStorage
      sessionStorage.setItem("authToken", authToken);
      sessionStorage.setItem("adminName", adminName);

      // Clear error and log success for debugging
      setError(null);
      console.log("Login successful. Navigating to Admin dashboard...");

      // Navigate to Admin dashboard
      navigate("/Admin/Articles", { replace: true });
    } catch (error) {
      // Log error details for debugging
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
