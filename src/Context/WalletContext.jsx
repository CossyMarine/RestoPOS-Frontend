import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axios";
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
  const [error, setError]     = useState(null);

  const updateWallet = (updates) =>
    setWallet((prev) => ({ ...prev, ...updates }));

  useEffect(() => {
    if (!user || !token) return;

    const fetchWallet = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/wallet");
        setWallet(res.data);
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

  const withdraw = async (amount) => {
    try {
      const res = await API.post("/wallet/withdraw", { amount });
      updateWallet({
        balance: res.data.balance,
        totalWithdrawn: res.data.totalWithdrawn,
        withdrawalHistory: res.data.withdrawalHistory,
      });
      return res.data;
    } catch (err) {
      console.error("Withdraw failed:", err);
      throw err;
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, setWallet, updateWallet, withdraw, loading, error }}>
      {children}
    </WalletContext.Provider>
  );
};
