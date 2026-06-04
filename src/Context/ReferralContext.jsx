import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getReferralStats } from "../api/index";

export const ReferralContext = createContext();

export const ReferralProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getReferralStats();
      setStats(data);
    } catch (err) {
      console.error("Referral fetch failed:", err.message);
    }
    setLoading(false);
  };

  return (
    <ReferralContext.Provider value={{ stats, loading, fetchStats }}>
      {children}
    </ReferralContext.Provider>
  );
};
