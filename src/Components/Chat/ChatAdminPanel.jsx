// src/Components/Chat/ChatAdminPanel.jsx
import { useState } from "react";
import API from "../../api/axios";

export default function ChatAdminPanel({ onClose, uniqueSenders }) {
  const [roomInfo, setRoomInfo]   = useState(null);
  const [clearDays, setClearDays] = useState(null);
  const [banTarget, setBanTarget] = useState(null);
  const [banHours, setBanHours]   = useState("");
  const [banDays, setBanDays]     = useState("");
  const [banReason, setBanReason] = useState("");
  const [adminMsg, setAdminMsg]   = useState("");

  const flash = (msg) => { setAdminMsg(msg); setTimeout(() => setAdminMsg(""), 3500); };

  const loadRoomInfo = () =>
    API.get("/chat/admin/room-info").then((r) => setRoomInfo(r.data)).catch(() => {});

  // Load on mount
  useState(() => { loadRoomInfo(); }, []);

  const handleToggleRoom = async () => {
    try {
      const res = await API.post("/chat/admin/toggle-room", { close: !roomInfo?.isClosed });
      setRoomInfo((prev) => ({ ...prev, isClosed: res.data.isClosed }));
      flash(res.data.isClosed ? "🔒 Chatroom closed." : "🔓 Chatroom opened.");
    } catch { flash("❌ Failed to toggle room."); }
  };

  const handleClearMessages = async (days) => {
    try {
      const res = await API.post("/chat/admin/clear-messages", { days });
      flash(`🗑️ Deleted ${res.data.deleted} message(s).`);
      setClearDays(null);
    } catch { flash("❌ Failed to clear messages."); }
  };

  const handleBan = async () => {
    if (!banTarget) return;
    if (!banHours && !banDays) return flash("❌ Enter hours or days.");
    try {
      const res = await API.post("/chat/admin/ban-user", {
        userId: banTarget._id,
        hours: banHours ? Number(banHours) : 0,
        days: banDays ? Number(banDays) : 0,
        reason: banReason,
      });
      flash(`🚫 ${banTarget.fullName} banned until ${new Date(res.data.expiresAt).toLocaleString()}`);
      setBanTarget(null); setBanHours(""); setBanDays(""); setBanReason("");
      loadRoomInfo();
    } catch { flash("❌ Failed to ban user."); }
  };

  const handleUnban = async (userId) => {
    try {
      await API.post("/chat/admin/unban-user", { userId });
      flash("✅ User unbanned.");
      loadRoomInfo();
    } catch { flash("❌ Failed to unban."); }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <div className="w-[320px] max-w-full bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
        <div className="bg-orange-400 px-4 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-white font-extrabold text-sm flex items-center gap-2">
            <i className="fas fa-shield-halved"></i> Chat Admin Panel
          </h2>
          <button onClick={onClose} className="text-white text-lg">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {adminMsg && (
          <div className="mx-4 mt-3 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-2 rounded-xl">
            {adminMsg}
          </div>
        )}

        <div className="p-4 space-y-5 flex-1">
          {/* Room status */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-extrabold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <i className="fas fa-door-open text-orange-500"></i> Room Status
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">{roomInfo?.isClosed ? "🔒 Closed" : "🟢 Open"}</p>
                <p className="text-xs text-gray-400">{roomInfo?.isClosed ? "Users cannot send messages." : "Room is live."}</p>
              </div>
              <button
                onClick={handleToggleRoom}
                className={`text-xs font-extrabold px-4 py-2 rounded-xl transition ${
                  roomInfo?.isClosed ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {roomInfo?.isClosed ? "Open Room" : "Close Room"}
              </button>
            </div>
          </div>

          {/* Clear messages */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-extrabold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <i className="fas fa-trash-alt text-red-500"></i> Clear Messages
            </p>
            {clearDays === null ? (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "All Messages", days: 0,   color: "bg-red-500 hover:bg-red-600" },
                  { label: "Past 7 days",  days: 7,   color: "bg-orange-500 hover:bg-orange-600" },
                  { label: "Past 14 days", days: 14,  color: "bg-orange-400 hover:bg-orange-500" },
                  { label: "Past 30 days", days: 30,  color: "bg-yellow-500 hover:bg-yellow-600" },
                  { label: "Past 60 days", days: 60,  color: "bg-yellow-400 hover:bg-yellow-500" },
                  { label: "Past 90 days", days: 90,  color: "bg-gray-500 hover:bg-gray-600" },
                  { label: "Past 120 days",days: 120, color: "bg-gray-400 hover:bg-gray-500" },
                ].map(({ label, days, color }) => (
                  <button key={days} onClick={() => setClearDays(days)}
                    className={`${color} text-white text-xs font-bold py-2.5 rounded-xl transition`}>
                    {label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700 text-center">
                  ⚠️ Delete{" "}
                  <span className="text-red-600">
                    {clearDays === 0 ? "ALL messages" : `messages older than ${clearDays} days`}
                  </span>?
                </p>
                <p className="text-xs text-gray-400 text-center">This cannot be undone.</p>
                <div className="flex gap-2">
                  <button onClick={() => handleClearMessages(clearDays)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-extrabold py-2.5 rounded-xl transition">
                    Yes, Delete
                  </button>
                  <button onClick={() => setClearDays(null)}
                    className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-2.5 rounded-xl transition">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Ban user */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-extrabold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <i className="fas fa-ban text-red-500"></i> Ban User
            </p>
            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-500 block mb-1">Select user from chat</label>
              <select
                value={banTarget?._id || ""}
                onChange={(e) => { const u = uniqueSenders.find((s) => s._id === e.target.value); setBanTarget(u || null); }}
                className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none bg-white"
              >
                <option value="">-- Choose user --</option>
                {uniqueSenders.map((u) => (
                  <option key={u._id} value={u._id}>{u.fullName}</option>
                ))}
              </select>
            </div>
            {banTarget && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Hours</label>
                    <input type="number" min="0" value={banHours} onChange={(e) => setBanHours(e.target.value)}
                      placeholder="e.g. 12"
                      className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Days</label>
                    <input type="number" min="0" value={banDays} onChange={(e) => setBanDays(e.target.value)}
                      placeholder="e.g. 3"
                      className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Reason (optional)</label>
                  <input type="text" value={banReason} onChange={(e) => setBanReason(e.target.value)}
                    placeholder="e.g. Spamming"
                    className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2 text-sm outline-none" />
                </div>
                <button onClick={handleBan}
                  className="w-full bg-red-500 hover:bg-red-600 text-white text-xs font-extrabold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                  <i className="fas fa-ban"></i> Ban {banTarget.fullName}
                </button>
              </div>
            )}
          </div>

          {/* Active bans */}
          {roomInfo?.bans?.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-extrabold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                <i className="fas fa-user-slash text-orange-500"></i> Active Bans ({roomInfo.bans.length})
              </p>
              <div className="space-y-2">
                {roomInfo.bans.map((ban) => (
                  <div key={ban._id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 shadow-sm">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{ban.user?.fullName}</p>
                      <p className="text-[10px] text-gray-400">Expires: {new Date(ban.expiresAt).toLocaleString()}</p>
                      {ban.reason && <p className="text-[10px] text-gray-400 italic">"{ban.reason}"</p>}
                    </div>
                    <button onClick={() => handleUnban(ban.user?._id)}
                      className="text-xs text-green-600 font-bold bg-green-50 hover:bg-green-100 px-2 py-1 rounded-lg transition">
                      Unban
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
      }
