import React, { useEffect, useState } from "react";
import { getWallet, withdrawAmount } from "../api/walletApi";
import "../Styles/Earn.css";

const Wallet = () => {
  const [wallet, setWallet] = useState({
    balance: 0,
    earnedToday: 0,
    withdrawals: [],
  });

  const [withdrawValue, setWithdrawValue] = useState("");
  const [message, setMessage] = useState("");

  // Fetch wallet on mount
  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const data = await getWallet();
      setWallet(data);
    } catch (err) {
      console.error("Error fetching wallet:", err);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawValue || Number(withdrawValue) <= 0) {
      setMessage("Enter a valid amount to withdraw.");
      return;
    }

    try {
      const res = await withdrawAmount(withdrawValue);
      setMessage(res.message);
      setWithdrawValue("");
      fetchWallet(); // refresh wallet after withdrawal
    } catch (err) {
      setMessage(err.response?.data?.message || "Withdrawal failed.");
    }
  };

  return (
    <div className="wallet-container">
      <h1>My Wallet</h1>

      {/* Wallet summary */}
      <div className="wallet-summary">
        <div className="wallet-box">
          <h3>Total Balance</h3>
          <p>${wallet.balance.toFixed(2)}</p>
        </div>
        <div className="wallet-box">
          <h3>Earned Today</h3>
          <p>${wallet.earnedToday.toFixed(2)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="wallet-actions">
        <input
          type="number"
          placeholder="Amount to withdraw"
          value={withdrawValue}
          onChange={(e) => setWithdrawValue(e.target.value)}
        />
        <button onClick={handleWithdraw}>Withdraw</button>
        <button onClick={() => setMessage("Deposit feature coming soon!")}>Deposit</button>
      </div>

      {/* Messages */}
      {message && <p className="wallet-message">{message}</p>}

      {/* Withdrawal history */}
      <h2>Withdrawal History</h2>
      <table className="wallet-history">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount (USD)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {wallet.withdrawals.length > 0 ? (
            wallet.withdrawals.map((w, idx) => (
              <tr key={idx}>
                <td>{new Date(w.date).toLocaleString()}</td>
                <td>${w.amount.toFixed(2)}</td>
                <td
                  className={`status ${
                    w.status === "Approved"
                      ? "approved"
                      : w.status === "Rejected"
                      ? "rejected"
                      : "pending"
                  }`}
                >
                  {w.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No withdrawals yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Wallet;