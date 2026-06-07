import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { socket } from "../utils/socket";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages]       = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    API.get("/chat/messages")
      .then((res) => setMessages(Array.isArray(res.data) ? res.data : []))
      .catch((err) => { console.error("Chat load failed:", err.message); setMessages([]); })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!user) return;
    socket.connect();
    socket.emit("join_room");

    const onMessage = (msg) => {
      setMessages((prev) => {
        if (msg?._id && prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const onTyping = ({ userName }) => {
      if (!userName) return;
      setTypingUsers((prev) => prev.includes(userName) ? prev : [...prev, userName]);
      setTimeout(() => setTypingUsers((prev) => prev.filter((u) => u !== userName)), 3000);
    };

    socket.on("receive_message", onMessage);
    socket.on("typing", onTyping);

    return () => {
      socket.off("receive_message", onMessage);
      socket.off("typing", onTyping);
      socket.disconnect();
    };
  }, [user]);

  const sendMessage = (content) => {
    if (!content.trim() || !user) return;
    const optimistic = {
      _id: `tmp-${Date.now()}`,
      content,
      sender: { _id: user._id, fullName: user.fullName },
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    socket.emit("send_message", { content, senderId: user._id });
  };

  const sendTyping = () => {
    if (user?.fullName) socket.emit("typing", { userName: user.fullName });
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, sendTyping, typingUsers, loading }}>
      {children}
    </ChatContext.Provider>
  );
};
