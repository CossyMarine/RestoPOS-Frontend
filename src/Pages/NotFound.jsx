// src/Pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 text-center">
      <i className="fas fa-compass text-orange-400 text-6xl mb-4 animate-spin-slow"></i>
      <h1 className="text-5xl font-extrabold text-orange-500 mb-2">404</h1>
      <p className="text-gray-500 text-lg mb-6">Oops! Page not found.</p>
      <button
        onClick={() => navigate("/home")}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
