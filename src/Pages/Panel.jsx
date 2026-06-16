import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";

const Panel = () => {
  const { user } = useAuth();
  const key = `mp_panel_${user?.id}`;
  const [panel, setPanel] = useState(() => JSON.parse(localStorage.getItem(key) || "null"));
  const [form, setForm] = useState({ name: "", tagline: "", markup: "20" });
  const [step, setStep] = useState("view"); // view | create
  const [clients, setClients] = useState(() => JSON.parse(localStorage.getItem(`${key}_clients`) || "[]"));
  const [clientForm, setClientForm] = useState({ name: "", phone: "", budget: "" });
  const [addingClient, setAddingClient] = useState(false);

  const createPanel = () => {
    if (!form.name) return;
    const p = { ...form, createdAt: new Date().toISOString(), active: true };
    localStorage.setItem(key, JSON.stringify(p));
    setPanel(p);
    setStep("view");
  };

  const addClient = () => {
    if (!clientForm.name || !clientForm.phone) return;
    const c = { ...clientForm, id: Date.now(), addedAt: new Date().toISOString() };
    const updated = [...clients, c];
    localStorage.setItem(`${key}_clients`, JSON.stringify(updated));
    setClients(updated);
    setClientForm({ name: "", phone: "", budget: "" });
    setAddingClient(false);
  };

  if (!panel || step === "create") return (
    <div className="py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
      <h2 className="text-xl font-extrabold text-white mb-1">Create Your Panel</h2>
      <p className="text-gray-500 text-xs mb-5">Set up your mini ad reseller panel and start selling ad packages to clients.</p>

      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-4 mb-5">
        <p className="text-purple-400 font-bold text-sm mb-1"><i className="fas fa-store mr-2"></i>How Reselling Works</p>
        <p className="text-gray-400 text-xs">You buy ad packages from MarineAds at base price, set your own markup, and resell to your clients. You keep the difference.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-400">Panel Name</label>
          <input placeholder="e.g. NairobiAds Pro"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white rounded-xl px-4 py-3 text-sm mt-1 outline-none transition placeholder-gray-600"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400">Tagline</label>
          <input placeholder="e.g. Affordable ads for SMEs"
            value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white rounded-xl px-4 py-3 text-sm mt-1 outline-none transition placeholder-gray-600"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400">Default Markup %</label>
          <div className="flex gap-2 mt-1 flex-wrap">
            {["10", "15", "20", "25", "30"].map((m) => (
              <button key={m} onClick={() => setForm({ ...form, markup: m })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${form.markup === m ? "bg-cyan-500 text-white" : "bg-white/5 border border-white/10 text-gray-400"}`}>
                +{m}%
              </button>
            ))}
          </div>
        </div>

        <button onClick={createPanel}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:opacity-90 transition text-white font-bold rounded-xl py-3 text-sm mt-2">
          <i className="fas fa-rocket mr-2"></i>Launch My Panel
        </button>
      </div>
    </div>
  );

  // Panel view
  const totalRevenue = clients.reduce((s, c) => s + Number(c.budget || 0), 0);
  const commission = Math.round(totalRevenue * (Number(panel.markup) / 100));

  return (
    <div className="space-y-5 py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* PANEL HEADER */}
      <div className="bg-gradient-to-br from-purple-500/20 to-blue-600/20 border border-purple-500/20 rounded-3xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <i className="fas fa-store text-white text-lg"></i>
          </div>
          <div>
            <h2 className="text-white font-extrabold text-lg">{panel.name}</h2>
            <p className="text-gray-400 text-xs">{panel.tagline}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-lg font-extrabold text-white">{clients.length}</p>
            <p className="text-[10px] text-gray-500">Clients</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-lg font-extrabold text-cyan-400">KES {totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-gray-500">Ad Spend</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-lg font-extrabold text-green-400">KES {commission.toLocaleString()}</p>
            <p className="text-[10px] text-gray-500">Your Earn</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">Markup: <span className="text-cyan-400 font-bold">+{panel.markup}%</span></span>
          <button onClick={() => { setPanel(null); setStep("create"); }}
            className="text-xs text-gray-500 hover:text-red-400 transition">
            <i className="fas fa-edit mr-1"></i>Edit Panel
          </button>
        </div>
      </div>

      {/* CLIENTS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Your Clients</p>
          <button onClick={() => setAddingClient(!addingClient)}
            className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg font-semibold hover:bg-cyan-500/30 transition">
            <i className="fas fa-plus mr-1"></i>Add Client
          </button>
        </div>

        {/* ADD CLIENT FORM */}
        {addingClient && (
          <div className="bg-white/5 border border-cyan-500/20 rounded-2xl p-4 mb-3 space-y-3">
            <p className="text-white font-bold text-sm">New Client</p>
            <input placeholder="Client Name"
              value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition placeholder-gray-600"
            />
            <input placeholder="Phone Number"
              value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition placeholder-gray-600"
            />
            <input type="number" placeholder="Ad Budget (KES)"
              value={clientForm.budget} onChange={(e) => setClientForm({ ...clientForm, budget: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition placeholder-gray-600"
            />
            <div className="flex gap-2">
              <button onClick={addClient} className="flex-1 bg-cyan-500 text-white font-bold rounded-xl py-2 text-sm hover:bg-cyan-400 transition">Add</button>
              <button onClick={() => setAddingClient(false)} className="flex-1 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-xl py-2 text-sm">Cancel</button>
            </div>
          </div>
        )}

        {clients.length === 0
          ? <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-gray-500 text-sm">No clients yet. Add your first client above.</div>
          : clients.map((c) => (
            <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-2">
              <div>
                <p className="text-white font-semibold text-sm">{c.name}</p>
                <p className="text-gray-500 text-xs">{c.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-cyan-400 font-extrabold text-sm">KES {Number(c.budget || 0).toLocaleString()}</p>
                <p className="text-gray-600 text-xs">budget</p>
              </div>
            </div>
          ))
        }
      </div>

      {/* AD PACKAGES TO RESELL */}
      <div>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Packages to Resell</p>
        {[
          { name: "Starter Pack", base: 500, cat: "Social Media" },
          { name: "Growth Pack",  base: 1200, cat: "Display" },
          { name: "Pro Pack",     base: 2000, cat: "Video" },
        ].map((p) => {
          const sell = Math.round(p.base * (1 + Number(panel.markup) / 100));
          return (
            <div key={p.name} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-2">
              <div>
                <p className="text-white font-semibold text-sm">{p.name}</p>
                <p className="text-gray-500 text-xs">{p.cat}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 line-through">KES {p.base}</p>
                <p className="text-cyan-400 font-extrabold text-sm">KES {sell.toLocaleString()}</p>
                <p className="text-green-400 text-[10px]">+KES {sell - p.base} profit</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Panel;
