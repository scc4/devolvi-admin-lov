
import { ReactNode } from "react";
import DashboardLayout from "./layout/DashboardLayout";

interface LayoutProps {
  children: ReactNode;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Layout({ children }: LayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
