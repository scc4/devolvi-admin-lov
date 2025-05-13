
import { useLocation, Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, useSidebar, SidebarGroupContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutDashboard, Users, Truck, LogOut, Building, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useBreakpoints } from "@/hooks/use-mobile";
import { forwardRef, useEffect, memo } from "react";

// Mobile-friendly overlay for sidebar
const MobileOverlay = forwardRef<HTMLDivElement, { onClick: () => void }>(({ onClick }, ref) => {
  return (
    <div 
      ref={ref} 
      className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm animate-fade-in"
      onClick={onClick}
      aria-hidden="true"
    />
  );
});
MobileOverlay.displayName = "MobileOverlay";

// Define menu items outside of component to prevent recreating on each render
const menuItems = [{
  title: "Dashboard",
  url: "/dashboard",
  icon: LayoutDashboard
}, {
  title: "Usuários",
  url: "/dashboard/users",
  icon: Users
}, {
  title: "Transportadoras",
  url: "/dashboard/carriers",
  icon: Truck
}, {
  title: "Estabelecimentos",
  url: "/dashboard/establishments",
  icon: Building
}];

// Create individual menu item component for better control
const MenuItem = memo(({ item, isActive, onClick }: { 
  item: { title: string, url: string, icon: any },
  isActive: boolean,
  onClick: () => void
}) => {
  const IconComponent = item.icon;
  
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton 
        asChild 
        isActive={isActive} 
        className={isActive ? "bg-[#e4e7ff] text-[#6366f1]" : "text-[#2a3547] hover:bg-[#f5f6fa]"}
        onClick={onClick}
      >
        <Link to={item.url} className="flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-md transition-colors">
          <IconComponent className="h-5 w-5" />
          <span className="font-medium">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});
MenuItem.displayName = "MenuItem";

export const AppSidebar = memo(() => {
  const location = useLocation();
  const { profile, logout } = useAuth();
  const { open, setOpen } = useSidebar();
  const { isTouch } = useBreakpoints();
  
  // Update sidebar state based on screen size - only when isTouch changes
  useEffect(() => {
    if (isTouch) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isTouch, setOpen]);
  
  const handleLogout = () => {
    logout();
  };
  
  const closeSidebar = () => {
    if (isTouch) {
      setOpen(false);
    }
  };
  
  return (
    <>
      {open && isTouch && <MobileOverlay onClick={() => setOpen(false)} />}
      
      <Sidebar className={`${isTouch && !open ? "hidden" : ""} border-r z-50 shadow-lg md:shadow-none`}>
        <SidebarHeader>
          <div className="flex w-full items-center justify-between gap-2 px-4 py-3">
            <div className="flex items-center">
              <img src="/lovable-uploads/87919125-83d7-4d17-aef5-c7f61a7a6efb.png" alt="Devolvi Logo" className="h-8 w-auto mr-2" />
              <span className="font-semibold text-[#2a3547]"></span>
            </div>
            
            {isTouch && (
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Fechar menu</span>
              </Button>
            )}
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-gray-500 px-4 py-2">MENU PRINCIPAL</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map(item => (
                  <MenuItem 
                    key={item.title}
                    item={item}
                    isActive={
                      location.pathname === item.url || 
                      (item.url !== "/dashboard" && location.pathname.startsWith(item.url))
                    }
                    onClick={closeSidebar}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex w-full items-center justify-between p-4 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#6366f1] text-white">
                  {profile?.name?.[0] || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span className="font-medium text-[#2a3547]">{profile?.name || "Admin"}</span>
                <span className="text-xs text-gray-500">Administrador</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500 hover:text-[#6366f1] hover:bg-[#f5f6fa]">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sair</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      {/* Mobile sidebar trigger button - only shown when sidebar is closed */}
      {isTouch && !open && (
        <Button
          size="icon"
          variant="ghost"
          className="fixed top-3 left-3 z-50 md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      )}
    </>
  );
});

AppSidebar.displayName = "AppSidebar";
