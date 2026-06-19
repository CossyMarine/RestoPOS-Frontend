import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const NAV = [
  { to: "/home",      icon: "fa-house",         label: "Home" },
  { to: "/campaigns", icon: "fa-rectangle-ad",  label: "Campaigns" },
  { to: "/publisher", icon: "fa-store",          label: "Publish" },
  { to: "/deposit",   icon: "fa-wallet",         label: "Deposit" },
  { to: "/profile",   icon: "fa-circle-user",    label: "Profile" },
];

const UserLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "#0a1628", fontFamily: "Poppins,sans-serif" }}>

      {/* TOPBAR */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0"
        style={{ background: "#060e1a" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>
            <i className="fas fa-rectangle-ad text-white text-xs"></i>
          </div>
          <span className="font-extrabold text-white text-sm">
            Marine<span style={{ color: "#22d3ee" }}>Ads</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:block">{user?.fullName}</span>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-400 hover:text-white transition text-sm">
            <i className="fas fa-ellipsis-vertical"></i>
          </button>
        </div>
        {menuOpen && (
          <div className="absolute top-14 right-4 z-50 rounded-2xl border border-white/10 p-2 min-w-40 shadow-xl"
            style={{ background: "#0d2144" }}>
            <NavLink to="/profile" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 text-sm hover:bg-white/5 transition">
              <i className="fas fa-circle-user w-4"></i> Profile
            </NavLink>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 text-sm hover:bg-red-500/10 transition">
              <i className="fas fa-sign-out-alt w-4"></i> Logout
            </button>
          </div>
        )}
      </header>

      {/* PAGE */}
      <main className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
        <Outlet />
      </main>

      {/* BOTTOM NAV */}
      <nav className="shrink-0 flex border-t border-white/10"
        style={{ background: "#060e1a" }}>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 gap-1 text-xs font-semibold transition ${isActive ? "text-cyan-400" : "text-gray-600 hover:text-gray-400"}`
            }>
            <i className={`fas ${icon} text-base`}></i>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default UserLayout;
