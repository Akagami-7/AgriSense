import { NavLink } from "react-router-dom";
import { LayoutDashboard, Camera, Sprout, FileText, CloudSun, Lightbulb, User, Settings, LogOut, Search, Bell, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Scanner", url: "/crop-detection", icon: Camera },
    { title: "Soil Lab", url: "/soil-analysis", icon: Sprout },
    { title: "Reports", url: "/reports", icon: FileText },
    { title: "Weather", url: "/weather", icon: CloudSun },
    { title: "Tips", url: "/farming-tips", icon: Lightbulb },
    { title: "Profile", url: "/profile", icon: User },
];

export function FloatingIsland() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    };

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-5xl">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-[#fdfaf6]/80 dark:bg-[#1a1614]/80 backdrop-blur-xl border border-earth-200/50 dark:border-earth-800/30 shadow-xl ring-1 ring-earth-900/5">

                {/* Brand */}
                <div className="flex items-center gap-3 px-4 py-2 border-r border-earth-200/50 dark:border-earth-800/30">
                    <a href="/dashboard" className="flex items-center gap-2 no-underline group">
                        <div className="w-9 h-9 rounded-xl gradient-earth flex items-center justify-center shadow-lg shadow-earth-900/10">
                            <Sprout className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading font-bold text-earth-900 dark:text-earth-50 text-base tracking-tight">
                            AgriSense
                        </span>
                    </a>
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar mx-4 h-12">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.url}
                            to={item.url}
                            className={({ isActive }) => cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap",
                                isActive
                                    ? "bg-earth-600 text-white shadow-md shadow-earth-600/20"
                                    : "text-earth-700/70 dark:text-earth-300/60 hover:bg-earth-100 dark:hover:bg-earth-800/50 hover:text-earth-900 dark:hover:text-earth-50"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            <span className="text-xs font-bold tracking-wide">
                                {item.title}
                            </span>
                        </NavLink>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2 pl-4 border-l border-earth-200/50 dark:border-earth-800/30">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl text-earth-600 dark:text-earth-400 hover:bg-earth-100 dark:hover:bg-earth-800/50 transition-all"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <div className="relative">
                        <button className="p-2.5 rounded-xl text-earth-600 dark:text-earth-400 hover:bg-earth-100 dark:hover:bg-earth-800/50 transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-accent ring-2 ring-background shadow-sm" />
                        </button>
                    </div>
                    <NavLink to="/profile" className="ml-2 w-9 h-9 rounded-xl gradient-earth flex items-center justify-center shadow-md hover:scale-105 transition-all">
                        <span className="text-xs font-bold text-white uppercase">F</span>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
