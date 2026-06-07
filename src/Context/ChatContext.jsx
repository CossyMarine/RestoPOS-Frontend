import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import { socket } from "../utils/socket";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages]       = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isClosed, setIsClosed]       = useState(false);
  const [loading, setLoading]         = useState(true);
  const [banInfo, setBanInfo]         = useState(null);

  // ── Load history ─────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    API.get("/chat/messages")
      .then((res) => {
        setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);
        setIsClosed(res.data.isClosed || false);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [token]);

  // ── Socket connection ─────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    try {
      socket.connect();
      socket.emit("join_room", { userId: user._id, role: user.role });
    } catch (err) {
      console.error("Socket connect error:", err);
      return;
    }

    const onMessage = (msg) => {
      setMessages((prev) => {
        if (msg?._id && prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const onReactionUpdated = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    };

    const onMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    const onMessagesCleared = ({ days }) => {
      if (days === 0) {
        setMessages([]);
      } else {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        setMessages((prev) => prev.filter((m) => new Date(m.createdAt) >= cutoff));
      }
    };

    const onRoomStatusChanged = ({ isClosed: closed }) => {
      setIsClosed(closed);
    };

    const onUserBanned = ({ userId, expiresAt }) => {
      if (user._id === userId) setBanInfo({ expiresAt });
    };

    const onTyping = ({ userName }) => {
      if (!userName) return;
      setTypingUsers((prev) => (prev.includes(userName) ? prev : [...prev, userName]));
      setTimeout(() => setTypingUsers((prev) => prev.filter((u) => u !== userName)), 3000);
    };

    socket.on("receive_message",          onMessage);
    socket.on("message_reaction_updated", onReactionUpdated);
    socket.on("message_deleted",          onMessageDeleted);
    socket.on("messages_cleared",         onMessagesCleared);
    socket.on("room_status_changed",      onRoomStatusChanged);
    socket.on("user_banned",              onUserBanned);
    socket.on("typing",                   onTyping);

    return () => {
      socket.off("receive_message",          onMessage);
      socket.off("message_reaction_updated", onReactionUpdated);
      socket.off("message_deleted",          onMessageDeleted);
      socket.off("messages_cleared",         onMessagesCleared);
      socket.off("room_status_changed",      onRoomStatusChanged);
      socket.off("user_banned",              onUserBanned);
      socket.off("typing",                   onTyping);
      socket.disconnect();
    };
  }, [user]);

  // ── Send text (with optional replyToId) ──────────────────────────
  const sendMessage = useCallback(async (content, replyToId = null) => {
    if (!content.trim() || !user) return null;
    try {
      const res = await API.post("/chat/message", { content, replyToId });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send message.";
      throw new Error(msg);
    }
  }, [user]);

  // ── Send image (with optional replyToId) ─────────────────────────
  const sendImage = useCallback(async (file, replyToId = null) => {
    if (!file || !user) return null;
    const fd = new FormData();
    fd.append("image", file);
    if (replyToId) fd.append("replyToId", replyToId);
    try {
      const res = await API.post("/chat/message/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || "Failed to send image.");
    }
  }, [user]);

  // ── React ─────────────────────────────────────────────────────────
  const reactToMessage = useCallback(async (messageId, emoji) => {
    try {
      await API.post(`/chat/message/${messageId}/react`, { emoji });
    } catch {}
  }, []);

  // ── Delete (admin) ────────────────────────────────────────────────
  const deleteMessage = useCallback(async (messageId) => {
    try {
      await API.delete(`/chat/message/${messageId}`);
    } catch {}
  }, []);

  // ── Typing indicator ──────────────────────────────────────────────
  const sendTyping = useCallback(() => {
    if (user?.fullName) socket.emit("typing", { userName: user.fullName });
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        typingUsers,
        isClosed,
        loading,
        banInfo,
        sendMessage,
        sendImage,
        reactToMessage,
        deleteMessage,
        sendTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
