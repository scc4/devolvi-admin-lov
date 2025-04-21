
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
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 pl-[20px] lg:pl-[256px] transition-all">
          <div className="p-2 md:p-6">
            <div className="flex items-center mb-4 md:mb-6">
              <SidebarTrigger className="mr-2 md:mr-4" />
              <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
