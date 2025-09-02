// src/api/referralApi.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/referral";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach token automatically with interceptor
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// ✅ Get current user's referral info
export const getReferralApi = async () => {
  try {
    const response = await apiClient.get("/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching referral info:", error?.response?.data || error.message);
    throw error;
  }
};

// ✅ Get members referred by current user
export const getReferralMembersApi = async () => {
  try {
    const response = await apiClient.get("/members");
    return response.data;
  } catch (error) {
    console.error("Error fetching referral members:", error?.response?.data || error.message);
    throw error;
  }
};

// ✅ Redeem a referral reward
export const redeemReferralRewardApi = async (referralId) => {
  try {
    const response = await apiClient.post("/redeem", { referralId });
    return response.data;
  } catch (error) {
    console.error("Error redeeming referral reward:", error?.response?.data || error.message);
    throw error;
  }
};