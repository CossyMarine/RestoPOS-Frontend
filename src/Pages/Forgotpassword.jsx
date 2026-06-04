import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import logo from "../Assets/logo.png";

const ForgotPassword = () => {
  const [email, setEmail]     = useState("");
  const [msg, setMsg]         = useState({ text: "", success: true });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setSent(true);
      setMsg({ text: "✅ Reset link sent! Check your email.", success: true });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "❌ Failed. Try again.", success: false });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6 flex flex-col items-center">
        <img
          src={logo} alt="MarineCash"
          style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", marginBottom: "12px" }}
        />
        <h1 className="text-xl font-extrabold text-orange-500 mb-1">Forgot Password?</h1>
        <p className="text-gray-400 text-sm text-center mb-5">
          Enter your email and we'll send you a reset link.
        </p>

        {msg.text && (
          <div className={`w-full text-sm font-semibold text-center p-3 rounded-xl mb-4 ${msg.success ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {msg.text}
          </div>
        )}

        {!sent ? (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500">Email Address</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-3 text-sm mt-1 outline-none transition"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <button
            onClick={() => { setSent(false); setEmail(""); setMsg({ text: "", success: true }); }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm transition"
          >
            Send Again
          </button>
        )}

        <Link to="/login" className="text-sm text-orange-500 font-semibold mt-4 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
