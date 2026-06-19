import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AdminDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [filter,   setFilter]   = useState("all");
  const [loading,  setLoading]  = useState(true);

  const load = () => {
    setLoading(true);
    API.get("/wallet/admin/deposits").then(r => setDeposits(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const act = async (id, action) => {
    try {
      await API.put(`/wallet/admin/deposits/${id}/${action}`);
      load();
    } catch (e) { alert(e.response?.data?.message || "Failed"); }
  };

  const filtered = filter === "all" ? deposits : deposits.filter(d => d.status === filter);

  const sc = (s) => s === "completed" ? "text-green-400 bg-green-500/10 border-green-500/20"
    : s === "failed" ? "text-red-400 bg-red-500/10 border-red-500/20"
    : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";

  return (
    <div className="space-y-4" style={{ fontFamily: "Poppins,sans-serif" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-white">Deposit Requests</h2>
        <button onClick={load} className="text-xs text-gray-500 hover:text-white transition">
          <i className="fas fa-rotate-right mr-1"></i>Refresh
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all","pending","completed","failed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition border"
            style={{
              background: filter === f ? "linear-gradient(135deg,#06b6d4,#3b82f6)" : "rgba(255,255,255,0.05)",
              borderColor: filter === f ? "transparent" : "rgba(255,255,255,0.1)",
              color: filter === f ? "#fff" : "#6b7280",
            }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm animate-pulse">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl p-8 text-center border border-white/10 text-gray-500 text-sm"
          style={{ background: "rgba(255,255,255,0.03)" }}>
          No {filter !== "all" ? filter : ""} deposits found
        </div>
      ) : (
        filtered.map((d) => (
          <div key={d._id} className="rounded-2xl border border-white/10 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="flex items-start justify-between p-4">
              <div>
                <p className="text-white font-bold">{d.user?.fullName}</p>
                <p className="text-gray-500 text-xs">Account: {d.user?.phone}</p>
                <p className="text-gray-500 text-xs">
                  M-Pesa: <span className="text-white font-semibold">{d.meta?.mpesaPhone}</span>
                </p>
                <p className="text-gray-600 text-xs mt-1">{new Date(d.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold" style={{ color: "#22d3ee" }}>
                  KES {Number(d.amount).toLocaleString()}
                </p>
                <span className={`text-xs font-bold border px-2 py-0.5 rounded-lg capitalize ${sc(d.status)}`}>
                  {d.status}
                </span>
              </div>
            </div>
            {d.status === "pending" && (
              <div className="flex border-t border-white/10">
                <button onClick={() => act(d._id, "approve")}
                  className="flex-1 py-2.5 text-sm font-bold text-green-400 hover:bg-green-500/5 transition border-r border-white/10">
                  <i className="fas fa-check mr-2"></i>Approve
                </button>
                <button onClick={() => act(d._id, "reject")}
                  className="flex-1 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/5 transition">
                  <i className="fas fa-times mr-2"></i>Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDeposits;
