// src/Components/BottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom"; 
import { Home, Wallet, User, Gift } from "lucide-react"; 
import "../Styles/Bottomnav.css"; 

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/home" 
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <Home size={24} />
        <span>Home</span>
      </NavLink>

      <NavLink 
        to="/earn" 
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <Gift size={24} />
        <span>Earn</span>
      </NavLink>

      <NavLink 
        to="/wallet" 
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <Wallet size={24} />
        <span>Wallet</span>
      </NavLink>

      <NavLink 
        to="/profile" 
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <User size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;