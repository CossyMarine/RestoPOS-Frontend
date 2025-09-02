// src/api/rewardApi.js
import API from "./axiosApi";

// ✅ Redeem a reward code
export const redeemCode = async (code, token) => {
  const res = await API.post(
    "/reward-codes/redeem",
    { code },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ✅ Get redeemed codes for logged-in user
export const getMyCodes = async (token) => {
  const res = await API.get("/reward-codes/my-codes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Admin: get all reward codes
export const getAllCodes = async (token) => {
  const res = await API.get("/reward-codes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Admin: create a new reward code
export const createRewardCode = async (data, token) => {
  const res = await API.post("/reward-codes", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ✅ Admin: deactivate a reward code
export const deactivateRewardCode = async (id, token) => {
  const res = await API.patch(`/reward-codes/${id}/deactivate`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};