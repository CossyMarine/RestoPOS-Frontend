import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AdminUsers = () => {
  const [users, setUsers]         = useState([]);
  const [total, setTotal]         = useState(0);
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [msg, setMsg]             = useState("");
  const [badgeTiers, setBadgeTiers]   = useState([]);
  const [badgeModal, setBadgeModal]   = useState(null);
  const [selectedBadge, setSelectedBadge] = useState("");

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/users", { params: { search, page, limit: 15 } });
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    API.get("/admin/settings")
      .then((res) => setBadgeTiers(res.data.badgeTiers || []))
      .catch(console.error);
  }, []);

  useEffect(() => { fetchUsers(); }, [search, page]);

  const handleBlock = async (userId, currentlyBlocked) => {
    try {
      await API.post("/admin/block-user", { userId, action: currentlyBlocked ? "unblock" : "block" });
      flash(`User ${currentlyBlocked ? "unblocked" : "blocked"} ✅`);
      fetchUsers();
    } catch (e) { flash("❌ " + (e.response?.data?.message || "Action failed")); }
  };

  const handleAssignBadge = async () => {
    if (!badgeModal || !selectedBadge) return;
    try {
      const tier = badgeTiers.find((t) => t.name === selectedBadge);
      await API.post("/admin/assign-badge", {
        userId: badgeModal._id,
        badge: tier?.badgeImage || "",
        referralLevel: badgeTiers.indexOf(tier) + 1,
      });
      flash(`Badge assigned to ${badgeModal.fullName} ✅`);
      setBadgeModal(null);
      fetchUsers();
    } catch (e) { flash("❌ " + (e.response?.data?.message || "Failed")); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-extrabold text-gray-800">User Management</h2>

      {msg && <div className="bg-green-50 text-green-600 text-sm font-semibold p-3 rounded-xl text-center">{msg}</div>}

      {/* Search */}
      <div className="bg-white rounded-xl shadow p-3 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..."
          className="flex-1 border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none"
        />
        <div className="text-xs text-gray-400 font-semibold flex items-center px-2">{total} users</div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="text-center text-orange-500 font-bold animate-pulse py-8">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-orange-400 text-white">
                <tr>
                  {["Name", "Email", "Country", "Role", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{u.fullName}</p>
                      <p className="text-[10px] text-gray-400">{u.referralCode}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600">{u.country}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        u.role === "superadmin" ? "bg-purple-100 text-purple-600"
                        : u.role === "admin"    ? "bg-blue-100 text-blue-600"
                        : u.role === "moderator"? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600"
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBlock(u._id, u.isBlocked)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${u.isBlocked ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}
                        >
                          {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => { setBadgeModal(u); setSelectedBadge(u.badge || ""); }}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition"
                        >
                          Badge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-xl bg-white shadow text-sm font-semibold disabled:opacity-40"
        >← Prev</button>
        <span className="px-4 py-2 text-sm font-semibold text-gray-600">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={users.length < 15}
          className="px-4 py-2 rounded-xl bg-white shadow text-sm font-semibold disabled:opacity-40"
        >Next →</button>
      </div>

      {/* Badge Modal */}
      {badgeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-800 mb-4">Assign Badge to {badgeModal.fullName}</h3>
            {badgeTiers.length === 0 ? (
              <p className="text-sm text-gray-400 mb-4">No badge tiers configured. Go to Badges section first.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {badgeTiers.map((tier) => (
                  <label key={tier.name} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${selectedBadge === tier.name ? "border-orange-400 bg-orange-50" : "border-gray-100"}`}>
                    <input
                      type="radio"
                      name="badge"
                      value={tier.name}
                      checked={selectedBadge === tier.name}
                      onChange={() => setSelectedBadge(tier.name)}
                      className="accent-orange-500"
                    />
                    <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: tier.color || "#ccc" }}></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{tier.name}</p>
                      <p className="text-xs text-gray-400">{tier.minReferrals}+ referrals</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={handleAssignBadge} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-sm transition">
                Assign
              </button>
              <button onClick={() => setBadgeModal(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 rounded-xl text-sm transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
