import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import TopBar from "../Components/TopBar";
import BottomNav from "../Components/BottomNav";

export default function SubmitProof() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState("");

  const [proofText, setProofText]           = useState("");
  const [proofUrl, setProofUrl]             = useState("");
  const [images, setImages]                 = useState([]); // [{ file, preview, uploading, url }]

  useEffect(() => {
    API.get(`/campaign/${id}`)
      .then((r) => setCampaign(r.data.campaign))
      .catch(() => setError("Failed to load campaign."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      url: null,
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const uploadImages = async () => {
    const uploaded = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img.url) { uploaded.push(img.url); continue; }
      setImages((prev) => prev.map((x, idx) => idx === i ? { ...x, uploading: true } : x));
      try {
        const base64 = await toBase64(img.file);
        const res = await API.post("/campaign/upload-image", {
          imageBase64: base64.split(",")[1],
          mimeType: img.file.type,
        });
        uploaded.push(res.data.url);
        setImages((prev) => prev.map((x, idx) => idx === i ? { ...x, uploading: false, url: res.data.url } : x));
      } catch {
        throw new Error("Image upload failed. Please try again.");
      }
    }
    return uploaded;
  };

  const toBase64 = (file) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = () => rej();
      r.readAsDataURL(file);
    });

  const handleSubmit = async () => {
    setError("");
    if (!proofText.trim() && images.length === 0 && !proofUrl.trim())
      return setError("Please provide at least a description, link, or image as proof.");

    setSubmitting(true);
    try {
      const proofImageUrls = await uploadImages();
      await API.post(`/campaign/${id}/submit`, {
        proofText: proofText.trim(),
        proofUrl: proofUrl.trim(),
        proofImageUrls,
      });
      setDone(true);
    } catch (e) {
      setError(e.message || e.response?.data?.message || "Submission failed.");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="bg-gray-100 min-h-screen pb-28">
      <TopBar />
      <p className="text-center text-orange-500 animate-pulse font-bold py-20 text-sm">Loading campaign...</p>
      <BottomNav />
    </div>
  );

  if (done) return (
    <div className="bg-gray-100 min-h-screen pb-28">
      <TopBar />
      <div className="mx-4 mt-10 flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow">
          <i className="fas fa-check-circle text-green-500 text-4xl"></i>
        </div>
        <h2 className="text-lg font-extrabold text-gray-800">Proof Submitted!</h2>
        <p className="text-sm text-gray-500 max-w-xs">
          Your proof is under review. You'll be rewarded once the campaign owner approves it — usually within <span className="font-semibold text-green-600">48 hours</span>.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => navigate("/task-status")}
            className="bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow"
          >
            View Task Status
          </button>
          <button
            onClick={() => navigate("/campaigns")}
            className="bg-white border-2 border-gray-200 text-gray-600 font-bold px-5 py-2.5 rounded-xl text-sm"
          >
            More Tasks
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen pb-28">
      <TopBar />

      <div className="mx-3 mt-4 space-y-4">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 font-semibold">
          <i className="fas fa-arrow-left"></i> Back
        </button>

        {/* Campaign summary card */}
        {campaign && (
          <div className="bg-white rounded-2xl shadow p-4 flex items-start gap-3">
            <div className="bg-orange-50 rounded-xl w-11 h-11 flex items-center justify-center shrink-0">
              <i className="fas fa-tasks text-orange-500 text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-gray-800 text-sm">{campaign.title}</p>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{campaign.description}</p>
              <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                💰 ${Number(campaign.payPerTask).toFixed(3)} reward
              </span>
            </div>
          </div>
        )}

        {/* ⚠️ Warning banner */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex gap-3">
          <i className="fas fa-exclamation-triangle text-red-500 text-lg mt-0.5 shrink-0"></i>
          <div>
            <p className="text-sm font-extrabold text-red-600 mb-1">⚠️ Read Before Submitting</p>
            <ul className="text-xs text-red-500 space-y-1 list-disc pl-3">
              <li>Submitting <span className="font-bold">irrelevant, fake, or low-quality</span> images will result in <span className="font-bold">instant rejection</span></li>
              <li>Repeated bad submissions may lead to <span className="font-bold">account suspension</span></li>
              <li>Screenshots must clearly show the completed task</li>
              <li>Do <span className="font-bold">not</span> submit other people's proofs</li>
            </ul>
          </div>
        </div>

        {/* Instructions from campaign owner */}
        {campaign?.instructions && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex gap-3">
            <i className="fas fa-clipboard-list text-blue-500 text-lg mt-0.5 shrink-0"></i>
            <div>
              <p className="text-sm font-extrabold text-blue-700 mb-1">📋 Task Instructions</p>
              <p className="text-xs text-blue-600 leading-relaxed">{campaign.instructions}</p>
            </div>
          </div>
        )}

        {/* Target URL */}
        {campaign?.targetUrl && (
          <a
            href={campaign.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-2xl shadow p-4 border-2 border-dashed border-orange-300"
          >
            <div className="bg-orange-100 rounded-xl w-9 h-9 flex items-center justify-center shrink-0">
              <i className="fas fa-external-link-alt text-orange-500 text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-700">Open Task Link</p>
              <p className="text-xs text-orange-500 truncate">{campaign.targetUrl}</p>
            </div>
            <i className="fas fa-chevron-right text-gray-300 text-xs shrink-0"></i>
          </a>
        )}

        {/* Example images */}
        {campaign?.exampleImageUrls?.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-xs font-bold text-gray-600 mb-3">🖼 Example Proof (from poster)</p>
            <div className="flex gap-2 flex-wrap">
              {campaign.exampleImageUrls.map((url, i) => (
                <img key={i} src={url} alt={`example-${i}`}
                  className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200" />
              ))}
            </div>
          </div>
        )}

        {/* Proof form */}
        <div className="bg-white rounded-2xl shadow p-4 space-y-4">
          <p className="text-sm font-extrabold text-gray-800">📝 Submit Your Proof</p>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Description <span className="text-gray-400 font-normal">(explain what you did)</span>
            </label>
            <textarea
              value={proofText}
              onChange={(e) => setProofText(e.target.value)}
              rows={3}
              placeholder="e.g. I followed the account @example and liked the pinned post. My username is @myuser."
              className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
            />
          </div>

          {/* Proof URL */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Proof Link <span className="text-gray-400 font-normal">(optional — paste a URL)</span>
            </label>
            <div className="relative">
              <i className="fas fa-link absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://..."
                className="w-full border-2 border-gray-200 focus:border-orange-400 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none"
              />
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Screenshots / Images <span className="text-gray-400 font-normal">(optional)</span>
            </label>

            {/* Image grid */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img src={img.preview} alt={`proof-${i}`}
                      className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200" />
                    {img.uploading && (
                      <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                        <i className="fas fa-spinner fa-spin text-white text-lg"></i>
                      </div>
                    )}
                    {!img.uploading && (
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:border-orange-400 transition">
              <i className="fas fa-camera text-orange-400 text-xl"></i>
              <div>
                <p className="text-xs font-bold text-gray-700">Tap to add screenshots</p>
                <p className="text-[10px] text-gray-400">JPG, PNG — max 5MB each</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageAdd}
              />
            </label>

            {/* Irrelevant image warning */}
            <div className="mt-2 flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
              <i className="fas fa-exclamation-circle text-yellow-500 text-xs mt-0.5 shrink-0"></i>
              <p className="text-[10px] text-yellow-700 leading-relaxed">
                Only upload <span className="font-bold">relevant screenshots</span> showing your completed task. Uploading unrelated, downloaded, or stock images will result in rejection and may get your account flagged.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl px-4 py-3 flex items-center gap-2">
            <i className="fas fa-times-circle text-red-500"></i>
            <p className="text-sm text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-lg transition flex items-center justify-center gap-2"
        >
          {submitting
            ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</>
            : <><i className="fas fa-paper-plane"></i> Submit Proof</>}
        </button>

      </div>
      <BottomNav />
    </div>
  );
}
