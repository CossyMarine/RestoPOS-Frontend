import React, { createContext, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "./AuthContext";

export const RewardCodeContext = createContext();

export const RewardCodeProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const redeemCode = async (code) => {
    const res = await API.post("/rewardcode/redeem", { code });
    return res.data; // { message, amount, newBalance }
  };

  return (
    <RewardCodeContext.Provider value={{ redeemCode }}>
      {children}
    </RewardCodeContext.Provider>
  );
};
