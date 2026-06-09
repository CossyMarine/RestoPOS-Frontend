import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import TopBar from "../Components/TopBar";
import BottomNav from "../Components/BottomNav";
import BadgeIcon from "../Components/BadgeIcon";

const COUNTRY_ISO = {
  Nigeria: "ng", Kenya: "ke", Ghana: "gh", "South Africa": "za",
  Tanzania: "tz", Uganda: "ug", Ethiopia: "et", Egypt: "eg",
  "United States": "us", "United Kingdom": "gb", Canada: "ca",
  India: "in", Pakistan: "pk", Bangladesh: "bd", Philippines: "ph",
  Indonesia: "id", Brazil: "br", Germany: "de", France: "fr",
};

const Flag = ({ country }) => {
  const code = COUNTRY_ISO[country] || country?.toLowerCase().slice(0, 2);
  if (!code) return null;
  return (
    <img
      src={`https://flagcdn.com/24x18/${code}.png`}
      alt={country}
      className="w-5 h-3.5 rounded-sm object-cover inline-block"
      onError={(e) => { e.target.style.display = "none"; }}
    />
  );
};

const rankStyle = (i) => {
  if (i === 0) return { ring: "ring-2 ring-yellow-400", label: "🥇", bg: "bg-yellow-50" };
  if (i === 1) return { ring: "ring-2 ring-gray-400",   label: "🥈", bg: "bg-gray-50"   };
  if (i === 2) return { ring: "ring-2 ring-orange-400", label: "🥉", bg: "bg-orange-50" };
  return { ring: "", label: `#${i + 1}`, bg: "bg-white" };
};

export default function TopEarners() {
  const navigate = useNavigate();
  const [earners, setEarners] = useState([]);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/top-earners")
      .then((res) => {
        setVisible(res.data.visible);
        setEarners(res.data.earners || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      <TopBar />

      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-arrow-left text-lg" />
        </button>
        <h1 className="text-lg font-extrabold text-gray-800">🏆 Top Earners</h1>
      </div>

      <p className="text-xs text-gray-400 text-center mb-4">
        Rolling 24-hour leaderboard · Updates live
      </p>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !visible ? (
        <div className="mx-4 bg-white rounded-2xl shadow p-10 text-center">
          <p className="text-4xl mb-3">🔒</p>
          <p className="text-gray-500 font-semibold">Top Earners is currently hidden.</p>
          <p className="text-xs text-gray-400 mt-1">Check back later!</p>
        </div>
      ) : earners.length === 0 ? (
        <div className="mx-4 bg-white rounded-2xl shadow p-10 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500 font-semibold">No earners yet today.</p>
          <p className="text-xs text-gray-400 mt-1">Be the first to earn!</p>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {earners.map((e, i) => {
            const { ring, label, bg } = rankStyle(i);
            return (
              <div key={e._id} className={`${bg} rounded-2xl shadow flex items-center gap-4 px-4 py-3 ${ring}`}>

                {/* Rank */}
                <div className="w-8 text-center shrink-0">
                  <span className={`font-extrabold ${i < 3 ? "text-xl" : "text-sm text-gray-500"}`}>
                    {label}
                  </span>
                </div>

                {/* Avatar */}
                <div className="relative shrink-0">
                  {e.photo ? (
                    <img
                      src={e.photo}
                      alt={e.firstName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-extrabold text-orange-500 text-lg">
                      {e.firstName?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>

                {/* Name + badge + country */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-gray-800 text-sm truncate">{e.firstName}</p>
                    {e.badge && !e.badge.hidden && <BadgeIcon badge={e.badge} size={15} />}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Flag country={e.country} />
                    <span className="text-[10px] text-gray-400">{e.country || "—"}</span>
                  </div>
                </div>

                {/* Earnings */}
                <div className="text-right shrink-0">
                  <p className="text-green-600 font-extrabold text-sm">
                    +${Number(e.totalEarned).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-gray-400">last 24h</p>
                </div>

              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
                                                     }
