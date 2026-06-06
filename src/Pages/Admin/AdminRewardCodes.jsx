import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const INIT_FORM = {
  customCode: "",
  rewardType: "random",
  fixedReward: "",
  minReward: "",
  maxReward: "",
  totalAmount: "",
  maxUsers: "",
  expiresAt: "",
};

const AdminRewardCodes = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", success: true });
  const [form, setForm] = useState(INIT_FORM);
  const [expandedCode, setExpandedCode] = useState(null);
  const [filters, setFilters] = useState({ status: "", rewardType: "", search: "" });

  const flash = (t, s = true) => {
    setMsg({ text: t, success: s });
    setTimeout(() => setMsg({ text: "", success: true }), 4000);
  };

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.rewardType) params.rewardType = filters.rewardType;
      if (filters.search) params.search = filters.search;
      const res = await API.get("/rewardcode/list", { params });
      setCodes(res.data.rewardCodes || []);
    } catch (e) {
      flash("❌ Failed to load codes.", false);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCodes(); }, [filters]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleCreate = async () => {
    if (!form.totalAmount || Number(form.totalAmount) <= 0)
      return flash("❌ Total Amount is required.", false);
    if (!form.maxUsers || Number(form.maxUsers) < 1)
      return flash("❌ Max Users is required.", false);
    if (form.rewardType === "fixed" && (!form.fixedReward || Number(form.fixedReward) <= 0))
      return flash("❌ Fixed reward amount is required.", false);
    if (form.rewardType === "random") {
      if (!form.minReward || !form.maxReward)
        return flash("❌ Min and Max reward are required for random type.", false);
      if (Number(form.maxReward) <= Number(form.minReward))
        return flash("❌ Max reward must be greater than min reward.", false);
    }

    setSaving(true);
    try {
      const payload = {
        rewardType: form.rewardType,
        totalAmount: Number(form.totalAmount),
        maxUsers: Number(form.maxUsers),
        customCode: form.customCode.trim().toUpperCase() || undefined,
        expiresAt: form.expiresAt || undefined,
      };
      if (form.rewardType === "fixed") {
        payload.fixedReward = Number(form.fixedReward);
      } else {
        payload.minReward = Number(form.minReward);
        payload.maxReward = Number(form.maxReward);
      }
      await API.post("/rewardcode/create", payload);
      setForm(INIT_FORM);
      flash("✅ Reward code created!");
      fetchCodes();
    } catch (e) {
      flash("❌ " + (e.response?.data?.message || "Failed to create code."), false);
    }
    setSaving(false);
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this code?")) return;
    try {
      await API.patch(`/rewardcode/deactivate/${id}`);
      flash("✅ Code deactivated.");
      fetchCodes();
    } catch (e) {
      flash("❌ Failed to deactivate.", false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this code? This cannot be undone.")) return;
    try {
      await API.delete(`/rewardcode/delete/${id}`);
      flash("✅ Code deleted.");
      fetchCodes();
    } catch (e) {
      flash("❌ Failed to delete.", false);
    }
  };

  const isExpired = (code) => code.expiresAt && new Date() > new Date(code.expiresAt);

  return (
    <div className="space-y-5 max-w-4xl">
      <h2 className="text-lg font-extrabold text-gray-800">🎁 Reward Codes</h2>

      {msg.text && (
        <div
          className={`p-3 rounded-xl text-sm font-semibold text-center ${
            msg.success ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* ── Create Form ── */}
      <div className="bg-white rounded-2xl shadow p-5 space-y-4">
        <h3 className="font-bold text-gray-700">Create Reward Code</h3>

        {/* Type toggle */}
        <div className="flex gap-3">
          {["fixed", "random"].map((t) => (
            <button
              key={t}
              onClick={() => set("rewardType", t)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition ${
                form.rewardType === t
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-200 text-gray-400"
              }`}
            >
              {t === "fixed" ? "Fixed Amount" : "Random Amount"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500">Custom Code (optional)</label>
            <input
              value={form.customCode}
              onChange={(e) => set("customCode", e.target.value.toUpperCase())}
              placeholder="Auto-generated if empty"
              maxLength={12}
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm mt-1 outline-none tracking-widest font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">Total Amount Pool ($)</label>
            <input
              type="number"
              value={form.totalAmount}
              onChange={(e) => set("totalAmount", e.target.value)}
              placeholder="e.g. 1.00"
              step="0.001"
              min="0"
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm mt-1 outline-none"
            />
          </div>

          {form.rewardType === "fixed" ? (
            <div>
              <label className="text-xs font-semibold text-gray-500">Fixed Reward per User ($)</label>
              <input
                type="number"
                value={form.fixedReward}
                onChange={(e) => set("fixedReward", e.target.value)}
                placeholder="e.g. 0.10"
                step="0.001"
                min="0"
                className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm mt-1 outline-none"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-500">Min Reward per User ($)</label>
                <input
                  type="number"
                  value={form.minReward}
                  onChange={(e) => set("minReward", e.target.value)}
                  placeholder="e.g. 0.005"
                  step="0.001"
                  min="0"
                  className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm mt-1 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">Max Reward per User ($)</label>
                <input
                  type="number"
                  value={form.maxReward}
                  onChange={(e) => set("maxReward", e.target.value)}
                  placeholder="e.g. 0.15"
                  step="0.001"
                  min="0"
                  className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm mt-1 outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-500">Max Users</label>
            <input
              type="number"
              value={form.maxUsers}
              onChange={(e) => set("maxUsers", e.target.value)}
              placeholder="e.g. 100"
              min="1"
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm mt-1 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500">Expires At (optional)</label>
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => set("expiresAt", e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm mt-1 outline-none"
            />
          </div>
        </div>

        {/* Preview hint */}
        {form.rewardType === "random" && form.minReward && form.maxReward && (
          <p className="text-xs text-orange-500 font-semibold bg-orange-50 rounded-xl px-3 py-2">
            💡 Each user will receive a random amount between ${Number(form.minReward).toFixed(3)} and ${Number(form.maxReward).toFixed(3)}
          </p>
        )}

        <button
          onClick={handleCreate}
          disabled={saving}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create Code"}
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="grid grid-cols-3 gap-3">
          <input
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value.toUpperCase() }))}
            placeholder="Search code..."
            className="border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none tracking-widest font-bold"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            className="border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={filters.rewardType}
            onChange={(e) => setFilters((p) => ({ ...p, rewardType: e.target.value }))}
            className="border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none"
          >
            <option value="">All Types</option>
            <option value="fixed">Fixed</option>
            <option value="random">Random</option>
          </select>
        </div>
      </div>

      {/* ── List ── */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {loading ? (
          <p className="text-center text-orange-500 animate-pulse font-bold text-sm py-10">
            Loading...
          </p>
        ) : codes.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">No reward codes found.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {codes.map((c) => {
              const expired = isExpired(c);
              const statusLabel = expired ? "Expired" : c.isActive ? "Active" : "Inactive";
              const statusColor = expired
                ? "bg-yellow-100 text-yellow-600"
                : c.isActive
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-400";

              return (
                <div key={c._id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="font-black text-gray-800 tracking-widest text-sm shrink-0">
                        {c.code}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${statusColor}`}
                      >
                        {statusLabel}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {c.rewardType === "fixed"
                          ? `$${Number(c.fixedReward).toFixed(3)} fixed`
                          : `$${Number(c.minReward).toFixed(3)}–$${Number(c.maxReward).toFixed(3)} random`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-500">
                        {c.redeemedCount}/{c.maxUsers} used
                      </span>
                      <button
                        onClick={() =>
                          setExpandedCode(expandedCode === c._id ? null : c._id)
                        }
                        className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                      >
                        {expandedCode === c._id ? "Hide" : "Details"}
                      </button>
                      {c.isActive && !expired && (
                        <button
                          onClick={() => handleDeactivate(c._id)}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition"
                        >
                          Deactivate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span>Pool: <strong className="text-gray-600">${Number(c.totalAmount).toFixed(3)}</strong></span>
                    <span>Expires: <strong className="text-gray-600">{c.expiresAt ? new Date(c.expiresAt).toLocaleString() : "Never"}</strong></span>
                    <span>Created: <strong className="text-gray-600">{new Date(c.createdAt).toLocaleDateString()}</strong></span>
                  </div>

                  {/* Expanded redemption history */}
                  {expandedCode === c._id && (
                    <div className="mt-3 bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-gray-600 mb-2">
                        Redemption History ({c.redeemedBy?.length || 0})
                      </p>
                      {!c.redeemedBy?.length ? (
                        <p className="text-xs text-gray-400">No redemptions yet.</p>
                      ) : (
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {c.redeemedBy.map((r, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center text-xs bg-white rounded-lg px-3 py-1.5"
                            >
                              <span className="text-gray-600 font-medium">
                                {r.userId?.username || r.userId?.email || r.userId?._id || "Unknown"}
                              </span>
                              <span className="text-green-600 font-bold">+${Number(r.amount).toFixed(3)}</span>
                              <span className="text-gray-400">
                                {new Date(r.redeemedAt).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRewardCodes;
