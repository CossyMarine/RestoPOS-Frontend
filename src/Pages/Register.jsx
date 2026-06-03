// src/Pages/Register.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import zxcvbn from "zxcvbn";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { AuthContext } from "../Context/AuthContext";
import logo from "../Assets/logo.png";

countries.registerLocale(enLocale);

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", email: "", country: "", phone: "",
    password: "", confirmPassword: "", agreedToTerms: false,
  });
  const [strength, setStrength] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [phoneCountry, setPhoneCountry] = useState("ke");

  useEffect(() => {
    const obj = countries.getNames("en", { select: "official" });
    setCountryList(Object.entries(obj).map(([code, name]) => ({ code: code.toLowerCase(), name })));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (name === "password") setStrength(zxcvbn(value).score);
    if (name === "country") {
      const found = countryList.find((c) => c.name === value);
      if (found) setPhoneCountry(found.code);
    }
  };

  const handlePhone = (value, data) => {
    setForm({ ...form, phone: "+" + value, country: data?.name || form.country });
    setPhoneCountry(data?.countryCode?.toLowerCase() || "ke");
  };

  const strengthLabel = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColor = ["text-red-500", "text-orange-400", "text-yellow-500", "text-green-500", "text-green-600"];
  const strengthBar = ["w-1/5 bg-red-400", "w-2/5 bg-orange-400", "w-3/5 bg-yellow-400", "w-4/5 bg-green-400", "w-full bg-green-500"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setMsg("Passwords do not match.");
    if (!form.agreedToTerms) return setMsg("Please accept the terms.");
    setLoading(true);
    setMsg("");
    try {
      await register(form);
      localStorage.setItem("pendingEmail", form.email);
      navigate("/verify-email");
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6">
        <div className="flex flex-col items-center mb-5">
          <img src={logo} alt="MarineCash" className="w-14 h-14 rounded-full mb-2" />
          <h1 className="text-2xl font-extrabold text-orange-500">Create Account</h1>
          <p className="text-gray-400 text-sm">Join MarineCash and start earning</p>
        </div>

        {msg && (
          <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-xl p-3 mb-4 text-center">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-gray-500">Full Name</label>
            <input
              type="text" name="fullName" value={form.fullName}
              onChange={handleChange} placeholder="John Doe" required
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-2.5 text-sm mt-1 outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-500">Email</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="your@email.com" required
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-2.5 text-sm mt-1 outline-none transition"
            />
          </div>

          {/* Country */}
          <div>
            <label className="text-xs font-semibold text-gray-500">Country</label>
            <select
              name="country" value={form.country} onChange={handleChange} required
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-2.5 text-sm mt-1 outline-none transition bg-white"
            >
              <option value="">Select Country</option>
              {countryList.map((c) => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-semibold text-gray-500">Phone</label>
            <div className="mt-1">
              <PhoneInput
                country={phoneCountry}
                value={form.phone}
                onChange={handlePhone}
                enableSearch
                inputStyle={{
                  width: "100%", border: "2px solid #e5e7eb",
                  borderRadius: "12px", fontSize: "14px", padding: "10px 10px 10px 48px",
                }}
                buttonStyle={{ border: "none", background: "transparent" }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-gray-500">Password</label>
            <div className="relative mt-1">
              <input
                type={showPw ? "text" : "password"} name="password"
                value={form.password} onChange={handleChange}
                placeholder="••••••••" required
                className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-2.5 text-sm outline-none transition pr-10"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <i className={`fas ${showPw ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {strength !== null && (
              <div className="mt-1">
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div className={`h-1.5 rounded-full transition-all ${strengthBar[strength]}`}></div>
                </div>
                <p className={`text-xs mt-0.5 font-semibold ${strengthColor[strength]}`}>
                  {strengthLabel[strength]}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold text-gray-500">Confirm Password</label>
            <div className="relative mt-1">
              <input
                type={showCpw ? "text" : "password"} name="confirmPassword"
                value={form.confirmPassword} onChange={handleChange}
                placeholder="••••••••" required
                className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-2.5 text-sm outline-none transition pr-10"
              />
              <button type="button" onClick={() => setShowCpw(!showCpw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <i className={`fas ${showCpw ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox" name="agreedToTerms"
              checked={form.agreedToTerms} onChange={handleChange}
              className="mt-0.5 accent-orange-500"
            />
            <span className="text-xs text-gray-500">
              I agree to the{" "}
              <Link to="/terms" className="text-orange-500 font-semibold hover:underline">
                Terms & Conditions
              </Link>
            </span>
          </label>

          <button
            type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3 rounded-xl transition-all text-sm mt-2"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
