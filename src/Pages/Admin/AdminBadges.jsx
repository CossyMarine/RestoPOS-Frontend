import React, { useEffect, useRef, useState } from "react";
import API from "../../api/axios";

export default function AdminBadges() {
  const [badges, setBadges]             = useState([]);
  const [users, setUsers]               = useState([]);
  const [totalUsers, setTotalUsers]     = useState(0);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [loadingUsers, setLoadingUsers]   = useState(false);
  const [saving, setSaving]             = useState(false);
  const [msg, setMsg]                   = useState({ text: "", success: true });
  const [assigning, setAssigning]       = useState(null);

  // Create form
  const [newName, setNewName]     = useState("");
  const [newFile, setNewFile]     = useState(null);
  const [newPreview, setNewPreview] = useState(null);
  const createFileRef = useRef(null);

  // Edit modal
  const [editTarget, setEditTarget]   = useState(null); // badge being edited
  const [editName, setEditName]       = useState("");
  const [editFile, setEditFile]       = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editSaving, setEditSaving]   = useState(false);
  const editFileRef = useRef(null);

  // Bulk reassign
  const [bulkFrom, setBulkFrom]   = useState("");
  const [bulkTo, setBulkTo]       = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);

  // Filters
  const [search, setSearch]       = useState("");
  const [minRef, setMinRef]       = useState("");
  const [maxRef, setMaxRef]       = useState("");
  const [minEarned, setMinEarned] = useState("");
  const [maxEarned, setMaxEarned] = useState("");
  const [hasBadge, setHasBadge]   = useState("");
  const [sortBy, setSortBy]       = useState("createdAt");
  const [page, setPage]           = useState(1);
  const [pages, setPages]         = useState(1);

  const flash = (text, success = true) => {
    setMsg({ text, success });
    setTimeout(() => setMsg({ text: "", success: true }), 3500);
  };

  // ── Load badges ──────────────────────────────────────────────────
  useEffect(() => {
    API.get("/badges")
      .then((r) => setBadges(r.data))
      .catch(console.error)
      .finally(() => setLoadingBadges(false));
  }, []);

  // ── Load users ───────────────────────────────────────────────────
  const loadUsers = async (p = 1) => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 15, sortBy });
      if (search)    params.append("search",       search);
      if (minRef)    params.append("minReferrals",  minRef);
      if (maxRef)    params.append("maxReferrals",  maxRef);
      if (minEarned) params.append("minEarned",     minEarned);
      if (maxEarned) params.append("maxEarned",     maxEarned);
      if (hasBadge !== "") params.append("hasBadge", hasBadge);

      const res = await API.get(`/badges/users?${params}`);
      setUsers(res.data.users);
      setTotalUsers(res.data.total);
      setPages(res.data.pages);
      setPage(p);
    } catch {
      flash("❌ Failed to load users.", false);
    }
    setLoadingUsers(false);
  };

  useEffect(() => { loadUsers(1); }, [sortBy]);

  // ── Create badge ─────────────────────────────────────────────────
  const handleCreateFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewFile(file);
    setNewPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleCreateBadge = async () => {
    if (!newName.trim()) return flash("❌ Enter a badge name.", false);
    if (!newFile)        return flash("❌ Select an image.", false);
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", newName.trim());
      fd.append("image", newFile);
      const res = await API.post("/badges", fd);
      setBadges((prev) => [res.data, ...prev]);
      setNewName(""); setNewFile(null); setNewPreview(null);
      flash("✅ Badge created!");
    } catch (err) {
      flash("❌ " + (err.response?.data?.message || "Failed."), false);
    }
    setSaving(false);
  };

  // ── Edit badge ───────────────────────────────────────────────────
  const openEdit = (badge) => {
    setEditTarget(badge);
    setEditName(badge.name);
    setEditFile(null);
    setEditPreview(null);
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditFile(file);
    setEditPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleEditSave = async () => {
    if (!editName.trim()) return flash("❌ Name cannot be empty.", false);
    setEditSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", editName.trim());
      if (editFile) fd.append("image", editFile);
      const res = await API.patch(`/badges/${editTarget._id}`, fd);
      // Update badge in list — image change is live for all users automatically
      setBadges((prev) => prev.map((b) => b._id === res.data._id ? res.data : b));
      // Also update any users in the assign list who have this badge
      setUsers((prev) => prev.map((u) =>
        u.badge?._id === res.data._id ? { ...u, badge: res.data } : u
      ));
      flash("✅ Badge updated!");
      setEditTarget(null);
    } catch (err) {
      flash("❌ " + (err.response?.data?.message || "Update failed."), false);
    }
    setEditSaving(false);
  };

  // ── Toggle visibility ────────────────────────────────────────────
  const handleToggleVisibility = async (badge) => {
    try {
      const res = await API.patch(`/badges/${badge._id}/visibility`);
      setBadges((prev) => prev.map((b) => b._id === badge._id ? res.data.badge : b));
      flash(res.data.badge.hidden ? "🙈 Badge hidden from all users." : "👁 Badge now visible to all users.");
    } catch {
      flash("❌ Failed to toggle visibility.", false);
    }
  };

  // ── Delete badge ─────────────────────────────────────────────────
  const handleDeleteBadge = async (id) => {
    if (!window.confirm("Delete this badge? It will be removed from all users.")) return;
    try {
      await API.delete(`/badges/${id}`);
      setBadges((prev) => prev.filter((b) => b._id !== id));
      setUsers((prev) => prev.map((u) => u.badge?._id === id ? { ...u, badge: null } : u));
      flash("✅ Badge deleted.");
    } catch {
      flash("❌ Delete failed.", false);
    }
  };

  // ── Bulk reassign ────────────────────────────────────────────────
  const handleBulkReassign = async () => {
    if (!bulkFrom) return flash("❌ Select a source badge.", false);
    const fromName = badges.find((b) => b._id === bulkFrom)?.name || "?";
    const toName   = bulkTo ? badges.find((b) => b._id === bulkTo)?.name : "no badge";
    if (!window.confirm(`Reassign all users with "${fromName}" → "${toName}"?`)) return;
    setBulkSaving(true);
    try {
      const res = await API.post("/badges/bulk-reassign", {
        fromBadgeId: bulkFrom,
        toBadgeId:   bulkTo || null,
      });
      flash(`✅ ${res.data.affected} user(s) reassigned.`);
      // Refresh user list to reflect changes
      loadUsers(1);
      setBulkFrom(""); setBulkTo("");
    } catch (err) {
      flash("❌ " + (err.response?.data?.message || "Bulk reassign failed."), false);
    }
    setBulkSaving(false);
  };

  // ── Assign badge to single user ──────────────────────────────────
  const handleAssign = async (userId, badgeId) => {
    setAssigning(userId);
    try {
      const res = await API.post("/badges/assign", { userId, badgeId: badgeId || null });
      setUsers((prev) => prev.map((u) =>
        u._id === userId ? { ...u, badge: res.data.user.badge } : u
      ));
      flash(badgeId ? "✅ Badge assigned!" : "✅ Badge removed.");
    } catch {
      flash("❌ Failed to assign badge.", false);
    }
    setAssigning(null);
  };

  // ── Quick filters ────────────────────────────────────────────────
  const QUICK_FILTERS = [
    { label: "0–10 referrals",  minRef: "0",  maxRef: "10"  },
    { label: "10–30 referrals", minRef: "10", maxRef: "30"  },
    { label: "30+ referrals",   minRef: "30", maxRef: ""    },
    { label: "Earned $50+",     minEarned: "50" },
    { label: "No badge yet",    hasBadge: "false" },
    { label: "Has badge",       hasBadge: "true"  },
  ];

  const applyQuick = (f) => {
    setMinRef(f.minRef ?? ""); setMaxRef(f.maxRef ?? "");
    setMinEarned(f.minEarned ?? ""); setMaxEarned(f.maxEarned ?? "");
    setHasBadge(f.hasBadge ?? "");
    setSearch("");
  };

  // ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto pb-20">
      <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
        <i className="fas fa-medal text-orange-500"></i> Badge Manager
      </h1>

      {msg.text && (
        <div className={`text-xs font-bold px-4 py-2 rounded-xl ${msg.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {msg.text}
        </div>
      )}

      {/* ── Create Badge ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <h2 className="text-sm font-extrabold text-gray-700 flex items-center gap-2">
          <i className="fas fa-plus-circle text-orange-500"></i> Create New Badge
        </h2>
        <div className="flex gap-3 items-center">
          <div
            onClick={() => createFileRef.current?.click()}
            className="w-16 h-16 rounded-2xl border-2 border-dashed border-orange-300 flex items-center justify-center cursor-pointer overflow-hidden shrink-0 bg-orange-50 hover:bg-orange-100 transition"
          >
            {newPreview
              ? <img src={newPreview} alt="preview" className="w-full h-full object-cover rounded-2xl" />
              : <i className="fas fa-image text-orange-400 text-xl"></i>}
          </div>
          <input ref={createFileRef} type="file" accept="image/*" className="hidden" onChange={handleCreateFileChange} />
          <div className="flex-1 space-y-2">
            <input
              type="text" placeholder="Badge name (e.g. Gold Star)"
              value={newName} onChange={(e) => setNewName(e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={handleCreateBadge} disabled={saving}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl py-2 text-sm transition disabled:opacity-50"
            >
              {saving ? "Uploading..." : "Create Badge"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Badge Library ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-sm font-extrabold text-gray-700 mb-3 flex items-center gap-2">
          <i className="fas fa-layer-group text-orange-500"></i> Badge Library ({badges.length})
        </h2>
        {loadingBadges ? (
          <p className="text-xs text-gray-400 text-center py-4">Loading...</p>
        ) : badges.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No badges yet.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {badges.map((b) => (
              <div key={b._id} className={`flex flex-col items-center gap-1 rounded-2xl p-3 relative group transition ${b.hidden ? "bg-gray-100 opacity-60" : "bg-gray-50"}`}>
                <img src={b.imageUrl} alt={b.name} className="w-12 h-12 object-cover rounded-full shadow" />
                <p className="text-[11px] font-bold text-gray-700 text-center leading-tight">{b.name}</p>
                {b.hidden && (
                  <span className="text-[9px] bg-gray-300 text-gray-600 px-1.5 py-0.5 rounded-full font-bold">HIDDEN</span>
                )}
                {/* Action buttons — visible on hover */}
                <div className="absolute top-1.5 right-1.5 hidden group-hover:flex flex-col gap-1">
                  {/* Edit */}
                  <button
                    onClick={() => openEdit(b)}
                    className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[9px] shadow"
                    title="Edit"
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                  {/* Hide / Show */}
                  <button
                    onClick={() => handleToggleVisibility(b)}
                    className={`w-5 h-5 text-white rounded-full flex items-center justify-center text-[9px] shadow ${b.hidden ? "bg-green-500" : "bg-yellow-500"}`}
                    title={b.hidden ? "Show" : "Hide"}
                  >
                    <i className={`fas ${b.hidden ? "fa-eye" : "fa-eye-slash"}`}></i>
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteBadge(b._id)}
                    className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] shadow"
                    title="Delete"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit Badge Modal ─────────────────────────────────────── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
              <i className="fas fa-pen text-blue-500"></i> Edit Badge
            </h3>

            {/* Image picker */}
            <div className="flex items-center gap-4">
              <div
                onClick={() => editFileRef.current?.click()}
                className="w-16 h-16 rounded-2xl border-2 border-dashed border-blue-300 flex items-center justify-center cursor-pointer overflow-hidden shrink-0 bg-blue-50 hover:bg-blue-100 transition"
              >
                <img
                  src={editPreview || editTarget.imageUrl}
                  alt="badge"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <input ref={editFileRef} type="file" accept="image/*" className="hidden" onChange={handleEditFileChange} />
              <p className="text-[11px] text-gray-400">Click image to replace.<br />Leave as-is to keep current.</p>
            </div>

            {/* Name */}
            <input
              type="text" placeholder="Badge name"
              value={editName} onChange={(e) => setEditName(e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-blue-400 rounded-xl px-3 py-2 text-sm outline-none"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setEditTarget(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl py-2 text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave} disabled={editSaving}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl py-2 text-sm transition disabled:opacity-50"
              >
                {editSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Reassign ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-3">
        <h2 className="text-sm font-extrabold text-gray-700 flex items-center gap-2">
          <i className="fas fa-exchange-alt text-orange-500"></i> Bulk Reassign Badge
        </h2>
        <p className="text-[11px] text-gray-400">Move all users from one badge to another (or remove the badge entirely).</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-bold text-gray-500 mb-1 block">From badge</label>
            <select
              value={bulkFrom} onChange={(e) => setBulkFrom(e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none bg-white"
            >
              <option value="">Select badge...</option>
              {badges.map((b) => (
                <option key={b._id} value={b._id}>{b.name}{b.hidden ? " (hidden)" : ""}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-500 mb-1 block">To badge (or remove)</label>
            <select
              value={bulkTo} onChange={(e) => setBulkTo(e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none bg-white"
            >
              <option value="">— Remove badge —</option>
              {badges.filter((b) => b._id !== bulkFrom).map((b) => (
                <option key={b._id} value={b._id}>{b.name}{b.hidden ? " (hidden)" : ""}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleBulkReassign} disabled={bulkSaving || !bulkFrom}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl py-2 text-sm transition disabled:opacity-50"
        >
          {bulkSaving ? "Reassigning..." : "Apply Bulk Reassign"}
        </button>
      </div>

      {/* ── Assign Badges to Users ───────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-4">
        <h2 className="text-sm font-extrabold text-gray-700 flex items-center gap-2">
          <i className="fas fa-user-tag text-orange-500"></i> Assign Badges to Users
        </h2>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => { applyQuick(f); loadUsers(1); }}
              className="text-[11px] font-bold bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 px-3 py-1 rounded-full transition"
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search + filters */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text" placeholder="Search name or email..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadUsers(1)}
            className="col-span-2 border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none"
          />
          <input type="number" placeholder="Min referrals" value={minRef} onChange={(e) => setMinRef(e.target.value)}
            className="border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none" />
          <input type="number" placeholder="Max referrals" value={maxRef} onChange={(e) => setMaxRef(e.target.value)}
            className="border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none" />
          <input type="number" placeholder="Min earned ($)" value={minEarned} onChange={(e) => setMinEarned(e.target.value)}
            className="border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none" />
          <input type="number" placeholder="Max earned ($)" value={maxEarned} onChange={(e) => setMaxEarned(e.target.value)}
            className="border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none" />
          <select value={hasBadge} onChange={(e) => setHasBadge(e.target.value)}
            className="border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none bg-white">
            <option value="">All users</option>
            <option value="false">No badge yet</option>
            <option value="true">Has badge</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none bg-white">
            <option value="createdAt">Newest</option>
            <option value="earned">Highest earned</option>
            <option value="referrals">Most referrals</option>
          </select>
        </div>

        <button
          onClick={() => loadUsers(1)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl py-2 text-sm transition"
        >
          <i className="fas fa-search mr-2"></i>Search Users
        </button>

        {/* User list */}
        {loadingUsers ? (
          <p className="text-xs text-gray-400 text-center py-6 animate-pulse">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">No users match your filters.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-400">{totalUsers} user(s) found</p>
            {users.map((u) => (
              <div key={u._id} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-3 py-2.5">
                {/* Avatar + badge overlay */}
                <div className="relative shrink-0">
                  <img
                    src={u.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=f97316&color=fff&size=64`}
                    alt={u.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {u.badge && !u.badge.hidden && (
                    <img
                      src={u.badge.imageUrl}
                      alt={u.badge.name}
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow"
                    />
                  )}
                  {u.badge?.hidden && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                      <i className="fas fa-eye-slash text-[7px] text-gray-500"></i>
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{u.fullName}</p>
                  <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[10px] text-blue-500 font-semibold">{u.referrals || 0} refs</span>
                    <span className="text-[10px] text-green-500 font-semibold">${Number(u.totalEarned || 0).toFixed(2)} earned</span>
                    {u.badge && (
                      <span className="text-[10px] text-orange-500 font-semibold">
                        {u.badge.name}{u.badge.hidden ? " 🙈" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge selector */}
                <div className="shrink-0">
                  <select
                    value={u.badge?._id || ""}
                    onChange={(e) => handleAssign(u._id, e.target.value)}
                    disabled={assigning === u._id}
                    className="text-[11px] border-2 border-gray-200 focus:border-orange-400 rounded-xl px-2 py-1.5 outline-none bg-white max-w-[110px]"
                  >
                    <option value="">No badge</option>
                    {badges.map((b) => (
                      <option key={b._id} value={b._id}>{b.name}{b.hidden ? " (hidden)" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 pt-2">
                <button disabled={page <= 1} onClick={() => loadUsers(page - 1)}
                  className="text-xs px-3 py-1.5 bg-gray-100 rounded-xl disabled:opacity-40 font-bold">← Prev</button>
                <span className="text-xs font-bold text-gray-500 self-center">{page} / {pages}</span>
                <button disabled={page >= pages} onClick={() => loadUsers(page + 1)}
                  className="text-xs px-3 py-1.5 bg-gray-100 rounded-xl disabled:opacity-40 font-bold">Next →</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
                    }
