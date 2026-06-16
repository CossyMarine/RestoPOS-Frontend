import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";

const Deposit = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ mpesaPhone: "", amount: "" });
  const [step, setStep] = useState("form"); // form | success
  const [error, setError] = useState("");

  const saveDeposit = () => {
    if (!form.mpesaPhone || !form.amount) return setError("Please fill all fields");
    if (Number(form.amount) < 50) return setError("Minimum deposit is KES 50");

    const deposits = JSON.parse(localStorage.getItem("mp_deposits") || "[]");
    const entry = {
      id: Date.now(),
      userId: user?.id,
      userName: user?.name,
      userPhone: user?.phone,
      mpesaPhone: form.mpesaPhone,
      amount: form.amount,
      date: new Date().toISOString(),
      status: "pending",
    };
    localStorage.setItem("mp_deposits", JSON.stringify([...deposits, entry]));
    setStep("success");
  };

  if (step === "success") return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-5">
        <i className="fas fa-check text-green-400 text-3xl"></i>
      </div>
      <h2 className="text-xl font-extrabold text-white mb-2">Request Submitted!</h2>
      <p className="text-gray-400 text-sm mb-1">We received your deposit request.</p>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-4 text-left w-full max-w-xs">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">M-Pesa Phone</span>
          <span className="text-white font-semibold">{form.mpesaPhone}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Amount</span>
          <span className="text-cyan-400 font-extrabold">KES {Number(form.amount).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Status</span>
          <span className="text-yellow-400 font-semibold">Pending</span>
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-4 max-w-xs">Admin will verify and approve your deposit shortly.</p>
      <button onClick={() => { setStep("form"); setForm({ mpesaPhone: "", amount: "" }); }}
        className="mt-6 text-cyan-400 text-sm font-semibold hover:underline">
        Make another deposit
      </button>
    </div>
  );

  return (
    <div className="py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
      <h2 className="text-xl font-extrabold text-white mb-1">Deposit via M-Pesa</h2>
      <p className="text-gray-500 text-xs mb-5">Enter your M-Pesa number and amount to top up your wallet.</p>

      {/* INSTRUCTIONS */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-5">
        <p className="text-green-400 font-bold text-sm mb-2"><i className="fas fa-mobile-screen-button mr-2"></i>How to Pay</p>
        <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
          <li>Go to M-Pesa on your Safaricom line</li>
          <li>Send money to <span className="text-white font-bold">0712 345 678</span> (Marine Ads)</li>
          <li>Enter the same phone number and amount below</li>
          <li>We'll verify and credit your wallet</li>
        </ol>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-4">{error}</div>}

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-400">M-Pesa Phone Number</label>
          <input
            type="tel" placeholder="07XXXXXXXX"
            value={form.mpesaPhone} onChange={(e) => setForm({ ...form, mpesaPhone: e.target.value })}
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white rounded-xl px-4 py-3 text-sm mt-1 outline-none transition placeholder-gray-600"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400">Amount (KES)</label>
          <input
            type="number" placeholder="e.g. 500"
            value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white rounded-xl px-4 py-3 text-sm mt-1 outline-none transition placeholder-gray-600"
          />
        </div>

        {/* QUICK AMOUNTS */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Quick amounts</p>
          <div className="flex gap-2 flex-wrap">
            {[100, 500, 1000, 2500, 5000].map((a) => (
              <button key={a} onClick={() => setForm({ ...form, amount: String(a) })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${form.amount === String(a) ? "bg-cyan-500 text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:border-cyan-500/50"}`}>
                {a.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <button onClick={saveDeposit}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition text-white font-bold rounded-xl py-3 text-sm mt-2">
          <i className="fas fa-paper-plane mr-2"></i>Submit Deposit Request
        </button>
      </div>
    </div>
  );
};

export default Deposit;
