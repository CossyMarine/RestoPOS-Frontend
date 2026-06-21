import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../Context/AuthContext";

const METHODS = [
  { id: "mpesa", label: "M-Pesa", icon: "fa-mobile-screen-button" },
  { id: "visa",  label: "Visa/Card", icon: "fa-credit-card" },
  { id: "bank",  label: "Bank Transfer", icon: "fa-landmark" },
];

const QUICK_AMOUNTS = [10, 25, 50, 100, 250];

const Deposit = () => {
  const { user } = useAuth();
  const [method, setMethod] = useState("mpesa");
  const [form, setForm] = useState({
    amount: "",
    mpesaPhone: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    swiftCode: "",
  });
  const [step, setStep]   = useState("form");
  const [txn, setTxn]     = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    API.get("/wallet/transactions").then(r => setHistory(r.data.filter(t => t.type === "deposit"))).catch(() => {});
  }, [step]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    if (!form.amount) return "Enter an amount.";
    if (Number(form.amount) < 5) return "Minimum deposit is $5.";

    if (method === "mpesa" && !form.mpesaPhone) return "Enter the M-Pesa phone number used.";

    if (method === "visa") {
      if (!form.cardNumber || form.cardNumber.replace(/\s/g, "").length < 12) return "Enter a valid card number.";
      if (!form.cardExpiry) return "Enter the card expiry date.";
      if (!form.cardCvv || form.cardCvv.length < 3) return "Enter a valid CVV.";
      if (!form.cardName) return "Enter the name on the card.";
    }

    if (method === "bank") {
      if (!form.accountName) return "Enter the account holder name.";
      if (!form.accountNumber) return "Enter the account number used for the transfer.";
    }

    return "";
  };

  const submit = async () => {
    const v = validate();
    if (v) return setError(v);
    setLoading(true); setError("");

    const payload = { amount: Number(form.amount), method };
    if (method === "mpesa") payload.mpesaPhone = form.mpesaPhone;
    if (method === "visa") payload.card = { number: form.cardNumber, expiry: form.cardExpiry, cvv: form.cardCvv, name: form.cardName };
    if (method === "bank") payload.bank = { name: form.bankName, accountName: form.accountName, accountNumber: form.accountNumber, swiftCode: form.swiftCode };

    try {
      const res = await API.post("/wallet/deposit", payload);
      setTxn({ ...res.data.transaction, method, form });
      setStep("success");
    } catch (e) {
      setError(e.response?.data?.message || "Failed. Try again.");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setStep("form");
    setForm({ amount: "", mpesaPhone: "", cardNumber: "", cardExpiry: "", cardCvv: "", cardName: "", bankName: "", accountName: "", accountNumber: "", swiftCode: "" });
  };

  if (step === "success") {
    const rows =
      method === "mpesa" ? [["M-Pesa Phone", txn?.form?.mpesaPhone]] :
      method === "visa"  ? [["Card", `•••• ${txn?.form?.cardNumber?.slice(-4)}`]] :
      [["Account", txn?.form?.accountNumber], ["Reference", txn?.form?.bankName || "—"]];

    return (
      <div className="flex flex-col items-center text-center py-8" style={{ fontFamily: "Poppins,sans-serif" }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 border border-green-500/30"
          style={{ background: "rgba(34,197,94,0.1)" }}>
          <i className="fas fa-check text-green-400 text-3xl"></i>
        </div>
        <h2 className="text-xl font-extrabold text-white mb-1">Request Sent!</h2>
        <p className="text-gray-400 text-sm mb-5">Admin will verify and credit your wallet.</p>
        <div className="rounded-2xl p-5 border border-white/10 w-full max-w-xs text-left space-y-3"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          {[...rows, ["Amount", `$${Number(txn?.amount).toLocaleString()}`], ["Status", "Pending"]].map(([l, v]) => (
            <div key={l} className="flex justify-between text-sm">
              <span className="text-gray-500">{l}</span>
              <span className={`font-semibold ${l === "Status" ? "text-yellow-400" : l === "Amount" ? "text-cyan-400" : "text-white"}`}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={resetForm} className="mt-6 text-sm font-semibold" style={{ color: "#22d3ee" }}>
          + Another deposit
        </button>
      </div>
    );
  }

  return (
    <div className="py-1 space-y-5" style={{ fontFamily: "Poppins,sans-serif" }}>
      <div>
        <h2 className="text-xl font-extrabold text-white">Deposit Funds</h2>
        <p className="text-gray-500 text-xs mt-0.5">Top up your MarineAds wallet (USD)</p>
      </div>

      {/* METHOD TABS */}
      <div className="grid grid-cols-3 gap-2">
        {METHODS.map((m) => (
          <button key={m.id} onClick={() => { setMethod(m.id); setError(""); }}
            className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold border transition"
            style={{
              background: method === m.id ? "linear-gradient(135deg,#06b6d4,#3b82f6)" : "rgba(255,255,255,0.05)",
              borderColor: method === m.id ? "transparent" : "rgba(255,255,255,0.1)",
              color: method === m.id ? "#fff" : "#9ca3af",
            }}>
            <i className={`fas ${m.icon} text-base`}></i>
            {m.label}
          </button>
        ))}
      </div>

      {/* METHOD-SPECIFIC INSTRUCTIONS */}
      {method === "mpesa" && (
        <div className="rounded-2xl p-4 border border-green-500/20" style={{ background: "rgba(34,197,94,0.06)" }}>
          <p className="text-green-400 font-bold text-sm mb-2"><i className="fas fa-mobile-screen-button mr-2"></i>Payment Steps</p>
          <ol className="text-xs text-gray-400 space-y-1.5 list-decimal list-inside">
            <li>Open M-Pesa on your Safaricom line</li>
            <li>Send money to <span className="text-white font-bold">0712 345 678</span> (MarineAds)</li>
            <li>Enter that same phone number + amount below</li>
            <li>We verify and credit your wallet (usually &lt; 1hr)</li>
          </ol>
        </div>
      )}

      {method === "bank" && (
        <div className="rounded-2xl p-4 border border-blue-500/20" style={{ background: "rgba(59,130,246,0.06)" }}>
          <p className="text-blue-400 font-bold text-sm mb-2"><i className="fas fa-landmark mr-2"></i>Transfer To</p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>Bank: <span className="text-white font-semibold">First National Bank</span></p>
            <p>Account Name: <span className="text-white font-semibold">MarineAds Ltd</span></p>
            <p>Account Number: <span className="text-white font-semibold">0123456789</span></p>
            <p>SWIFT: <span className="text-white font-semibold">FNBKUS33</span></p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl p-3 text-sm text-red-400 border border-red-500/30"
          style={{ background: "rgba(239,68,68,0.08)" }}>{error}</div>
      )}

      <div className="space-y-4">

        {/* AMOUNT (always shown) */}
        <div>
          <label className="text-xs font-semibold text-gray-400">Amount (USD)</label>
          <input type="number" placeholder="e.g. 50"
            value={form.amount} onChange={update("amount")}
            className="w-full mt-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((a) => (
            <button key={a} onClick={() => setForm({ ...form, amount: String(a) })}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition border"
              style={{
                background: form.amount === String(a) ? "linear-gradient(135deg,#06b6d4,#3b82f6)" : "rgba(255,255,255,0.05)",
                borderColor: form.amount === String(a) ? "transparent" : "rgba(255,255,255,0.1)",
                color: form.amount === String(a) ? "#fff" : "#9ca3af",
              }}>
              ${a.toLocaleString()}
            </button>
          ))}
        </div>

        {/* MPESA FIELDS */}
        {method === "mpesa" && (
          <div>
            <label className="text-xs font-semibold text-gray-400">M-Pesa Phone Used</label>
            <input type="tel" placeholder="07XXXXXXXX"
              value={form.mpesaPhone} onChange={update("mpesaPhone")}
              className="w-full mt-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
          </div>
        )}

        {/* VISA FIELDS */}
        {method === "visa" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400">Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                value={form.cardNumber} onChange={update("cardNumber")}
                className="w-full mt-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400">Expiry (MM/YY)</label>
                <input type="text" placeholder="MM/YY" maxLength={5}
                  value={form.cardExpiry} onChange={update("cardExpiry")}
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400">CVV</label>
                <input type="password" placeholder="•••" maxLength={4}
                  value={form.cardCvv} onChange={update("cardCvv")}
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400">Name on Card</label>
              <input type="text" placeholder="Jane Doe"
                value={form.cardName} onChange={update("cardName")}
                className="w-full mt-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>
          </div>
        )}

        {/* BANK FIELDS */}
        {method === "bank" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400">Your Account Holder Name</label>
              <input type="text" placeholder="Jane Doe"
                value={form.accountName} onChange={update("accountName")}
                className="w-full mt-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400">Your Account Number</label>
                <input type="text" placeholder="000123456"
                  value={form.accountNumber} onChange={update("accountNumber")}
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400">Your Bank Name</label>
                <input type="text" placeholder="e.g. Chase"
                  value={form.bankName} onChange={update("bankName")}
                  className="w-full mt-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
              </div>
            </div>
          </div>
        )}

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
                <p className="text-white font-semibold text-sm">${Number(t.amount).toLocaleString()}</p>
                <p className="text-gray-500 text-xs">{t.meta?.mpesaPhone || t.method || "—"} · {new Date(t.createdAt).toLocaleDateString()}</p>
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
