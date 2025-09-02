// Components/NavBar.js
import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav
      style={{
        background: "orange",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Logo / Brand */}
      <h2 style={{ color: "white", margin: 0 }}>MarineCash</h2>

      {/* Links */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/register" style={linkStyle}>Register</Link>
        <Link to="/login" style={linkStyle}>Login</Link>
        <Link to="/wallet" style={linkStyle}>Wallet</Link>
        <Link to="/referral" style={linkStyle}>Referral</Link>
        <Link to="/reward" style={linkStyle}>Reward Code</Link>
        <Link to="/support" style={linkStyle}>Contact Support</Link>
        <Link to="/chat" style={linkStyle}>Chat Room</Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  transition: "0.3s",
};

export default NavBar;