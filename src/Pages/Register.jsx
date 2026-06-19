import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import zxcvbn from "zxcvbn";
import { AuthContext } from "../Context/AuthContext";

const strengthLabel = ["Weak","Fair","Good","Strong","Very Strong"];
const strengthColor = ["#ef4444","#f97316","#eab308","#22c55e","#16a34a"];
const strengthWidth = ["20%","40%","60%","80%","100%"];

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [strength, setStrength]   = useState(null);
  const [showPw, setShowPw]       = useState(false);
  const [showCpw, setShowCpw]     = useState(false);
  const [msg, setMsg]             = useState("");
  const [loading, setLoading]     = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "password") setStrength(zxcvbn(value).score);
  };

  const handlePhone = (value) => setForm({ ...form, phone: "+" + value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setMsg("Passwords do not match.");
    setLoading(true); setMsg("");
    try {
      await register({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password, confirmPassword: form.confirmPassword });
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "linear-gradient(135deg,#0a1628 0%,#0d2144 60%,#0a3060 100%)", fontFamily: "Poppins,sans-serif" }}>
      <div className="w-full max-w-sm">

        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>
            <i className="fas fa-rectangle-ad text-white text-xl"></i>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Marine<span style={{ color: "#22d3ee" }}>Ads</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Create your free account</p>
        </div>

        <div className="rounded-3xl p-6 border border-white/10"
          style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>

          {msg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-4 text-center">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-gray-400">Full Name</label>
              <input type="text" name="fullName" required placeholder="John Doe"
                value={form.fullName} onChange={handleChange}
                className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-400">Email</label>
              <input type="email" name="email" required placeholder="you@email.com"
                value={form.email} onChange={handleChange}
                className="w-full mt-1 px-4 py-2.5 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 placeholder-gray-600"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-400">Phone Number</label>
              <div className="mt-1">
                <PhoneInput
                  country="ke" value={form.phone.replace("+","")} onChange={handlePhone}
                  enableSearch
                  inputStyle={{
                    width: "100%", background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px",
                    color: "#fff", fontSize: "14px", padding: "10px 10px 10px 48px",
                  }}
                  buttonStyle={{ background: "transparent", border: "none" }}
                  dropdownStyle={{ background: "#1e293b", color: "#fff" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-400">Password</label>
              <div className="relative mt-1">
                <input type={showPw ? "text" : "password"} name="password" required placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 pr-10 placeholder-gray-600"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <i className={`fas ${showPw ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              {strength !== null && (
                <div className="mt-1.5">
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-1.5 rounded-full transition-all"
                      style={{ width: strengthWidth[strength], background: strengthColor[strength] }}></div>
                  </div>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: strengthColor[strength] }}>
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-gray-400">Confirm Password</label>
              <div className="relative mt-1">
                <input type={showCpw ? "text" : "password"} name="confirmPassword" required placeholder="••••••••"
                  value={form.confirmPassword} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition border border-white/10 focus:border-cyan-500 pr-10 placeholder-gray-600"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
                <button type="button" onClick={() => setShowCpw(!showCpw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <i className={`fas ${showCpw ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-50 mt-1"
              style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>
              {loading ? "Creating Account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: "#22d3ee" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
