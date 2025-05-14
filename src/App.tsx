
import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import ConfirmRegistration from "@/pages/ConfirmRegistration";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Establishments from "@/pages/Establishments";
import Carriers from "@/pages/Carriers";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/NotFound";
import PudoPoints from "@/pages/PudoPoints";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "confirm-registration",
        element: <ConfirmRegistration />,
      }
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/users",
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/establishments",
    element: (
      <ProtectedRoute>
        <Establishments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/establishments/pudo",
    element: (
      <ProtectedRoute>
        <PudoPoints />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/carriers",
    element: (
      <ProtectedRoute>
        <Carriers />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
      <SonnerToaster position="top-right" expand={true} richColors />
    </AuthProvider>
  );
}

export default App;
