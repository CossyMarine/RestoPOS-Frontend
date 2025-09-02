// src/Pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [status, setStatus] = useState("loading"); // loading | success | error | info
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get email saved after registration
  const userEmail = localStorage.getItem("pendingEmail");

  useEffect(() => {
    const verifyMessage = localStorage.getItem("verifyMessage");

    const query = new URLSearchParams(location.search);
    const statusParam = query.get("status");
    const msgParam = query.get("msg");
    const token = query.get("token");
    const id = query.get("id");

    // 1️⃣ After register, show "check inbox"
    if (verifyMessage && !statusParam && !token && !id) {
      setStatus("info");
      setMessage(verifyMessage);
      return;
    }

    // 2️⃣ Coming back from backend redirect (with ?status=...&msg=...)
    if (statusParam) {
      if (statusParam === "success") {
        setStatus("success");
        setMessage("✅ Email verified successfully! You can now log in.");
        localStorage.removeItem("verifyMessage");
        localStorage.removeItem("pendingEmail");
      } else {
        setStatus("error");
        setMessage(`⚠ ${msgParam || "Verification failed."}`);
      }
      return;
    }

    // 3️⃣ Direct visit / empty state
    if (!verifyMessage && !statusParam && !token && !id) {
      setStatus("info");
      setMessage(
        "📧 Please check your email for a verification link. Don’t forget to check your spam folder."
      );
    }
  }, [location.search]);

  // Resend verification email
  const handleResend = async () => {
    if (!userEmail) return alert("❌ No email found to resend verification.");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/resend-verification`,
        { email: userEmail }
      );
      alert("📧 A new verification email has been sent.");
    } catch (err) {
      console.error("Resend error:", err);
      alert("❌ Failed to resend email. Try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center w-[400px]">
        {status === "loading" && (
          <p className="text-blue-600 font-semibold">Loading...</p>
        )}

        {status === "success" && (
          <>
            <h2 className="text-green-600 font-bold text-lg">{message}</h2>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-red-600 font-bold text-lg">{message}</h2>
            {userEmail && (
              <button
                onClick={handleResend}
                className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                Resend Verification Email
              </button>
            )}
          </>
        )}

        {status === "info" && (
          <>
            <h2 className="text-blue-600 font-bold text-lg">{message}</h2>
            {userEmail && (
              <button
                onClick={handleResend}
                className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                Resend Verification Email
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;