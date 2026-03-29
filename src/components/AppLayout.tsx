import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/dashboard": "Welcome back, Farmer",
  "/crop-detection": "Crop Disease Scanner",
  "/soil-analysis": "Soil Analysis Lab",
  "/reports": "Analysis Reports",
  "/weather": "Weather Insights",
  "/farming-tips": "Knowledge Base",
  "/profile": "Account Settings",
};

export function AppLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border/60 bg-card/80 backdrop-blur-md px-4 md:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <h1 className="font-heading text-xl text-foreground hidden sm:block">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl hover:bg-muted transition-colors">
                <Search className="w-[18px] h-[18px] text-muted-foreground" />
              </button>
              <button className="relative p-2.5 rounded-xl hover:bg-muted transition-colors">
                <Bell className="w-[18px] h-[18px] text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent ring-2 ring-card" />
              </button>
              <div className="ml-2 flex items-center gap-3 pl-3 border-l border-border/60">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground leading-tight">Farmer</p>
                  <p className="text-[11px] text-muted-foreground">Kattankulathur</p>
                </div>
                <div className="w-9 h-9 rounded-xl gradient-earth flex items-center justify-center shadow-sm">
                  <span className="text-sm font-bold text-primary-foreground">F</span>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
