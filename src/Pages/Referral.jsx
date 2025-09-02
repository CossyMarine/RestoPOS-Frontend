import React, { useContext } from "react";
import { ReferralContext } from "../Context/ReferralContext";

const Referral = () => {
  const { referral, loading } = useContext(ReferralContext);

  if (loading) return <p>Loading referral data...</p>;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referral.referralLink);
    alert("Referral link copied!");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Referral Program</h2>

      {/* Referral link */}
      <div className="bg-gray-100 p-4 rounded-xl mb-6">
        <p className="mb-2">Your referral link:</p>
        <div className="flex items-center">
          <input
            type="text"
            value={referral.referralLink}
            readOnly
            className="flex-1 p-2 border rounded-l-xl"
          />
          <button
            onClick={copyToClipboard}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-xl"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 shadow rounded-xl text-center">
          <p className="text-lg font-bold">${referral.totalEarned.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Earned</p>
        </div>
        <div className="p-4 shadow rounded-xl text-center">
          <p className="text-lg font-bold">{referral.totalMembers}</p>
          <p className="text-sm text-gray-500">Members</p>
        </div>
        <div className="p-4 shadow rounded-xl text-center">
          <p className="text-lg font-bold">Lv {referral.level}</p>
          <p className="text-sm text-gray-500">Level</p>
        </div>
      </div>

      {/* Badge */}
      <div className="flex justify-center mb-6">
        <img
          src={referral.badge}
          alt="Referral Badge"
          className="w-20 h-20 object-contain"
        />
      </div>

      {/* Members List */}
      <h3 className="text-lg font-semibold mb-2">Your Referrals</h3>
      <ul className="border rounded divide-y">
        {referral.members.length > 0 ? (
          referral.members.map((m, i) => (
            <li key={i} className="p-3 flex justify-between">
              <span>{m.name || "Unnamed"}</span>
              <span className="text-gray-500 text-sm">Lv {m.level || 1}</span>
              <span className="text-gray-400 text-sm">
                {new Date(m.joined).toLocaleDateString()}
              </span>
            </li>
          ))
        ) : (
          <li className="p-3 text-gray-500">No referrals yet.</li>
        )}
      </ul>
    </div>
  );
};

export default Referral;