// src/Pages/Reward.jsx
import React, { useState, useContext } from "react";
import { RewardCodeContext } from "../Context/RewardCodeContext";
import { WalletContext } from "../Context/WalletContext";
import TopBar from "../Components/TopBar";
import BottomNav from "../Components/BottomNav";

const Reward = () => {
  const { redeemCode } = useContext(RewardCodeContext);
  const walletCtx = useContext(WalletContext);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState({ text: "", success: false });
  const [loading, setLoading] = useState(false);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await redeemCode(code.trim().toUpperCase());
      setMsg({
        text: `🎉 You earned $${Number(res.amount).toFixed(3)}! New balance: $${Number(res.newBalance).toFixed(3)}`,
        success: true,
      });
      setCode("");
      // Refresh wallet if context exposes a refresh fn
      if (walletCtx?.fetchWallet) walletCtx.fetchWallet();
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || "❌ Invalid or expired code.",
        success: false,
      });
    }
    setLoading(false);
    setTimeout(() => setMsg({ text: "", success: false }), 6000);
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      <TopBar />

      <div className="mx-3 mt-6">
        {/* Header */}
        <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center text-center mb-4">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
            <i className="fas fa-gift text-orange-500 text-3xl"></i>
          </div>
          <h1 className="text-xl font-extrabold text-gray-800">Redeem Code</h1>
          <p className="text-gray-400 text-sm mt-1">
            Enter a reward code to add money to your wallet instantly
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-2xl p-5">
          <form onSubmit={handleRedeem} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Reward Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. AX57TYP"
                maxLength={12}
                className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-3 text-sm mt-1 outline-none tracking-widest font-bold text-gray-700 transition"
              />
            </div>

            {msg.text && (
              <div
                className={`text-sm font-semibold text-center p-3 rounded-xl border ${
                  msg.success
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                {msg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 active:scale-95 text-white font-bold py-3 rounded-xl text-sm transition-all"
            >
              {loading ? "Redeeming..." : "Redeem Code"}
            </button>
          </form>
        </div>

        {/* Tips */}
        <div className="bg-white shadow rounded-2xl p-4 mt-4">
          <p className="font-semibold text-gray-700 mb-3">💡 Tips</p>
          <ul className="space-y-2 text-sm text-gray-500">
            {[
              "Codes are case-insensitive — enter in any case",
              "Each code can only be redeemed once per account",
              "Random codes give different amounts to each user",
              "Codes may have an expiry date — redeem fast!",
              "Check announcements for new reward codes",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <i className="fas fa-check-circle text-green-500 mt-0.5 shrink-0"></i>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Reward;
