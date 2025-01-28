import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check sessionStorage for the auth token
    const token = sessionStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const login = (token, adminName) => {
    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("adminName", adminName);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("logout trigerred");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("adminName");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
