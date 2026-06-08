import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AnnouncementBadgeContext } from "../Context/AnnouncementBadgeContext";

const TAG_META = {
  general:   { label: "📢 General",   bg: "bg-blue-100",   text: "text-blue-600",   border: "border-blue-300" },
  important: { label: "⚠️ Important", bg: "bg-red-100",    text: "text-red-600",    border: "border-red-300" },
  hot:       { label: "🔥 Hot",       bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-300" },
  new:       { label: "🎉 New",       bg: "bg-green-100",  text: "text-green-600",  border: "border-green-300" },
  warning:   { label: "🚨 Warning",   bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
};

const Announcements = () => {
  const navigate = useNavigate();
  const { refresh } = useContext(AnnouncementBadgeContext);

  const [items, setItems]       = useState([]);
  const [readIds, setReadIds]   = useState(new Set());
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    API.get("/announcements")
      .then(res => {
        setItems(res.data);
        // Mark all as read on mount
        API.post("/announcements/mark-all-read").then(() => refresh()).catch(() => {});
        setReadIds(new Set()); // all now read
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setExpanded(p => p === id ? null : id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 pt-12 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold mb-6 transition group"
        >
          <span className="w-8 h-8 bg-white/20 group-hover:bg-white/30 rounded-full flex items-center justify-center transition">
            <i className="fas fa-arrow-left text-xs" />
          </span>
          Back
        </button>

        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
            <i className="fas fa-bullhorn text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Announcements</h1>
          <p className="text-orange-100 text-sm max-w-xs mx-auto">
            Stay updated with the latest news from our team
          </p>
        </div>
      </div>

      {/* Wave */}
      <div className="-mt-6 overflow-hidden">
        <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none" style={{ height: 40 }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="rgb(255,247,237)" />
        </svg>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pb-16 -mt-2 space-y-3">
        {loading ? (
          <div className="flex justify-center py-20 text-orange-400">
            <i className="fas fa-spinner fa-spin text-3xl" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <i className="fas fa-bullhorn text-5xl mb-3" />
            <p className="font-bold text-gray-500">No announcements yet</p>
          </div>
        ) : (
          items.map((item) => {
            const isOpen  = expanded === item._id;
            const meta    = TAG_META[item.tag] || TAG_META.general;
            const isUnread = readIds.has(item._id);

            return (
              <div
                key={item._id}
                onClick={() => toggle(item._id)}
                className={`bg-white rounded-2xl border-2 shadow-sm cursor-pointer transition-all duration-300 overflow-hidden ${
                  isUnread
                    ? `${meta.border} shadow-md`
                    : isOpen
                    ? `${meta.border}`
                    : "border-transparent hover:border-orange-100"
                }`}
              >
                {/* Pinned strip */}
                {item.isPinned && (
                  <div className="bg-orange-500 text-white text-[10px] font-extrabold px-4 py-1 flex items-center gap-1.5">
                    <i className="fas fa-thumbtack" /> PINNED
                  </div>
                )}

                <div className="p-4">
                  {/* Tag pill */}
                  <span className={`inline-flex items-center text-[11px] font-extrabold px-2.5 py-0.5 rounded-full mb-2 ${meta.bg} ${meta.text}`}>
                    {meta.label}
                  </span>

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Title (highlighted if present) */}
                      {item.title && (
                        <h3 className={`font-extrabold text-base mb-1 ${meta.text}`}>
                          {item.title}
                        </h3>
                      )}
                      <p className={`text-sm text-gray-600 ${!isOpen && "line-clamp-2"} leading-relaxed`}>
                        {item.text}
                      </p>
                    </div>

                    <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isOpen ? `${meta.bg} ${meta.text} rotate-45` : "bg-gray-50 text-gray-400"
                    }`}>
                      <i className="fas fa-plus text-xs" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[11px] text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {isUnread && (
                      <span className="text-[10px] font-extrabold bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
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

export default Announcements;
