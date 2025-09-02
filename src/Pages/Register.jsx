import React, { useState, useEffect } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import zxcvbn from "zxcvbn";
import { Link, useNavigate } from "react-router-dom";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import "../Styles/Register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

countries.registerLocale(enLocale);

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    country: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [strength, setStrength] = useState(null);
  const [message, setMessage] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("us"); // default

  // Load country list
  useEffect(() => {
    const countryObj = countries.getNames("en", { select: "official" });
    const countryArr = Object.entries(countryObj).map(([code, name]) => ({
      code: code.toLowerCase(),
      name,
    }));
    setCountryList(countryArr);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      const result = zxcvbn(e.target.value);
      setStrength(result.score); // 0–4
    }

    // ✅ if user selects a country, update phone input as well
    if (e.target.name === "country") {
      const selected = countryList.find((c) => c.name === e.target.value);
      if (selected) {
        setSelectedCountryCode(selected.code); // update PhoneInput country
      }
    }
  };

  const handlePhoneChange = (value, countryData) => {
    setForm({
      ...form,
      phone: "+" + value,
      country: countryData?.name || form.country,
    });
    setSelectedCountryCode(countryData?.countryCode?.toLowerCase() || "us");
  };

  // ✅ Updated handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.password !== form.confirmPassword) {
        setMessage("Passwords do not match");
        return;
      }
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      // ✅ Save email for VerifyEmail.jsx (needed for resend button)
      localStorage.setItem("pendingEmail", form.email);

      // Save message for VerifyEmail page
localStorage.setItem(
  "verifyMessage",
  "🎉 Registration successful! We've sent a verification email to your inbox. Please check your email or spam folder."
);

      // ✅ Redirect only to verify-email (do NOT navigate to login here)
      navigate("/verify-email");

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Country Dropdown */}
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            required
          >
            <option value="">Select Country</option>
            {countryList.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* PhoneInput synced with dropdown */}
          <PhoneInput
            country={selectedCountryCode}
            value={form.phone}
            onChange={handlePhoneChange}
            inputStyle={{ width: "100%" }}
            enableSearch={true}
          />

          {/* Password with Eye Toggle */}
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {strength !== null && (
            <div className="password-strength">
              Strength:{" "}
              <span
                className={
                  strength < 2 ? "weak" : strength < 4 ? "fair" : "strong"
                }
              >
                {["Weak", "Fair", "Good", "Strong", "Very Strong"][strength]}
              </span>
            </div>
          )}

          {/* Confirm Password with Eye Toggle */}
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label className="terms">
            <input
              type="checkbox"
              checked={form.agreedToTerms}
              onChange={(e) =>
                setForm({ ...form, agreedToTerms: e.target.checked })
              }
              required
            />
            I agree to the{" "}
            <Link to="/terms" className="terms-link">
              Terms & Conditions
            </Link>
          </label>

          <button type="submit">Register</button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;