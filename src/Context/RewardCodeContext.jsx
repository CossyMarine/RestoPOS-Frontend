import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { redeemCode, getMyCodes } from "../api/rewardApi";

export const RewardCodeContext = createContext();

export const RewardCodeProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    if (token) {
      getMyCodes(token).then(setCodes).catch(console.error);
    }
  }, [token]);

  const handleRedeem = async (code) => {
    const res = await redeemCode(code, token);
    setCodes((prev) => [...prev, res.redeemedCode]);
    return res;
  };

  return (
    <RewardCodeContext.Provider value={{ codes, handleRedeem }}>
      {children}
    </RewardCodeContext.Provider>
  );
};