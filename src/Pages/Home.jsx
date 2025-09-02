import React from "react";
import { FaUsers, FaWallet, FaGift, FaComments, FaUser, FaHandsHelping, FaTasks, FaWhatsapp, FaQuestionCircle } from "react-icons/fa";
import logo from "../Assets/logo.png"; // ✅ Import logo properly
import "../Styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <img src={logo} alt="MarineCash Logo" className="home-logo" />
        <h2>Welcome to MarineCash</h2>
        <p>Earn, Refer & Grow</p>
      </header>

      {/* Dashboard icons */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <FaUsers className="dashboard-icon" />
          <p>Referral</p>
        </div>

        <div className="dashboard-card">
          <FaTasks className="dashboard-icon" />
          <p>Earn</p>
        </div>

        <div className="dashboard-card">
          <FaHandsHelping className="dashboard-icon" />
          <p>Contact Support</p>
        </div>

        <div className="dashboard-card">
          <FaUser className="dashboard-icon" />
          <p>Profile</p>
        </div>

        <div className="dashboard-card">
          <FaWallet className="dashboard-icon" />
          <p>Wallet</p>
        </div>

        <div className="dashboard-card">
          <FaComments className="dashboard-icon" />
          <p>Chat Room</p>
        </div>

        <div className="dashboard-card">
          <FaGift className="dashboard-icon" />
          <p>Reward Code</p>
          <input
            type="text"
            placeholder="Enter Code"
            className="reward-input"
          />
          <button className="redeem-btn">Redeem</button>
        </div>
      </div>

      {/* Floating Icons */}
      <a
        href="https://chat.whatsapp.com/your-group-link"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-icon whatsapp"
      >
        <FaWhatsapp />
      </a>

      <button className="floating-icon chat">
        <FaQuestionCircle />
      </button>
    </div>
  );
}