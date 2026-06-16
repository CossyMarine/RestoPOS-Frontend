import React, { useState } from "react";

const SAMPLE_ADS = [
  { id: 1, title: "Promote Your Business on Facebook", category: "Social Media", price: 500, views: "5K–10K", duration: "7 days", badge: "Popular" },
  { id: 2, title: "Google Display Network Banner", category: "Display", price: 1200, views: "20K–50K", duration: "14 days", badge: "Best Value" },
  { id: 3, title: "WhatsApp Broadcast Campaign", category: "Messaging", price: 300, views: "1K–3K", duration: "3 days", badge: null },
  { id: 4, title: "YouTube Pre-Roll Ad", category: "Video", price: 2000, views: "50K–100K", duration: "30 days", badge: "Premium" },
  { id: 5, title: "Instagram Story Ad", category: "Social Media", price: 800, views: "10K–20K", duration: "7 days", badge: null },
  { id: 6, title: "SMS Blast to Kenyan Numbers", category: "SMS", price: 400, views: "2K–5K", duration: "1 day", badge: "Fast" },
];

const CATS = ["All", "Social Media", "Display", "Video", "SMS", "Messaging"];

const AdsPage = () => {
  const [cat, setCat] = useState("All");
  const [booked, setBooked] = useState(null);

  const filtered = cat === "All" ? SAMPLE_ADS : SAMPLE_ADS.filter((a) => a.category === cat);

  return (
    <div className="space-y-5 py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div>
        <h2 className="text-xl font-extrabold text-white">Ad Packages</h2>
        <p className="text-gray-500 text-xs mt-0.5">Pick a package and launch your campaign</p>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition ${cat === c ? "bg-cyan-500 text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:border-cyan-500/50"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="space-y-3">
        {filtered.map((ad) => (
          <div key={ad.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-cyan-500/30 transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                {ad.badge && (
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold mr-2">{ad.badge}</span>
                )}
                <span className="text-[10px] text-gray-500">{ad.category}</span>
                <h3 className="text-white font-bold text-sm mt-1">{ad.title}</h3>
              </div>
              <p className="text-cyan-400 font-extrabold text-lg ml-3">KES {ad.price.toLocaleString()}</p>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">Views</p>
                <p className="text-xs font-bold text-white">{ad.views}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-xs font-bold text-white">{ad.duration}</p>
              </div>
            </div>
            <button
              onClick={() => setBooked(ad.id)}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition ${booked === ad.id ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90"}`}>
              {booked === ad.id ? <><i className="fas fa-check mr-2"></i>Booked!</> : "Book This Package"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsPage;
