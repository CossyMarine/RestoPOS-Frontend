import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { redeemCode } from "../api/rewardApi";

const RewardCode = () => {
  const { token } = useContext(AuthContext);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code) {
      setMessage("⚠ Please enter a reward code.");
      return;
    }

    setLoading(true);
    try {
      const res = await redeemCode(code, token);
      setMessage(`${res.data.message}`);
      setCode(""); // clear input after success
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "❌ Failed to redeem code.";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-3">Redeem Reward Code</h2>
      <form onSubmit={handleRedeem} className="flex flex-col gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter reward code"
          className="border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Redeeming..." : "Redeem"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-sm ${
            message.startsWith("✅")
              ? "text-green-600"
              : message.startsWith("⚠")
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default RewardCode;