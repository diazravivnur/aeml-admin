import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faFileAlt,
  faFolder,
  faInbox,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate(); // Navigation hook
  const { logout } = useContext(AuthContext);

  const links = [
    // { to: "/Admin/Dashboard", icon: faHome, label: "Dashboard" },
    { to: "/Admin/Articles", icon: faFileAlt, label: "Website Contents" },
  ];

  const handleLogout = () => {
    logout(); // Call the Logout function and redirect to Login
    navigate("/Login", { replace: true });
  };

  return (
    <nav className="border-r bg-white h-screen p-4 w-64 pt-10">
      {links.map((link) => (
        <Link key={link.to} to={link.to} aria-label={link.label}>
          <div
            className={`flex items-center text-black-300 hover:text-blue-500 cursor-pointer rounded-md p-2 mb-2 ${
              location.pathname === link.to ||
              (location.pathname === "/Admin" && link.to === "/Admin/Articles")
                ? "bg-gray-200"
                : ""
            }`}
          >
            <FontAwesomeIcon
              icon={link.icon}
              className="mr-3 text-indigo-500"
            />
            <span>{link.label}</span>
          </div>
        </Link>
      ))}
      {/* Logout button */}
      <div
        onClick={handleLogout} // Handle logout click
        className="flex items-center text-black-300 hover:text-red-500 cursor-pointer rounded-md p-2 mb-2"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-red-500" />
        <span>Logout</span>
      </div>
    </nav>
  );
}

export default SideBar;
