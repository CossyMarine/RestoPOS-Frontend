// src/Pages/ChatPage.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";

const ChatPage = () => {
  const { messages, sendMessage, typing } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Bar */}
      <nav className="w-full h-[60px] bg-orange-400 flex items-center justify-between px-4 sticky top-0 z-50 shadow">
        <h2 className="font-bold text-white text-lg">MarineCash Chatroom</h2>
        <i className="fas fa-users text-white text-xl"></i>
      </nav>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-[80px]">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">No messages yet. Say hello! 👋</p>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
          const name = msg.sender?.fullName || "Unknown";
          const avatar = `https://ui-avatars.com/api/?name=${name}&background=${isMe ? "f97316" : "6366f1"}&color=fff`;

          return isMe ? (
            <div key={i} className="flex justify-end items-end gap-2">
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 font-semibold mb-1">You</span>
                <div className="bg-green-500 text-white rounded-2xl rounded-br-none px-4 py-2.5 max-w-[75vw] text-sm shadow">
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-400 mt-1">{formatTime(msg.createdAt)}</span>
              </div>
              <img src={avatar} alt="you" className="w-9 h-9 rounded-full mb-4" />
            </div>
          ) : (
            <div key={i} className="flex items-end gap-2">
              <img src={avatar} alt={name} className="w-9 h-9 rounded-full mb-4" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-semibold mb-1">{name}</span>
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-2.5 max-w-[75vw] text-sm shadow">
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-400 mt-1">{formatTime(msg.createdAt)}</span>
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-2xl px-4 py-2 text-xs text-gray-400 shadow animate-pulse">
              Someone is typing...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <nav className="fixed bottom-0 w-full bg-white border-t flex items-center gap-2 p-2 z-50">
        <label className="bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full w-11 h-11 flex items-center justify-center transition shrink-0">
          <input type="file" className="hidden" accept="image/*,video/*,audio/*" />
          <i className="fas fa-paperclip text-gray-500"></i>
        </label>
        <input
          type="text" value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message..."
          className="flex-1 border-2 border-orange-400 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
        />
        <button
          onClick={handleSend}
          className="bg-orange-500 hover:bg-orange-600 active:scale-95 transition rounded-full w-11 h-11 flex items-center justify-center shrink-0"
        >
          <i className="fas fa-paper-plane text-white"></i>
        </button>
      </nav>
    </div>
  );
};

export default ChatPage;
