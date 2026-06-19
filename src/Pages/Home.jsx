import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import API from "../api/axios";

const Card = ({ icon, label, value, color, sub }) => (
  <div className="rounded-2xl p-4 border border-white/10 flex items-center gap-3"
    style={{ background: "rgba(255,255,255,0.04)" }}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <i className={`fas ${icon} text-white text-sm`}></i>
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-extrabold text-white leading-tight">{value}</p>
      {sub && <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const Home = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    API.get("/wallet").then(r => setBalance(r.data.balance)).catch(() => setBalance(0));
  }, []);

  const campaigns = JSON.parse(localStorage.getItem(`campaigns_${user?._id}`) || "[]");
  const activeCampaigns = campaigns.filter(c => c.status === "active").length;

  return (
    <div className="space-y-5 py-1" style={{ fontFamily: "Poppins,sans-serif" }}>

      {/* WELCOME BANNER */}
      <div className="rounded-3xl p-5 border border-cyan-500/20"
        style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.12),rgba(59,130,246,0.12))" }}>
        <p className="text-xs text-cyan-400 font-semibold">Welcome back 👋</p>
        <h2 className="text-xl font-extrabold text-white mt-0.5">{user?.fullName}</h2>
        <p className="text-gray-500 text-xs mt-0.5">{user?.phone}</p>
        <div className="mt-4 rounded-2xl p-4 border border-white/10"
          style={{ background: "rgba(0,0,0,0.2)" }}>
          <p className="text-xs text-gray-400">Wallet Balance</p>
          <p className="text-3xl font-extrabold mt-1" style={{ color: "#22d3ee" }}>
            {balance === null ? "…" : `KES ${Number(balance).toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3">
        <Card icon="fa-rectangle-ad"   label="Active Campaigns" value={activeCampaigns}  color="bg-blue-600" />
        <Card icon="fa-eye"            label="Total Impressions" value="–"               color="bg-purple-600" sub="Connect campaigns" />
        <Card icon="fa-mouse-pointer"  label="Total Clicks"      value="–"               color="bg-green-600" />
        <Card icon="fa-store"          label="Publisher Slots"   value="2"               color="bg-orange-600" />
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { to: "/create-ad",  icon: "fa-plus",           label: "Create Ad",       bg: "linear-gradient(135deg,#06b6d4,#3b82f6)" },
            { to: "/campaigns",  icon: "fa-rectangle-ad",   label: "My Campaigns",    bg: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
            { to: "/publisher",  icon: "fa-store",          label: "Earn as Publisher",bg: "linear-gradient(135deg,#f59e0b,#ef4444)" },
            { to: "/deposit",    icon: "fa-wallet",         label: "Deposit",         bg: "linear-gradient(135deg,#10b981,#06b6d4)" },
          ].map(({ to, icon, label, bg }) => (
            <Link key={to} to={to}
              className="rounded-2xl p-4 flex flex-col items-center gap-2 text-white font-semibold text-xs text-center hover:opacity-90 transition active:scale-95"
              style={{ background: bg }}>
              <i className={`fas ${icon} text-xl`}></i>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* RECENT CAMPAIGNS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Campaigns</p>
          <Link to="/campaigns" className="text-xs font-semibold" style={{ color: "#22d3ee" }}>See all →</Link>
        </div>
        {campaigns.length === 0 ? (
          <div className="rounded-2xl p-6 text-center border border-white/10"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <i className="fas fa-rectangle-ad text-gray-700 text-3xl mb-2 block"></i>
            <p className="text-gray-500 text-sm">No campaigns yet.</p>
            <Link to="/create-ad" className="text-xs font-semibold mt-2 block" style={{ color: "#22d3ee" }}>
              Create your first ad →
            </Link>
          </div>
        ) : (
          campaigns.slice(-3).reverse().map((c) => (
            <Link key={c.id} to={`/campaigns/${c.id}`}
              className="flex items-center justify-between rounded-2xl p-4 border border-white/10 hover:border-cyan-500/30 transition mb-2"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <div>
                <p className="text-white font-semibold text-sm">{c.title}</p>
                <p className="text-gray-500 text-xs">{c.format} · {c.objective}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${c.status === "active" ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"}`}>
                {c.status}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
