import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";

// Eager load critical components
import DashboardLayout from "./components/layout/DashboardLayout";
import Auth from "./pages/Auth";

// Lazy load non-critical pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const Carriers = lazy(() => import("./pages/Carriers"));
const Establishments = lazy(() => import("./pages/Establishments"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ConfirmRegistration = lazy(() => import("./pages/ConfirmRegistration"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

const LoadingFallback = () => (
  <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center p-4">
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-64 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  </div>
);

const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route 
              path="/auth/confirm" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ConfirmRegistration />
                </Suspense>
              } 
            />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={
                <Suspense fallback={<LoadingFallback />}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="/dashboard/users" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Users />
                </Suspense>
              } />
              <Route path="/dashboard/carriers" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Carriers />
                </Suspense>
              } />
              <Route path="/dashboard/establishments" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Establishments />
                </Suspense>
              } />
            </Route>
            <Route path="/users" element={<Navigate to="/dashboard/users" replace />} />
            <Route path="*" element={
              <Suspense fallback={<LoadingFallback />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
