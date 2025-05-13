
import { ReactNode } from "react";
import DashboardLayout from "./layout/DashboardLayout";

interface LayoutProps {
  children: ReactNode;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Layout({ children, isSidebarOpen, toggleSidebar }: LayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
