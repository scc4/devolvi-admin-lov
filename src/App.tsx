
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import ConfirmRegistration from "./pages/ConfirmRegistration";
import Carriers from "./pages/Carriers";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import EstablishmentsWithDI from "./pages/EstablishmentsWithDI";
import UsersDDD from "./pages/UsersDDD";

function App() {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
      <Layout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
        <Outlet />
      </Layout>
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
        <Route path="users" element={<UsersDDD />} /> {/* Using DDD version */}
        <Route path="carriers" element={<Carriers />} />
        <Route path="establishments" element={<EstablishmentsWithDI />} /> {/* Using DI version */}
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
