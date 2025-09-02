// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Context providers
import { AuthProvider } from "./Context/AuthContext";
import { WalletProvider } from "./Context/WalletContext";
import { ReferralProvider } from "./Context/ReferralContext";
import { RewardCodeProvider } from "./Context/RewardCodeContext";
import { ChatProvider } from "./Context/ChatContext"; // ✅ Chat context

// Pages
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Wallet from "./Pages/Wallet";
import VerifyEmail from "./Pages/VerifyEmail";
import Referral from "./Pages/Referral";
import Reward from "./Pages/Reward";
import ChatPage from "./Pages/ChatPage"; // ✅ Chat page

// Components
import NavBar from "./Components/NavBar";

const App = () => {
  return (
    <AuthProvider>
      <WalletProvider>
        <ReferralProvider>
          <RewardCodeProvider>
            <ChatProvider> {/* ✅ Wrap chat context here */}
              <Router>
                <NavBar />

                <Routes>
                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to="/login" />} />

                  {/* Auth pages */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Verification */}
                  <Route path="/verify-email" element={<VerifyEmail />} />

                  {/* Protected pages */}
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/referral" element={<Referral />} />
                  <Route path="/reward" element={<Reward />} />
                  <Route path="/chat" element={<ChatPage />} /> {/* ✅ Chat route */}
                </Routes>
              </Router>
            </ChatProvider>
          </RewardCodeProvider>
        </ReferralProvider>
      </WalletProvider>
    </AuthProvider>
  );
};

export default App;