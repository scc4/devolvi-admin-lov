
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-[#f5f9ff]">
        <AppSidebar />
        <div className="flex-1 pl-[0px] md:pl-[20px] lg:pl-[280px] transition-all">
          <div className="p-3 md:p-6">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
