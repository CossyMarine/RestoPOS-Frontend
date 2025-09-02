// src/Context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getProfile } from "../api/authApi";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Fetch current user + wallet (defined inside useEffect to avoid missing dependency warning)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getProfile(); // { user, wallet }
        setUser(res.user);
        setWallet(res.wallet);
      } catch (err) {
        console.error("❌ Failed to fetch profile", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]); // ✅ token is the correct dependency

  // Login
const login = async (formData) => {
  const res = await loginUser(formData); // { user, wallet, token }
  const newToken = res.token;

  // Save token
  setToken(newToken);
  localStorage.setItem("token", newToken);

  // Save user
  setUser(res.user);
  localStorage.setItem("user", JSON.stringify(res.user));

  // Save wallet
  setWallet(res.wallet);

  return res;
};

// Register
const register = async (formData) => {
  const res = await registerUser(formData); // { user, wallet, token }
  const newToken = res.token;

  // Save token
  setToken(newToken);
  localStorage.setItem("token", newToken);

  // Save user
  setUser(res.user);
  localStorage.setItem("user", JSON.stringify(res.user));

  // Save wallet
  setWallet(res.wallet);

  return res;
};

  // Logout
  const handleLogout = () => {
    setUser(null);
    setWallet(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        wallet,
        token,
        login,
        register,
        logout: handleLogout,
        setUser,
        setWallet,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };