// src/api/walletApi.js
import axiosApi from "./axiosApi";

// ✅ Get wallet details
export const getWallet = async () => {
  const res = await axiosApi.get("/wallet");
  return res.data;
};

// ✅ Withdraw funds
export const withdrawAmount = async (amount) => {
  const res = await axiosApi.post("/wallet/withdraw", { amount });
  return res.data;
};

// ✅ Deposit funds
export const depositAmount = async (amount) => {
  const res = await axiosApi.post("/wallet/deposit", { amount });
  return res.data;
};