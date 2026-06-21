import React from "react";
import { Link } from "react-router-dom";

const S = ({ icon, label, value }) => (
  <div className="rounded-2xl p-5 border border-white/10 text-center"
    style={{ background: "rgba(255,255,255,0.04)" }}>
    <i className={`fas ${icon} text-cyan-400 text-xl mb-2 block`}></i>
    <p className="text-2xl font-extrabold text-white">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

const Landing = () => (
  <div className="min-h-screen text-white overflow-x-hidden"
    style={{ background: "linear-gradient(135deg,#0a1628 0%,#0d2144 60%,#0a3060 100%)", fontFamily: "Poppins,sans-serif" }}>

    {/* NAV */}
    <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>
          <i className="fas fa-rectangle-ad text-white text-sm"></i>
        </div>
        <span className="font-extrabold text-lg">Marine<span style={{ color: "#22d3ee" }}>Panel</span></span>
      </div>
      <div className="flex gap-3">
        <Link to="/login" className="text-sm font-semibold text-gray-400 hover:text-white transition px-4 py-2">Login</Link>
        <Link to="/register"
          className="text-sm font-bold text-white px-5 py-2 rounded-xl transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>
          Get Started
        </Link>
      </div>
    </nav>

    {/* HERO */}
    <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
      <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 border border-cyan-500/30"
        style={{ background: "rgba(6,182,212,0.08)", color: "#67e8f9" }}>
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        World's Growing Ad Network
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
        Run Ads. Display Ads.<br />
        <span style={{ background: "linear-gradient(90deg,#22d3ee,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Get Paid. Every Day.
        </span>
      </h1>
      <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
        Advertise your business across our publisher network or earn by displaying ads on yours. M-Pesa deposits. Instant setup.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
        <Link to="/register"
          className="font-bold text-white px-8 py-4 rounded-2xl text-base transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)", boxShadow: "0 8px 30px rgba(6,182,212,0.25)" }}>
          Start Free <i className="fas fa-arrow-right ml-2"></i>
        </Link>
        <Link to="/login"
          className="font-semibold text-gray-300 px-8 py-4 rounded-2xl text-base transition hover:border-cyan-500 border border-white/20">
          View Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <S icon="fa-users"          value="12K+"     label="Publishers" />
        <S icon="fa-coins"          value="KES 2M+"  label="Paid Out" />
        <S icon="fa-rectangle-ad"   value="500+"     label="Advertisers" />
        <S icon="fa-chart-line"     value="99.9%"    label="Uptime" />
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section className="border-t border-white/10 py-20" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-extrabold text-center mb-2">How It Works</h2>
        <p className="text-center text-gray-500 text-sm mb-12">Up and running in under 5 minutes</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: "fa-user-plus",        step: "01", title: "Create Account",     desc: "Register with phone, email and password. No email verification needed." },
            { icon: "fa-money-bill-wave",  step: "02", title: "Deposit via M-Pesa", desc: "Top up your wallet instantly. Admin confirms your payment." },
            { icon: "fa-chart-line",       step: "03", title: "Launch or Earn",     desc: "Run ad campaigns or become a publisher and earn per impression." },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl p-6 border border-white/10 text-center"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="text-xs font-extrabold text-cyan-400 mb-3">{item.step}</div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20"
                style={{ background: "rgba(6,182,212,0.1)" }}>
                <i className={`fas ${item.icon} text-cyan-400 text-lg`}></i>
              </div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* AD FORMATS */}
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-extrabold text-center mb-2">Ad Formats</h2>
        <p className="text-center text-gray-500 text-sm mb-12">Pick what fits your campaign goal</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "fa-image",            label: "Banner Ads",    desc: "Display ads across top sites" },
            { icon: "fa-video",            label: "Video Ads",     desc: "Pre-roll & mid-roll video" },
            { icon: "fa-mobile-screen",    label: "Mobile Push",   desc: "Direct to phone screens" },
            { icon: "fa-envelope",         label: "Email Blasts",  desc: "Targeted email campaigns" },
            { icon: "fa-magnifying-glass", label: "Search Ads",    desc: "Appear in search results" },
            { icon: "fa-share-nodes",      label: "Social Ads",    desc: "Across social platforms" },
            { icon: "fa-message-sms",      label: "SMS Campaigns", desc: "Bulk SMS to Kenyan numbers" },
            { icon: "fa-store",            label: "Native Ads",    desc: "Blend into publisher content" },
          ].map((f) => (
            <div key={f.label} className="rounded-2xl p-4 border border-white/10 hover:border-cyan-500/40 transition"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <i className={`fas ${f.icon} text-cyan-400 text-xl mb-3 block`}></i>
              <p className="font-bold text-white text-sm">{f.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ADVERTISER vs PUBLISHER */}
    <section className="py-20 border-t border-white/10" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl p-7 border border-cyan-500/20"
          style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.08),rgba(59,130,246,0.08))" }}>
          <i className="fas fa-bullhorn text-cyan-400 text-2xl mb-4 block"></i>
          <h3 className="text-xl font-extrabold text-white mb-2">I'm an Advertiser</h3>
          <p className="text-gray-400 text-sm mb-5">Reach thousands of Kenyans with targeted campaigns. Pay only for results.</p>
          <ul className="space-y-2 text-sm text-gray-300 mb-6">
            {["Set budget & targeting","Real-time analytics dashboard","Multiple ad formats","Start from KES 500"].map(t => (
              <li key={t}><i className="fas fa-check text-cyan-400 mr-2 text-xs"></i>{t}</li>
            ))}
          </ul>
          <Link to="/register" className="block text-center font-bold text-white py-3 rounded-xl transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>
            Launch Campaign
          </Link>
        </div>

        <div className="rounded-3xl p-7 border border-purple-500/20"
          style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.08),rgba(59,130,246,0.08))" }}>
          <i className="fas fa-store text-purple-400 text-2xl mb-4 block"></i>
          <h3 className="text-xl font-extrabold text-white mb-2">I'm a Publisher</h3>
          <p className="text-gray-400 text-sm mb-5">Monetize your website, app, or audience. Earn per impression or click.</p>
          <ul className="space-y-2 text-sm text-gray-300 mb-6">
            {["Earn per 1,000 views (CPM)","Easy ad code embed","Weekly payouts via M-Pesa","Resell ad slots to clients"].map(t => (
              <li key={t}><i className="fas fa-check text-purple-400 mr-2 text-xs"></i>{t}</li>
            ))}
          </ul>
          <Link to="/register" className="block text-center font-bold text-white py-3 rounded-xl transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#3b82f6)" }}>
            Become a Publisher
          </Link>
        </div>
      </div>
    </section>

    {/* FOOTER */}
    <footer className="border-t border-white/10 py-8 text-center text-gray-600 text-xs">
      © 2025 MarineAds · Built for Kenya
    </footer>
  </div>
);

export default Landing;
