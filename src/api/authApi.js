// src/api/authApi.js
import axiosInstance from "./axiosApi";

// ✅ Register User with auto-created wallet
export const registerUser = async (formData) => {
  const res = await axiosInstance.post("/auth/register", formData);
  return res.data; // { user, token, wallet }
};

// ✅ Login User and return wallet too
export const loginUser = async (formData) => {
  const res = await axiosInstance.post("/auth/login", formData);
  return res.data; // { user, token, wallet }
};

// ✅ Get Profile (with wallet)
export const getProfile = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data; // { user, wallet }
};