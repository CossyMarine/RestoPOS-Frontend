import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const links = [
  { to: "/admin",          icon: "fa-chart-line",  label: "Dashboard", end: true },
  { to: "/admin/deposits", icon: "fa-wallet",       label: "Deposits" },
  { to: "/admin/users",    icon: "fa-users",        label: "Users" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const lc = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${isActive ? "bg-cyan-500 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`;

  return (
    <div className="flex h-screen bg-[#0a1628] overflow-hidden" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#060e1a] border-r border-white/10 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}>
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <i className="fas fa-wave-square text-white text-xs"></i>
          </div>
          <div>
            <p className="text-white font-extrabold text-sm">MarineAds</p>
            <p className="text-cyan-400 text-[10px] font-semibold uppercase">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={lc} onClick={() => setOpen(false)}>
              <i className={`fas ${l.icon} w-4 text-center`}></i>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-600 font-semibold mb-2 truncate">{user?.name}</p>
          <button onClick={handleLogout} className="w-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-xl py-2 text-sm hover:bg-red-500/30 transition">
            <i className="fas fa-sign-out-alt mr-2"></i>Logout
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#060e1a] border-b border-white/10 h-14 flex items-center justify-between px-5 shrink-0">
          <button onClick={() => setOpen(!open)} className="lg:hidden text-gray-400 text-xl"><i className="fas fa-bars"></i></button>
          <h1 className="text-white font-bold text-sm">Admin Dashboard</h1>
          <NavLink to="/dashboard" className="text-xs text-cyan-400 font-semibold hover:underline">← User Side</NavLink>
        </header>
        <main className="flex-1 overflow-y-auto p-5 bg-[#0a1628]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
