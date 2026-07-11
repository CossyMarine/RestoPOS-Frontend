import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, LogOut, Phone, Mail } from "lucide-react";
import BottomNav from "../components/BottomNav";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const ROLE_ROUTE = {
  admin: "/dashboard",
  manager: "/dashboard",
  accountant: "/dashboard",
  cashier: "/dashboard",
  waiter: "/waiter",
  kitchen: "/kitchen",
  customer: "/profile",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [tab, setTab] = useState("login"); // "login" | "register"

  useEffect(() => {
    if (user && user.role !== "customer") {
      navigate(ROLE_ROUTE[user.role] || "/order", { replace: true });
    }
  }, [user, navigate]);

  const handleAuthSuccess = (loggedInUser) => {
    if (loggedInUser.role !== "customer") {
      navigate(ROLE_ROUTE[loggedInUser.role] || "/order", { replace: true });
      return;
    }
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setTab("login");
  };

  // Logged-in customer view
  if (user) {
    return (
      <div className="min-h-screen bg-stone-50 pb-24">
        <header className="bg-white border-b border-stone-200 px-5 py-4">
          <h1 className="text-lg font-black text-stone-900">Profile</h1>
        </header>

        <div className="max-w-md mx-auto px-5 mt-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
              <UserCircle size={36} className="text-orange-500" />
            </div>
            <h2 className="font-black text-stone-900 text-lg">{user.fullName}</h2>
            <p className="text-stone-400 text-sm">@{user.username}</p>

            <div className="mt-4 space-y-2 text-left">
              {user.email && (
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Mail size={15} className="text-orange-400" /> {user.email}
                </div>
              )}
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Phone size={15} className="text-orange-400" /> {user.phone}
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  // Logged-out: login / register toggle
  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <header className="bg-white border-b border-stone-200 px-5 py-4">
        <h1 className="text-lg font-black text-stone-900 flex items-center gap-2">
          🍴 Resto<span className="text-orange-500">POS</span>
        </h1>
        <p className="text-xs text-stone-400">Sign in or create an account</p>
      </header>

      <div className="max-w-md mx-auto px-5 mt-6">
        <div className="flex rounded-xl overflow-hidden border border-stone-200 mb-6 bg-white">
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${
                tab === t ? "bg-orange-500 text-white" : "text-stone-500"
              }`}
            >
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6">
          {tab === "login" ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <RegisterForm onSuccess={handleAuthSuccess} />
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
