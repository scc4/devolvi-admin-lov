
import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import ConfirmRegistration from "./pages/ConfirmRegistration";
import Carriers from "./pages/Carriers";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/layout/DashboardLayout";
import Establishments from "./pages/Establishments";
import Users from "./pages/Users";

function App() {
  const { user, loading } = useAuth();

  // If still loading auth state, show a loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const ProtectedRoute = ({ redirectTo }: { redirectTo: string }) => {
    return user ? (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    ) : (
      <Navigate to={redirectTo} />
    );
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/confirm-registration" element={<ConfirmRegistration />} />
      
      <Route path="/dashboard" element={<ProtectedRoute redirectTo="/login" />}>
        <Route path="" element={<Dashboard />} />
        <Route path="users" element={<Users />} /> {/* Using standardized DDD version */}
        <Route path="carriers" element={<Carriers />} />
        <Route path="establishments" element={<Establishments />} /> {/* Using standardized DDD version */}
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
