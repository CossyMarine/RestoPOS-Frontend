import React, { useState, useContext, useEffect, useRef } from "react";
import { ChatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";

export default function ChatWindow() {
  const { messages, sendMessage, sendTyping, typingUsers } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage.trim());
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-orange-500 text-white p-4 flex items-center justify-between shadow-md">
        <h2 className="text-lg font-semibold">Main Chat</h2>
        <span className="text-xs bg-orange-600 px-2 py-1 rounded-lg">Online</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.sender._id === user._id;
          const initials = msg.sender?.fullName?.charAt(0).toUpperCase() || "?";

          return (
            <div key={msg._id} className={`flex items-end ${isMine ? "justify-end" : "justify-start"}`}>
              {!isMine && (
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white mr-2">
                  {initials}
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-md break-words ${
                  isMine
                    ? "bg-orange-500 text-white ml-auto rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                {!isMine && <p className="text-xs font-medium text-gray-700 mb-1">{msg.sender.fullName}</p>}
                <p>{msg.content}</p>
                <span className="text-[10px] text-gray-400 block mt-1 text-right">
                  {msg.createdAt &&
                    new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}

        {typingUsers.length > 0 && (
          <p className="text-sm text-gray-500 italic">{typingUsers.join(", ")} typing...</p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white p-3 flex gap-2 border-t shadow-inner">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            } else {
              sendTyping();
            }
          }}
          className="flex-1 border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          onClick={handleSend}
          className="bg-orange-500 text-white px-5 py-3 rounded-full hover:bg-orange-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}