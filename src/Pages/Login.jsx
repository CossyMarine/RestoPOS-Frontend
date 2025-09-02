import React, { useState, useContext } from "react";
import "../Styles/Login.css"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setMessage("Please fill in both fields.");
      return;
    }

    setMessage("Logging in...");
    try {
      const res = await login(form); // ✅ call backend
      console.log("Login successful:", res);
      navigate("/wallet"); // go to wallet page after login
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
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
          <p className="forgot-password">
            <a href="/forgot-password">Forgot Password?</a>
          </p>
          <button type="submit">Login</button>
        </form>
        <p className="link-text">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;