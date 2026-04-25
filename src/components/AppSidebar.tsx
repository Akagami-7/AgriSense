import { LayoutDashboard, Camera, Sprout, FileText, CloudSun, Lightbulb, User, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Crop Scanner", url: "/crop-detection", icon: Camera },
  { title: "Soil Lab", url: "/soil-analysis", icon: Sprout },
  { title: "Reports", url: "/reports", icon: FileText },
];

const secondaryNav = [
  { title: "Weather", url: "/weather", icon: CloudSun },
  { title: "Farming Tips", url: "/farming-tips", icon: Lightbulb },
  { title: "My Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* Brand */}
      <div className="px-4 py-5 flex items-center gap-3 border-b border-sidebar-border/40">
        <div className="w-10 h-10 rounded-xl gradient-earth flex items-center justify-center flex-shrink-0 shadow-lg">
          <Sprout className="w-5 h-5 text-sidebar-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="font-heading text-base text-sidebar-foreground leading-tight">AgriSense</h2>
            <p className="text-[11px] text-sidebar-foreground/50 font-body">Smart Farming AI</p>
          </div>
        )}
      </div>

      <SidebarContent className="px-3 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider font-body font-semibold mb-1">
            {!collapsed && "Main"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 rounded-xl transition-all duration-200 py-2.5"
                      activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium shadow-sm"
                    >
                      <item.icon className="mr-3 h-[18px] w-[18px]" />
                      {!collapsed && <span className="text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider font-body font-semibold mb-1">
            {!collapsed && "Tools"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 rounded-xl transition-all duration-200 py-2.5"
                      activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium shadow-sm"
                    >
                      <item.icon className="mr-3 h-[18px] w-[18px]" />
                      {!collapsed && <span className="text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-3 border-t border-sidebar-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-destructive/10 rounded-xl transition-all py-2.5 px-2"
              >
                <LogOut className="mr-3 h-[18px] w-[18px]" />
                {!collapsed && <span className="text-[13px]">Sign Out</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
