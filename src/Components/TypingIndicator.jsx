import React from "react";

const TypingIndicator = ({ typingUsers }) => {
  if (!typingUsers.length) return null;
  return <div className="typing-indicator">{typingUsers.join(", ")} typing...</div>;
};

export default TypingIndicator;