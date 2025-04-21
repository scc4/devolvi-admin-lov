
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout() {
  const navigate = useNavigate();
  // This would check for authentication status once Supabase is connected
  const isAuthenticated = false; // Replace with actual auth check
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 pl-[20px] lg:pl-[256px] transition-all">
          <div className="p-4 md:p-6">
            <div className="flex items-center mb-6">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
