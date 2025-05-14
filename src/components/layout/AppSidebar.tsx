
import { useLocation, Link } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, useSidebar, SidebarGroupContent } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutDashboard, Users, Truck, LogOut, Building, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useBreakpoints } from "@/hooks/use-mobile";
import { forwardRef } from "react";

// Versão mobile-friendly do overlay para o sidebar
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

export function AppSidebar() {
  const location = useLocation();
  const {
    profile,
    logout
  } = useAuth();
  const {
    open,
    setOpen
  } = useSidebar();
  const {
    isTouch
  } = useBreakpoints();
  
  // Main menu items
  const mainMenu = [{
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
  }, {
    title: "Pontos de Coleta",
    url: "/dashboard/establishments/collection-points",
    icon: MapPin
  }];
  
  const handleLogout = async () => {
    await logout();
    window.location.href = '/auth';
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
                {/* Render main menu items */}
                {mainMenu.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url} 
                      className={location.pathname === item.url ? "bg-[#e4e7ff] text-[#6366f1]" : "text-[#2a3547] hover:bg-[#f5f6fa]"}
                      onClick={closeSidebar}
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-4 py-3 md:py-2.5 rounded-md transition-colors">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
    </>
  );
}
