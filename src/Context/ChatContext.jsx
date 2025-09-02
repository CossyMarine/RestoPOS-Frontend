import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../utils/socket";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load history
  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/chat/messages`,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching messages:", err.message);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [token]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      setMessages((prev) => {
        if (msg?._id && prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const handleTyping = ({ userName }) => {
      if (!userName) return;
      setTypingUsers((prev) => (prev.includes(userName) ? prev : [...prev, userName]));
      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u !== userName));
      }, 3000);
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("typing", handleTyping);
    };
  }, [user]);

  // Send message
  const sendMessage = (content) => {
    if (!content.trim()) return;
    const msg = {
      _id: `tmp-${Date.now()}`,
      content,
      sender: { _id: user._id, fullName: user.fullName },
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    socket.emit("sendMessage", msg);
  };

  const sendTyping = () => {
    if (user?.fullName) {
      socket.emit("typing", { userName: user.fullName });
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading chat…</div>;

  return (
    <ChatContext.Provider value={{ messages, sendMessage, sendTyping, typingUsers }}>
      {children}
    </ChatContext.Provider>
  );
};