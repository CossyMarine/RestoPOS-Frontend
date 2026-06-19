import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const LINKS = [
  { to: "/admin",          icon: "fa-chart-line",   label: "Dashboard",  end: true },
  { to: "/admin/deposits", icon: "fa-wallet",        label: "Deposits" },
  { to: "/admin/users",    icon: "fa-users",         label: "Users" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const lc = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition
     ${isActive ? "text-white" : "text-gray-500 hover:text-gray-200 hover:bg-white/5"}`;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0a1628", fontFamily: "Poppins,sans-serif" }}>

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 flex flex-col border-r border-white/10 transition-transform duration-200
        ${sideOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}
        style={{ background: "#060e1a" }}>
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>
            <i className="fas fa-rectangle-ad text-white text-xs"></i>
          </div>
          <div>
            <p className="text-white font-extrabold text-sm">MarineAds</p>
            <p className="text-[10px] font-bold uppercase" style={{ color: "#22d3ee" }}>Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {LINKS.map(({ to, icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={lc}
              onClick={() => setSideOpen(false)}
              style={({ isActive }) => isActive ? { background: "linear-gradient(135deg,rgba(6,182,212,0.15),rgba(59,130,246,0.15))", color: "#22d3ee" } : {}}>
              <i className={`fas ${icon} w-4 text-center`}></i>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-600 font-semibold mb-2 truncate">{user?.fullName}</p>
          <button onClick={handleLogout}
            className="w-full py-2 rounded-xl text-sm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition">
            <i className="fas fa-sign-out-alt mr-2"></i>Logout
          </button>
        </div>
      </aside>

      {sideOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSideOpen(false)} />
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 flex items-center justify-between px-5 border-b border-white/10 shrink-0"
          style={{ background: "#060e1a" }}>
          <button onClick={() => setSideOpen(!sideOpen)} className="lg:hidden text-gray-400 hover:text-white text-lg">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="text-white font-bold text-sm">Admin Dashboard</h1>
          <NavLink to="/home" className="text-xs font-semibold hover:underline" style={{ color: "#22d3ee" }}>
            ← User Side
          </NavLink>
        </header>
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
