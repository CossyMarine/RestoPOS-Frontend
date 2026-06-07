import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const FAQ = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/faq")
      .then((res) => setFaqs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = faqs.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 pt-12 pb-20 px-4 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Back button */}
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
            <i className="fas fa-circle-question text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Help Center</h1>
          <p className="text-orange-100 text-sm max-w-xs mx-auto">
            Everything you need to know. Can't find an answer? Reach out to us.
          </p>
        </div>

        {/* Search — floats over the wave */}
        <div className="relative z-10 max-w-lg mx-auto mt-6">
          <div className="relative">
            <i className="fas fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a question..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
            />
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="-mt-6 overflow-hidden">
        <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none" style={{ height: 40 }}>
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z"
            fill="rgb(255,247,237)"
            className="fill-orange-50"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pb-16 -mt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-orange-400">
            <i className="fas fa-spinner fa-spin text-4xl mb-4" />
            <p className="text-sm font-semibold">Loading FAQs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <i className="fas fa-face-meh text-5xl mb-4" />
            <p className="text-base font-bold text-gray-500">No results found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">
              {filtered.length} Question{filtered.length !== 1 ? "s" : ""}
            </p>

            {filtered.map((faq, idx) => {
              const isOpen = openId === faq._id;
              return (
                <div
                  key={faq._id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm cursor-pointer select-none ${
                    isOpen
                      ? "border-orange-300 bg-white shadow-orange-100 shadow-md"
                      : "border-orange-100 bg-white hover:border-orange-200 hover:shadow-md"
                  }`}
                  onClick={() => toggle(faq._id)}
                >
                  {/* Question Row */}
                  <div className="flex items-center gap-4 px-5 py-4">
                    {/* Number bubble */}
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                        isOpen
                          ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                          : "bg-orange-50 text-orange-400"
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <p className={`flex-1 font-bold text-sm ${isOpen ? "text-orange-600" : "text-gray-800"}`}>
                      {faq.title}
                    </p>

                    <div
                      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isOpen ? "bg-orange-100 text-orange-500 rotate-45" : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      <i className="fas fa-plus text-xs" />
                    </div>
                  </div>

                  {/* Answer */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="px-5 pb-5">
                      <div className="ml-12 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-4">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{faq.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && faqs.length > 0 && (
          <div className="mt-10 text-center bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
            <i className="fas fa-headset text-orange-400 text-2xl mb-2 block" />
            <p className="text-sm font-bold text-gray-700">Still have questions?</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Our support team is here to help you.</p>
            <button
              onClick={() => navigate("/chat")}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition shadow-md shadow-orange-200"
            >
              <i className="fas fa-message mr-2" />
              Chat with Support
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
