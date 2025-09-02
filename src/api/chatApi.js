// src/api/chatApi.js
import API from "./axiosApi";

// ✅ Create a room
export const createRoomApi = async (data, token) => {
  const res = await API.post("/chat/room", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Send a message
export const sendMessageApi = async (data, token) => {
  const res = await API.post("/chat/message", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Get messages in a room
export const getMessagesApi = async (roomId, token) => {
  const res = await API.get(`/chat/messages/${roomId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Get members of a room
export const getRoomMembersApi = async (roomId, token) => {
  const res = await API.get(`/chat/room/${roomId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ React to a message with emoji
export const reactMessageApi = async (messageId, emoji, token) => {
  const res = await API.post(
    `/chat/message/${messageId}/react`,
    { emoji },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};