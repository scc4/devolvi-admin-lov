
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";

const ResponsiveSidebarHandler = () => {
  const { isMobile } = useIsMobile();
  const { setOpen } = useSidebar();
  
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile, setOpen]);
  
  return null;
};

export default function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <ResponsiveSidebarHandler />
      <div className="min-h-screen flex w-full bg-[#f5f9ff]">
        <AppSidebar />
        <div className="flex-1 pl-[20px] lg:pl-[280px] transition-all">
          <div className="p-4 md:p-6">
            <div className="flex items-center mb-6">
              <SidebarTrigger className="mr-4 text-gray-500 hover:text-primary" />
              <h1 className="text-xl md:text-2xl font-semibold text-[#2a3547]">Dashboard</h1>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
