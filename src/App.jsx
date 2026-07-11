import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CashierPage from "./pages/CashierPage";
import WaiterPage from "./pages/WaiterPage";
import KitchenPage from "./pages/KitchenPage";
import CustomerPage from "./pages/CustomerPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/profile" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/order" replace />} />

        {/* Customer-facing, no login required */}
        <Route path="/order" element={<CustomerPage />} />
        <Route path="/orders" element={<OrdersPage />} />

        {/* One login/register page for everyone, lives in the Profile tab */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Navigate to="/profile" replace />} />
        <Route path="/register" element={<Navigate to="/profile" replace />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <CashierPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/waiter"
          element={
            <PrivateRoute>
              <WaiterPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/kitchen"
          element={
            <PrivateRoute>
              <KitchenPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/order" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
