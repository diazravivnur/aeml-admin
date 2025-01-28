import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Domain from "../Api/Api";
import { AuthContext } from "../AuthContext";

function Login() {
  const [email, setEmail] = useState("jivatest@gmail.com");
  const [password, setPassword] = useState("testlogin123");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Access the login function

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${Domain()}/users/login`, {
        userIdentifier: email,
        password,
      });

      const authToken = response?.data?.data?.token;
      const adminName = response?.data?.data?.user?.username;
      if (!authToken) {
        throw new Error("Invalid response data");
      }

      login(authToken, adminName); // Update global auth state
      setError(null); // Clear errors
      navigate("/Admin/Dashboard", { replace: true }); // Navigate after login
    } catch (error) {
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
