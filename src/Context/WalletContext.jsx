// src/Context/WalletContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { getWallet, withdrawAmount } from "../api/index.js;  
import { AuthContext } from "./AuthContext";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);

  const [wallet, setWallet] = useState({
    balance: 0,
    earnedToday: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    withdrawalHistory: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateWallet = (updates) =>
    setWallet((prev) => ({ ...prev, ...updates }));

  // ✅ Fetch wallet
  useEffect(() => {
    if (!user || !token) return;

    const fetchWallet = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getWallet();   // ✅ matches walletApi.js
        setWallet(data);
      } catch (err) {
        console.error("Failed to fetch wallet:", err);
        setError(err.response?.data?.message || "Failed to fetch wallet");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
    const interval = setInterval(fetchWallet, 15000);
    return () => clearInterval(interval);
  }, [user, token]);

  // ✅ Withdraw
  const withdraw = async (amount) => {
    try {
      const data = await withdrawAmount(amount);   // ✅ matches walletApi.js
      updateWallet({
        balance: data.balance,
        totalWithdrawn: data.totalWithdrawn,
        withdrawalHistory: data.withdrawalHistory,
      });
      return data;
    } catch (err) {
      console.error("Withdraw failed:", err);
      throw err;
    }
  };

  return (
    <WalletContext.Provider
      value={{ wallet, setWallet, updateWallet, withdraw, loading, error }}
    >
      {children}
    </WalletContext.Provider>
  );
};
