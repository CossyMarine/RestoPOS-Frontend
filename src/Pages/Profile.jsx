// src/Pages/Profile.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import "../Styles/Profile.css";

export default function Profile() {
  const { user, setUser, logout } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    country: user?.country || "",
    phone: user?.phone || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // In real app: call backend API to update
    setUser({ ...user, ...formData });
    setEditMode(false);
    alert("Profile updated!");
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      country: user?.country || "",
      phone: user?.phone || "",
    });
    setEditMode(false);
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <div className="profile-card">
        <img
          src={user?.photo || "/Assets/default-avatar.png"}
          alt="Profile"
          className="profile-photo"
        />
        <button className="change-photo-btn">Change Photo</button>
      </div>

      <div className="profile-details">
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!editMode}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!editMode}
          />
        </label>

        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!editMode}
          />
        </label>

        <label>
          Country:
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={!editMode}
          />
        </label>

        <div className="profile-actions">
          {editMode ? (
            <>
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="edit-btn">
              Edit Profile
            </button>
          )}

          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}