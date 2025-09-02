// src/Pages/AdminRewardCodes.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { getAllCodes, createRewardCode, deactivateRewardCode } from "../api/rewardApi";

const AdminRewardCodes = () => {
  const { token } = useContext(AuthContext);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCode, setNewCode] = useState({
    rewardType: "fixed",
    fixedReward: "",
    minReward: "",
    maxReward: "",
    maxUsers: 1,
    expiresAt: "",
    customCode: "",
  });

  // ✅ Fetch codes
  const fetchCodes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllCodes(token);
      setCodes(res.data.rewardCodes || res.data);
    } catch (err) {
      console.error("Failed to fetch codes:", err);
    } finally {
      setLoading(false);
    }
  }, [token]); // dependency is token

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]); // fetchCodes is now stable thanks to useCallback

  // ✅ Create new code
  const handleCreate = async () => {
    try {
      await createRewardCode(newCode, token);
      setNewCode({
        rewardType: "fixed",
        fixedReward: "",
        minReward: "",
        maxReward: "",
        maxUsers: 1,
        expiresAt: "",
        customCode: "",
      });
      fetchCodes(); // refresh list
    } catch (err) {
      console.error("Failed to create code:", err);
    }
  };

  // ✅ Deactivate code
  const handleDeactivate = async (id) => {
    try {
      await deactivateRewardCode(id, token);
      fetchCodes(); // refresh list
    } catch (err) {
      console.error("Failed to deactivate code:", err);
    }
  };

  return (
    <div>
      <h2>Admin Reward Codes</h2>

      <div>
        <h3>Create Reward Code</h3>
        <input
          type="text"
          placeholder="Custom Code (optional)"
          value={newCode.customCode}
          onChange={(e) => setNewCode({ ...newCode, customCode: e.target.value })}
        />
        <input
          type="number"
          placeholder="Fixed Reward"
          value={newCode.fixedReward}
          onChange={(e) => setNewCode({ ...newCode, fixedReward: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Users"
          value={newCode.maxUsers}
          onChange={(e) => setNewCode({ ...newCode, maxUsers: e.target.value })}
        />
        <input
          type="date"
          placeholder="Expires At"
          value={newCode.expiresAt}
          onChange={(e) => setNewCode({ ...newCode, expiresAt: e.target.value })}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <div>
        <h3>Existing Reward Codes</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Reward</th>
                <th>Max Users</th>
                <th>Redeemed</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((code) => (
                <tr key={code._id}>
                  <td>{code.code}</td>
                  <td>{code.rewardType}</td>
                  <td>
                    {code.rewardType === "fixed"
                      ? code.fixedReward
                      : `${code.minReward} - ${code.maxReward}`}
                  </td>
                  <td>{code.maxUsers}</td>
                  <td>{code.redeemedCount}</td>
                  <td>{code.isActive ? "✅" : "❌"}</td>
                  <td>
                    {code.isActive && (
                      <button onClick={() => handleDeactivate(code._id)}>Deactivate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminRewardCodes;