import React from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import logo from "../assets/logo.svg";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Book Ride" },
  { to: "/rides", label: "My Rides" },
  { to: "/profile", label: "Profile" }
];

function Navbar() {
  const location = useLocation();
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow z-10 flex items-center justify-between px-4 py-2">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="MotorLink Logo" className="h-8 w-8"/>
        <span className="font-bold text-primary text-lg">MotorLink</span>
      </Link>
      <ul className="flex gap-4">
        {navLinks.map(link => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`${
                location.pathname === link.to
                  ? "text-primary font-semibold"
                  : "text-gray-700"
              } hover:text-primary`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <LanguageSelector />
    </nav>
  );
}

export default Navbar;
