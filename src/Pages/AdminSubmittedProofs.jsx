import React, { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { ProofBadgeContext } from "../../Context/ProofBadgeContext";

const CATEGORY_ICONS = {
  survey: "fa-clipboard-list", video: "fa-play-circle", follow: "fa-users",
  signup: "fa-user-plus", offer: "fa-tag", app_install: "fa-download",
  game: "fa-gamepad", other: "fa-tasks",
};

const AdminSubmittedProofs = () => {
  const { refreshAdmin } = useContext(ProofBadgeContext);
  const [items, setItems]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);
  const [expanded, setExpanded]       = useState(null);
  const [lightbox, setLightbox]       = useState(null);
  const [msg, setMsg]                 = useState({ text: "", success: true });
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const LIMIT = 20;

  const flash = (t, s = true) => {
    setMsg({ text: t, success: s });
    setTimeout(() => setMsg({ text: "", success: true }), 4000);
  };

  const fetchProofs = async (p = 1) => {
    setLoading(true);
    try {
      const res = await API.get("/campaign/admin/pending-submissions", {
        params: { page: p, limit: LIMIT },
      });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
      setPage(p);
    } catch {
      flash("❌ Failed to load submissions.", false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProofs(1);
  }, []);

  const handleApprove = async (item) => {
    setActionLoading(true);
    try {
      await API.put(
        `/campaign/admin/${item.campaignId}/submissions/${item.submissionId}/review`,
        { action: "approve" }
      );
      flash("✅ Submission approved and user paid.");
      await fetchProofs(page);
      refreshAdmin();
    } catch (e) {
      flash("❌ " + (e.response?.data?.message || "Failed to approve."), false);
    }
    setActionLoading(false);
  };

  const handleReject = async (item) => {
    if (!rejectReason.trim()) return flash("❌ Rejection reason is required.", false);
    setActionLoading(true);
    try {
      await API.put(
        `/campaign/admin/${item.campaignId}/submissions/${item.submissionId}/review`,
        { action: "reject", rejectionReason: rejectReason }
      );
      flash("✅ Submission rejected.");
      setRejectingId(null);
      setRejectReason("");
      await fetchProofs(page);
      refreshAdmin();
    } catch (e) {
      flash("❌ " + (e.response?.data?.message || "Failed to reject."), false);
    }
    setActionLoading(false);
  };

  const fmt = (d) =>
    new Date(d).toLocaleString(undefined, {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-gray-800">📥 Submitted Proofs</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {total} pending submission{total !== 1 ? "s" : ""} awaiting review
          </p>
        </div>
        <button
          onClick={() => fetchProofs(page)}
          className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      {/* Flash */}
      {msg.text && (
        <div
          className={`p-3 rounded-xl text-sm font-semibold text-center ${
            msg.success ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <i className="fas fa-spinner fa-spin text-orange-400 text-3xl"></i>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <i className="fas fa-check-circle text-green-400 text-4xl mb-3"></i>
          <p className="text-sm font-bold text-gray-600">All caught up!</p>
          <p className="text-xs text-gray-400 mt-1">No pending proofs to review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isExpanded = expanded === item.submissionId;
            const isRejecting = rejectingId === item.submissionId;

            return (
              <div
                key={item.submissionId}
                className="bg-white rounded-2xl shadow overflow-hidden"
              >
                {/* Card header — always visible */}
                <div
                  className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() =>
                    setExpanded(isExpanded ? null : item.submissionId)
                  }
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <i
                      className={`fas ${CATEGORY_ICONS[item.campaignCategory] || "fa-tasks"} text-orange-500 text-sm`}
                    ></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-gray-800 truncate">
                      {item.campaignTitle}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      <i className="fas fa-user mr-1 text-gray-400"></i>
                      {item.user?.fullName || "Unknown"}{" "}
                      <span className="text-gray-300">·</span>{" "}
                      {item.user?.email}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {fmt(item.submittedAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-extrabold text-green-600">
                      +${Number(item.payPerTask).toFixed(4)}
                    </span>
                    <i
                      className={`fas fa-chevron-${isExpanded ? "up" : "down"} text-gray-400 text-xs mt-1`}
                    ></i>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
                    {/* Proof text */}
                    {item.proofText && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wide">
                          Proof Text
                        </p>
                        <p className="text-sm text-gray-700">{item.proofText}</p>
                      </div>
                    )}

                    {/* Proof URL */}
                    {item.proofUrl && (
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-[11px] font-bold text-blue-500 mb-1 uppercase tracking-wide">
                          Proof URL
                        </p>
                        <a
                          href={item.proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 font-semibold underline break-all"
                        >
                          {item.proofUrl}
                        </a>
                      </div>
                    )}

                    {/* Proof images */}
                    {item.proofImageUrls?.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                          Proof Images
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.proofImageUrls.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`proof-${i}`}
                              className="w-20 h-20 object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-80 transition"
                              onClick={() => setLightbox(url)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extra fields */}
                    {item.extraFields &&
                      Object.keys(item.extraFields).length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wide">
                            Extra Fields
                          </p>
                          {Object.entries(item.extraFields).map(([k, v]) => (
                            <p key={k} className="text-xs text-gray-700">
                              <span className="font-bold">{k}:</span> {String(v)}
                            </p>
                          ))}
                        </div>
                      )}

                    {/* Reject reason input */}
                    {isRejecting && (
                      <div>
                        <label className="text-xs font-bold text-gray-500">
                          Rejection Reason
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Explain why this proof is rejected..."
                          rows={2}
                          className="w-full border-2 border-red-200 focus:border-red-400 rounded-xl px-3 py-2 text-sm mt-1 outline-none resize-none"
                        />
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      {!isRejecting ? (
                        <>
                          <button
                            onClick={() => handleApprove(item)}
                            disabled={actionLoading}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            <i className="fas fa-check"></i> Approve & Pay
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(item.submissionId);
                              setRejectReason("");
                            }}
                            disabled={actionLoading}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            <i className="fas fa-times"></i> Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleReject(item)}
                            disabled={actionLoading}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            {actionLoading ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <>
                                <i className="fas fa-times"></i> Confirm Reject
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(null);
                              setRejectReason("");
                            }}
                            className="px-4 bg-gray-100 text-gray-600 text-xs font-bold py-2.5 rounded-xl transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => fetchProofs(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 rounded-xl bg-white shadow text-xs font-bold text-gray-600 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="px-4 py-2 text-xs font-bold text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => fetchProofs(page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-xl bg-white shadow text-xs font-bold text-gray-600 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="proof"
            className="max-w-full max-h-full rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSubmittedProofs;
