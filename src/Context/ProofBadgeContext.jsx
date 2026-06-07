import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import API from "../api/axios";
import { AuthContext } from "./AuthContext";

export const ProofBadgeContext = createContext();

export const ProofBadgeProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  const [adminPendingCount, setAdminPendingCount]   = useState(0);
  const [ownerPendingCount, setOwnerPendingCount]   = useState(0);

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const fetchAdminCount = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      const res = await API.get("/campaign/admin/pending-submissions", { params: { limit: 1, page: 1 } });
      setAdminPendingCount(res.data.total || 0);
    } catch {}
  }, [token, isAdmin]);

  const fetchOwnerCount = useCallback(async () => {
    if (!token || !user) return;
    try {
      const res = await API.get("/campaign/mine/pending-submissions-count");
      setOwnerPendingCount(res.data.count || 0);
    } catch {}
  }, [token, user]);

  useEffect(() => {
    fetchAdminCount();
    fetchOwnerCount();
    const interval = setInterval(() => {
      fetchAdminCount();
      fetchOwnerCount();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchAdminCount, fetchOwnerCount]);

  const formatBadge = (n) => (n > 99 ? "99+" : n);

  return (
    <ProofBadgeContext.Provider
      value={{
        adminPendingCount,
        ownerPendingCount,
        formatBadge,
        refreshAdmin: fetchAdminCount,
        refreshOwner: fetchOwnerCount,
      }}
    >
      {children}
    </ProofBadgeContext.Provider>
  );
};
