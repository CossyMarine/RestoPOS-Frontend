import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ phone: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg]       = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg("");
    try {
      const res = await login(form);
      const role = res.user?.role;
      navigate(["admin","superadmin"].includes(role) ? "/admin" : "/home");
    } catch (err) {
      setMsg(err.response?.data?.message || "Invalid phone or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg,#0a1628 0%,#0d2144 60%,#0a3060 100%)", fontFamily: "Poppins,sans-serif" }}>
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>
            <i className="fas fa-rectangle-ad text-white text-xl"></i>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Marine<span style={{ color: "#22d3ee" }}>Ads</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="rounded-3xl p-6 border border-white/10"
          style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>

          {msg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-4 text-center">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400">Phone Number</label>
              <input
                type="tel" required placeholder="e.g. 0712345678"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPw ? "text" : "password"} required placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 pr-12 placeholder-gray-600"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <i className={`fas ${showPw ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-50 mt-2"
              style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
            No account?{" "}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: "#22d3ee" }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
