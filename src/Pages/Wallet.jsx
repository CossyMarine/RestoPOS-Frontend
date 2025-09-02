// src/pages/Wallet.jsx
import React, { useState, useContext } from "react";
import { WalletContext } from "../Context/WalletContext";
import BottomNav from "../Components/BottomNav";
import "../Styles/Wallet.css";

const Wallet = () => {
  const { wallet, withdraw, loading } = useContext(WalletContext);
  const [withdrawValue, setWithdrawValue] = useState("");
  const [message, setMessage] = useState("");

  const handleWithdraw = async () => {
    const amount = Number(withdrawValue);

    if (!amount || amount <= 0) {
      setMessage("Enter a valid amount to withdraw.");
      return;
    }

    if (amount > wallet.balance) {
      setMessage("Insufficient balance.");
      return;
    }

    try {
      const res = await withdraw(amount);
      setMessage(res.message || "Withdraw successful!");
      setWithdrawValue("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to withdraw.");
    }
  };

  if (loading) return <p>Loading wallet...</p>;

  return (
    <div className="wallet-container">
      <h1>My Wallet</h1>

      <div className="wallet-summary">
        <div className="wallet-box">
          <h3>Total Balance</h3>
          <p>${Number(wallet?.balance || 0).toFixed(2)}</p>
        </div>
        <div className="wallet-box">
          <h3>Earned Today</h3>
          <p>${Number(wallet?.earnedToday || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="wallet-actions">
        <input
          type="number"
          placeholder="Enter amount to withdraw"
          value={withdrawValue}
          onChange={(e) => setWithdrawValue(e.target.value)}
        />
        <button onClick={handleWithdraw}>Withdraw</button>
        <button onClick={() => setMessage("Deposit feature coming soon!")}>
          Deposit
        </button>
      </div>

      {message && <p className="wallet-message">{message}</p>}

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
          {wallet?.withdrawalHistory?.length > 0 ? (
            wallet.withdrawalHistory.map((w, idx) => (
              <tr key={idx}>
                <td>{w.date ? new Date(w.date).toLocaleString() : "N/A"}</td>
                <td>${Number(w?.amount || 0).toFixed(2)}</td>
                <td className={`status ${w.status?.toLowerCase() || "pending"}`}>
                  {w.status || "Pending"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No withdrawal history yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      <BottomNav />
    </div>
  );
};

export default Wallet;