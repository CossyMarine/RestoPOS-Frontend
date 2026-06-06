// src/Pages/Login.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import logo from "../Assets/logo.png";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await login(form);
      const role = res.user?.role;
      if (role === "admin" || role === "superadmin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="MarineCash"
            style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }}
            className="mb-2"
          />
          <h1 className="text-2xl font-extrabold text-orange-500">MarineCash</h1>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        {msg && (
          <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-xl p-3 mb-4 text-center">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              required
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-3 text-sm mt-1 outline-none transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">Password</label>
            <div className="relative mt-1">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-3 text-sm outline-none transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <i className={`fas ${showPw ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-orange-500 font-semibold hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3 rounded-xl transition-all text-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-500 font-bold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
