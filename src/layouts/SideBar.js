import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faFileAlt,
  faFolder,
  faInbox,
  faUser,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

function SideBar() {
  const location = useLocation();

  const links = [
    { to: "/Admin/Dashboard", icon: faHome, label: "Dashboard" },
    { to: "/Admin/Articles", icon: faFileAlt, label: "Articles" },
    { to: "/Admin/Insight", icon: faFileAlt, label: "Publication" },
    { to: "/Admin/About-Us", icon: faFolder, label: "About-Us" },
    { to: "/Admin/Programs", icon: faInbox, label: "Programs" },
    { to: "/Logout", icon: faSignOutAlt, label: "Logout" },
  ];

  return (
    <nav className="border-r bg-white h-screen p-4 w-64 pt-10">
      {links.map((link) => (
        <Link key={link.to} to={link.to} aria-label={link.label}>
          <div
            className={`flex items-center text-black-300 hover:text-blue-500 cursor-pointer rounded-md p-2 mb-2 ${
              location.pathname === link.to ||
              (location.pathname === "/Admin" && link.to === "/Admin/Dashboard")
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
    </nav>
  );
}

export default SideBar;
