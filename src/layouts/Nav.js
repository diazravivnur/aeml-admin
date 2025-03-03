import React from "react";
import { Link } from "react-router-dom";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminName } from "../Api/Api";

function Nav() {
  return (
    <nav className="border bg-white p-4 flex justify-between items-center">
      {/* Logo and Text */}
      <Link to="/Admin/Articles" className="flex items-center space-x-4">
        <img
          src="https://res.cloudinary.com/dwcbcgccc/image/upload/v1740653689/image/j8dgk9qjysck7zsbhkih.png"
          className="w-30 h-14 rounded" // Adjusted size
          alt="Logo"
        />
        <span className="font-bold text-l">Blog Admin</span>
      </Link>

      {/* Admin Profile Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <p
            type="text"
            placeholder="Admin name"
            className="bg-white p-2 rounded text-sm font-bold text-l"
          >
            <AdminName />
          </p>
          <div className="w-10 h-10 bg-[#F8F8F8] flex items-center justify-center rounded-sm">
            <img
              src="https://res.cloudinary.com/dwcbcgccc/image/upload/v1740653688/image/qi3es2vzokah3rfeihme.png"
              className="w-8 h-8 object-cover" // Ensures the image stays in bounds
              alt="Profile"
            />
          </div>
          <p className="bg-white p-2 rounded hover:cursor-pointer"></p>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
