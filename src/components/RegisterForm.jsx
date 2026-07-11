import { useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";

export default function RegisterForm({ onSuccess }) {
  const [method, setMethod] = useState("phone"); // "phone" | "email"
  const [contact, setContact] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register-customer", {
        method,
        contact,
        username,
        fullName,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Account created!");
      onSuccess?.(res.data.user);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Sign up with</label>
        <div className="flex rounded-xl overflow-hidden border border-stone-300">
          {["phone", "email"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMethod(m); setContact(""); }}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                method === m ? "bg-orange-500 text-white" : "bg-white text-stone-500"
              }`}
            >
              {m === "phone" ? "Phone" : "Email"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">
          {method === "phone" ? "Phone number" : "Email address"}
        </label>
        <input
          type={method === "phone" ? "tel" : "email"}
          placeholder={method === "phone" ? "07XX XXX XXX" : "you@example.com"}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Full name</label>
        <input
          type="text"
          placeholder="Jane Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Username</label>
        <input
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Password</label>
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
      >
        {loading ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
