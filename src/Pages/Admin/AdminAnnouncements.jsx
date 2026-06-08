import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const TAG_OPTIONS = [
  { value: "general",   label: "📢 General",   bg: "bg-blue-100",   text: "text-blue-600" },
  { value: "important", label: "⚠️ Important", bg: "bg-red-100",    text: "text-red-600" },
  { value: "hot",       label: "🔥 Hot",       bg: "bg-orange-100", text: "text-orange-600" },
  { value: "new",       label: "🎉 New",       bg: "bg-green-100",  text: "text-green-600" },
  { value: "warning",   label: "🚨 Warning",   bg: "bg-yellow-100", text: "text-yellow-700" },
];

const tagMeta = (tag) => TAG_OPTIONS.find(t => t.value === tag) || TAG_OPTIONS[0];

const EMPTY = { title: "", text: "", tag: "general", isPinned: false };

const AdminAnnouncements = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState({ text: "", success: true });
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null);

  const flash = (t, s = true) => {
    setMsg({ text: t, success: s });
    setTimeout(() => setMsg({ text: "", success: true }), 3000);
  };

  const load = () => {
    setLoading(true);
    API.get("/announcements/admin/all")
      .then(res => setItems(res.data))
      .catch(() => flash("❌ Failed to load", false))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm(EMPTY); setEditId(null); };

  const handleSubmit = async () => {
    if (!form.text.trim()) return flash("❌ Body text is required.", false);
    setSaving(true);
    try {
      if (editId) {
        await API.put(`/announcements/${editId}`, form);
        flash("✅ Updated!");
      } else {
        await API.post("/announcements", form);
        flash("✅ Posted!");
      }
      resetForm();
      load();
    } catch (e) {
      flash("❌ " + (e.response?.data?.message || "Failed."), false);
    }
    setSaving(false);
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setForm({ title: item.title || "", text: item.text, tag: item.tag, isPinned: item.isPinned });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleActive = async (item) => {
    try {
      await API.put(`/announcements/${item._id}`, { isActive: !item.isActive });
      flash(item.isActive ? "🔕 Hidden" : "✅ Shown");
      load();
    } catch { flash("❌ Failed.", false); }
  };

  const togglePin = async (item) => {
    try {
      await API.put(`/announcements/${item._id}`, { isPinned: !item.isPinned });
      flash(item.isPinned ? "📌 Unpinned" : "📌 Pinned!");
      load();
    } catch { flash("❌ Failed.", false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await API.delete(`/announcements/${id}`);
      flash("✅ Deleted");
      if (editId === id) resetForm();
      load();
    } catch { flash("❌ Failed.", false); }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <i className="fas fa-bullhorn text-orange-500 text-lg" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-800">Announcements</h2>
          <p className="text-xs text-gray-400">Post updates, alerts and news to all users</p>
        </div>
      </div>

      {/* Flash */}
      {msg.text && (
        <div className={`p-3 rounded-xl text-sm font-semibold text-center ${msg.success ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
          {msg.text}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
          <i className={`fas ${editId ? "fa-pen-to-square text-orange-400" : "fa-plus-circle text-orange-400"}`} />
          {editId ? "Edit Announcement" : "New Announcement"}
        </h3>

        {/* Tag + Pin row */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Tag</label>
            <select
              value={form.tag}
              onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            >
              {TAG_OPTIONS.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-orange-50 transition select-none">
              <input
                type="checkbox"
                checked={form.isPinned}
                onChange={e => setForm(f => ({ ...f, isPinned: e.target.checked }))}
                className="accent-orange-500 w-4 h-4"
              />
              <span className="text-sm font-semibold text-gray-600">📌 Pin to top</span>
            </label>
          </div>
        </div>

        {/* Title (optional) */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            Title <span className="text-gray-400 font-normal">(optional — will be highlighted)</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. System Maintenance Notice"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          />
        </div>

        {/* Body */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Body</label>
          <textarea
            value={form.text}
            onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
            placeholder="Write your announcement here..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition resize-none"
          />
        </div>

        {/* Preview pill */}
        {(form.title || form.text) && (
          <div className="border border-dashed border-orange-200 rounded-xl p-3 bg-orange-50">
            <p className="text-[10px] font-bold text-orange-400 uppercase mb-2">Preview</p>
            <span className={`inline-flex items-center text-[11px] font-extrabold px-2.5 py-0.5 rounded-full mb-1.5 ${tagMeta(form.tag).bg} ${tagMeta(form.tag).text}`}>
              {tagMeta(form.tag).label}
            </span>
            {form.title && <p className={`font-extrabold text-sm ${tagMeta(form.tag).text}`}>{form.title}</p>}
            {form.text  && <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{form.text}</p>}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl py-2.5 text-sm transition flex items-center justify-center gap-2"
          >
            {saving ? <><i className="fas fa-spinner fa-spin" /> Saving...</>
              : editId ? <><i className="fas fa-check" /> Update</>
              : <><i className="fas fa-paper-plane" /> Post</>}
          </button>
          {editId && (
            <button onClick={resetForm} className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl text-sm transition">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {loading ? "Loading..." : `${items.length} Announcement${items.length !== 1 ? "s" : ""}`}
        </p>

        {loading ? (
          <div className="text-center py-12 text-orange-400">
            <i className="fas fa-spinner fa-spin text-2xl" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
            <i className="fas fa-bullhorn text-3xl mb-2 block" />
            <p className="text-sm">No announcements yet</p>
          </div>
        ) : (
          items.map(item => {
            const meta = tagMeta(item.tag);
            return (
              <div
                key={item._id}
                className={`bg-white rounded-2xl border shadow-sm transition-all ${item.isActive ? "border-gray-100" : "border-dashed border-gray-200 opacity-60"}`}
              >
                {item.isPinned && (
                  <div className="bg-orange-500 text-white text-[10px] font-extrabold px-4 py-1 rounded-t-2xl flex items-center gap-1.5">
                    <i className="fas fa-thumbtack" /> PINNED
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`inline-flex items-center text-[11px] font-extrabold px-2 py-0.5 rounded-full ${meta.bg} ${meta.text}`}>
                          {meta.label}
                        </span>
                        {!item.isActive && (
                          <span className="text-[10px] bg-gray-100 text-gray-400 font-bold px-2 py-0.5 rounded-full">HIDDEN</span>
                        )}
                      </div>
                      {item.title && (
                        <p className={`font-extrabold text-sm ${meta.text}`}>{item.title}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.text}</p>

                      {/* Read stats */}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <i className="fas fa-eye text-gray-300" />
                          <span className="font-bold text-gray-600">{item.readCount}</span> / {item.totalUsers} read
                        </span>
                        {item.totalUsers > 0 && (
                          <div className="flex-1 max-w-[100px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-400 rounded-full transition-all"
                              style={{ width: `${Math.round((item.readCount / item.totalUsers) * 100)}%` }}
                            />
                          </div>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {item.totalUsers > 0 ? `${Math.round((item.readCount / item.totalUsers) * 100)}%` : "0%"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => togglePin(item)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${item.isPinned ? "bg-orange-100 text-orange-500" : "bg-gray-50 hover:bg-orange-50 text-gray-400 hover:text-orange-400"}`}
                        title={item.isPinned ? "Unpin" : "Pin"}>
                        <i className="fas fa-thumbtack text-xs" />
                      </button>
                      <button onClick={() => startEdit(item)}
                        className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center transition">
                        <i className="fas fa-pen text-xs" />
                      </button>
                      <button onClick={() => toggleActive(item)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${item.isActive ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-500" : "bg-green-50 hover:bg-green-100 text-green-500"}`}>
                        <i className={`fas ${item.isActive ? "fa-eye-slash" : "fa-eye"} text-xs`} />
                      </button>
                      <button onClick={() => handleDelete(item._id)}
                        className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition">
                        <i className="fas fa-trash text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
