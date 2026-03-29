import { FloatingIsland } from "@/components/FloatingIsland";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

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
    <div className="min-h-screen w-full bg-earth-50 dark:bg-earth-900 transition-colors duration-300 flex flex-col items-center relative overflow-hidden font-body text-earth-900 dark:text-earth-50">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-earth-200/20 dark:from-earth-800/10 to-transparent pointer-events-none" />

      <FloatingIsland />

      <div className="relative z-10 w-full max-w-7xl pt-24 pb-12 px-4 md:px-8">
        <header className="mb-14 text-center anim-enter">
          <h1 className="font-heading text-4xl md:text-5xl text-earth-900 dark:text-earth-50 font-bold tracking-tight mb-4 drop-shadow-sm">{title}</h1>
          <div className="w-24 h-1.5 gradient-earth mx-auto rounded-full shadow-sm" />
        </header>

        <main className="anim-enter anim-enter-delay-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
