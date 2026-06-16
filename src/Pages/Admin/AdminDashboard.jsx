import React from "react";

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      <i className={`fas ${icon} text-white text-sm`}></i>
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-extrabold text-white">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const users    = JSON.parse(localStorage.getItem("mp_users")    || "[]");
  const deposits = JSON.parse(localStorage.getItem("mp_deposits") || "[]");
  const totalDeposited = deposits.reduce((s, d) => s + Number(d.amount), 0);
  const pending  = deposits.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-5" style={{ fontFamily: "Poppins, sans-serif" }}>
      <h2 className="text-lg font-extrabold text-white">Overview</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon="fa-users"       label="Total Users"     value={users.length}                       color="bg-blue-600" />
        <StatCard icon="fa-wallet"      label="Deposit Requests" value={deposits.length}                   color="bg-purple-600" />
        <StatCard icon="fa-clock"       label="Pending"         value={pending}                            color="bg-yellow-600" />
        <StatCard icon="fa-coins"       label="Total KES"       value={`${totalDeposited.toLocaleString()}`} color="bg-green-600" />
      </div>

      {/* RECENT DEPOSITS */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3">Recent Deposit Requests</h3>
        {deposits.length === 0
          ? <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-gray-500 text-sm">No deposits yet</div>
          : deposits.slice(-5).reverse().map((d) => (
            <div key={d.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-2">
              <div>
                <p className="text-white text-sm font-semibold">{d.userName}</p>
                <p className="text-gray-500 text-xs">{d.mpesaPhone} · {new Date(d.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-cyan-400 font-extrabold">KES {Number(d.amount).toLocaleString()}</p>
                <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-lg font-semibold">Pending</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default AdminDashboard;
