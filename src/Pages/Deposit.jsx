import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../Context/AuthContext";

const Deposit = () => {
  const { user } = useAuth();
  const [form, setForm]   = useState({ mpesaPhone: "", amount: "" });
  const [step, setStep]   = useState("form");
  const [txn, setTxn]     = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    API.get("/wallet/transactions").then(r => setHistory(r.data.filter(t => t.type === "deposit"))).catch(() => {});
  }, [step]);

  const submit = async () => {
    if (!form.mpesaPhone || !form.amount) return setError("Fill all fields.");
    if (Number(form.amount) < 50) return setError("Minimum deposit is KES 50.");
    setLoading(true); setError("");
    try {
      const res = await API.post("/wallet/deposit", { amount: Number(form.amount), mpesaPhone: form.mpesaPhone });
      setTxn(res.data.transaction);
      setStep("success");
    } catch (e) {
      setError(e.response?.data?.message || "Failed. Try again.");
    }
    setLoading(false);
  };

  if (step === "success") return (
    <div className="flex flex-col items-center text-center py-8" style={{ fontFamily: "Poppins,sans-serif" }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 border border-green-500/30"
        style={{ background: "rgba(34,197,94,0.1)" }}>
        <i className="fas fa-check text-green-400 text-3xl"></i>
      </div>
      <h2 className="text-xl font-extrabold text-white mb-1">Request Sent!</h2>
      <p className="text-gray-400 text-sm mb-5">Admin will verify and credit your wallet.</p>
      <div className="rounded-2xl p-5 border border-white/10 w-full max-w-xs text-left space-y-3"
        style={{ background: "rgba(255,255,255,0.04)" }}>
        {[["M-Pesa Phone", txn?.meta?.mpesaPhone], ["Amount", `KES ${Number(txn?.amount).toLocaleString()}`], ["Status", "Pending"]].map(([l, v]) => (
          <div key={l} className="flex justify-between text-sm">
            <span className="text-gray-500">{l}</span>
            <span className={`font-semibold ${l === "Status" ? "text-yellow-400" : l === "Amount" ? "text-cyan-400" : "text-white"}`}>{v}</span>
          </div>
        ))}
      </div>
      <button onClick={() => { setStep("form"); setForm({ mpesaPhone: "", amount: "" }); }}
        className="mt-6 text-sm font-semibold" style={{ color: "#22d3ee" }}>
        + Another deposit
      </button>
    </div>
  );

  return (
    <div className="py-1 space-y-5" style={{ fontFamily: "Poppins,sans-serif" }}>
      <div>
        <h2 className="text-xl font-extrabold text-white">Deposit via M-Pesa</h2>
        <p className="text-gray-500 text-xs mt-0.5">Top up your MarineAds wallet</p>
      </div>

      {/* STEPS */}
      <div className="rounded-2xl p-4 border border-green-500/20"
        style={{ background: "rgba(34,197,94,0.06)" }}>
        <p className="text-green-400 font-bold text-sm mb-2">
          <i className="fas fa-mobile-screen-button mr-2"></i>Payment Steps
        </p>
        <ol className="text-xs text-gray-400 space-y-1.5 list-decimal list-inside">
          <li>Open M-Pesa on your Safaricom line</li>
          <li>Send money to <span className="text-white font-bold">0712 345 678</span> (MarineAds)</li>
          <li>Enter that same phone number + amount below</li>
          <li>We verify and credit your wallet (usually &lt; 1hr)</li>
        </ol>
      </div>

      {error && (
        <div className="rounded-xl p-3 text-sm text-red-400 border border-red-500/30"
          style={{ background: "rgba(239,68,68,0.08)" }}>{error}</div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-400">M-Pesa Phone Used</label>
          <input type="tel" placeholder="07XXXXXXXX"
            value={form.mpesaPhone} onChange={(e) => setForm({ ...form, mpesaPhone: e.target.value })}
            className="w-full mt-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400">Amount (KES)</label>
          <input type="number" placeholder="e.g. 500"
            value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full mt-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[100, 500, 1000, 2500, 5000].map((a) => (
            <button key={a} onClick={() => setForm({ ...form, amount: String(a) })}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition border"
              style={{
                background: form.amount === String(a) ? "linear-gradient(135deg,#06b6d4,#3b82f6)" : "rgba(255,255,255,0.05)",
                borderColor: form.amount === String(a) ? "transparent" : "rgba(255,255,255,0.1)",
                color: form.amount === String(a) ? "#fff" : "#9ca3af",
              }}>
              {a.toLocaleString()}
            </button>
          ))}
        </div>

        <button onClick={submit} disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>
          {loading ? "Submitting…" : <><i className="fas fa-paper-plane mr-2"></i>Submit Deposit Request</>}
        </button>
      </div>

      {/* HISTORY */}
      {history.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Deposit History</p>
          {history.map((t) => (
            <div key={t._id} className="flex items-center justify-between rounded-2xl p-4 border border-white/10 mb-2"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <div>
                <p className="text-white font-semibold text-sm">KES {Number(t.amount).toLocaleString()}</p>
                <p className="text-gray-500 text-xs">{t.meta?.mpesaPhone} · {new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${
                t.status === "completed" ? "text-green-400 bg-green-500/10 border-green-500/20"
                : t.status === "failed"  ? "text-red-400 bg-red-500/10 border-red-500/20"
                : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"}`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Deposit;
