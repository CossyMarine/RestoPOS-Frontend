//src/Pages/Admin/AdminWithdrawals.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [msg, setMsg]                 = useState({ text: "", success: true });

  const flash = (t, s = true) => { setMsg({ text: t, success: s }); setTimeout(() => setMsg({ text: "", success: true }), 3000); };

  const fetchWithdrawals = () => {
    API.get("/admin/withdrawals")
      .then((res) => setWithdrawals(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWithdrawals(); }, []);

  const handleProcess = async (userId, withdrawalIndex, status) => {
    try {
      await API.post("/admin/withdrawals/process", { userId, withdrawalIndex, status });
      flash(`Withdrawal ${status} ✅`);
      fetchWithdrawals();
    } catch (e) { flash("❌ " + (e.response?.data?.message || "Failed."), false); }
  };

  const pending   = withdrawals.filter((w) => w.status === "pending");
  const processed = withdrawals.filter((w) => w.status !== "pending");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-extrabold text-gray-800">Withdrawals</h2>

      {msg.text && (
        <div className={`p-3 rounded-xl text-sm font-semibold text-center ${msg.success ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
          {msg.text}
        </div>
      )}

      {loading ? (
        <p className="text-center text-orange-500 animate-pulse font-bold py-8">Loading...</p>
      ) : (
        <>
          {/* Pending */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="bg-yellow-50 px-4 py-3 border-b border-yellow-100">
              <h3 className="font-bold text-yellow-700 text-sm">⏳ Pending ({pending.length})</h3>
            </div>
            {pending.length === 0 ? (
              <p className="text-center text-gray-400 py-6 text-sm">No pending withdrawals.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {pending.map((w, i) => (
                  <div key={i} className="flex items-center justify-between p-4 gap-3">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{w.user?.fullName || "User"}</p>
                      <p className="text-xs text-gray-400">{w.user?.email}</p>
                      <p className="text-green-600 font-bold text-sm mt-0.5">${Number(w.amount).toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400">{new Date(w.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleProcess(w.userId, w.index, "approved")}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleProcess(w.userId, w.index, "rejected")}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Processed */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-600 text-sm">History ({processed.length})</h3>
            </div>
            {processed.length === 0 ? (
              <p className="text-center text-gray-400 py-6 text-sm">No history yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {processed.map((w, i) => (
                  <div key={i} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{w.user?.fullName}</p>
                      <p className="text-green-600 font-bold text-sm">${Number(w.amount).toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400">{new Date(w.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${w.status === "approved" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                      {w.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminWithdrawals;
