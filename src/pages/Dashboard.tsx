import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, FileText, Lightbulb, Leaf, Bug, TrendingUp, ScanLine, ArrowUpRight, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [scans, setScans] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem("agrisense_scans") || "[]");
    setScans(saved);
  }, []);

  const totalScans = scans.length;
  const healthyCount = scans.filter(s => s.status === "Healthy" || s.disease === "Healthy").length;
  const issuesCount = scans.filter(s => s.status === "Detected" || s.disease !== "Healthy").length;
  const avgConfidence = totalScans > 0
    ? Math.round(scans.reduce((sum, s) => sum + s.confidence, 0) / totalScans)
    : 0;

  // Compute real Pie Data
  const pieData = [
    { name: "Healthy", value: totalScans > 0 ? Math.round((healthyCount / totalScans) * 100) : 0, color: "#4d7c0f" },
    { name: "Issues", value: totalScans > 0 ? Math.round((issuesCount / totalScans) * 100) : 0, color: "#ef4444" },
  ];

  // Compute real Area Data (Last 6 months)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const idx = (currentMonthIdx - 5 + i + 12) % 12;
    return months[idx];
  });

  // Compute real Area Data
  // If we have few scans, show them individually. If many, show monthly aggregates.
  let displayAreaData = [];
  if (scans.length > 0 && scans.length < 10) {
    // Show individual scans
    displayAreaData = [...scans].reverse().map((s, i) => ({
      name: s.id.split('-')[1], // Just the ID number
      healthy: s.status === "Healthy" || s.disease === "Healthy" ? 100 : 0,
      issues: s.status === "Detected" || s.disease !== "Healthy" ? 100 : 0,
      confidence: s.confidence
    }));
  } else if (scans.length >= 10) {
    // Show monthly aggregates
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIdx = new Date().getMonth();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const idx = (currentMonthIdx - 5 + i + 12) % 12;
      return months[idx];
    });

    displayAreaData = last6Months.map(month => {
      const monthScans = scans.filter(s => s.date && s.date.includes(month));
      return {
        name: month,
        healthy: monthScans.filter(s => s.status === "Healthy" || s.disease === "Healthy").length,
        issues: monthScans.filter(s => s.status === "Detected" || s.disease !== "Healthy").length,
      };
    });
  } else {
    // Fallback simulation (Earthy values)
    displayAreaData = [
      { name: "Apr", healthy: 12, issues: 2 },
      { name: "May", healthy: 18, issues: 4 },
      { name: "Jun", healthy: 25, issues: 1 },
    ];
  }

  const stats = [
    { label: "Scans Completed", value: totalScans.toString(), sublabel: scans.length > 0 ? `+${scans.length} active sessions` : "No sessions yet", icon: ScanLine, variant: "primary" as const },
    { label: "Healthy Crops", value: healthyCount.toString(), sublabel: totalScans > 0 ? `${Math.round((healthyCount / totalScans) * 100)}% of scans` : "0%", icon: Leaf, variant: "success" as const },
    { label: "Issues Detected", value: issuesCount.toString(), sublabel: issuesCount > 0 ? "Action recommended" : "Status: Optimal", icon: Bug, variant: "danger" as const },
    { label: "Avg. Confidence", value: `${avgConfidence}%`, sublabel: "AI Diagnostic Precision", icon: TrendingUp, variant: "info" as const },
  ];

  const recentScans = scans.slice(0, 3).map(s => ({
    crop: s.crop || "Unknown Crop",
    result: s.disease || s.status,
    time: s.date,
    status: s.status || (s.disease === "Healthy" ? "Healthy" : "Detected")
  }));

  const variantStyles = {
    primary: "bg-earth-100 text-earth-700",
    success: "bg-success/8 text-success",
    danger: "bg-destructive/8 text-destructive",
    info: "bg-info/8 text-info",
  };

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="surface bg-earth-900 border-none p-6 md:p-8 rounded-3xl anim-enter relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-earth-500/10 rounded-full -translate-y-32 translate-x-32 blur-3xl transition-transform group-hover:scale-110 duration-1000" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-heading text-2xl md:text-4xl text-earth-50 mb-2 font-bold tracking-tight text-white">Good morning, Farmer 🌾</h2>
            <p className="text-earth-200/70 text-sm max-w-md font-medium">
              Your intelligent farming dashboard is synchronized with your physical field history. Scan now for precision diagnostics.
            </p>
          </div>
          <button
            onClick={() => navigate("/crop-detection")}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-earth-50 hover:bg-white text-earth-900 text-sm font-bold transition-all shadow-lg active:scale-95 group/btn"
          >
            <Camera className="w-5 h-5 transition-transform group-hover/btn:rotate-12" />
            New AI Scan
            <ArrowUpRight className="w-4 h-4 opacity-50" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 anim-enter anim-enter-delay-1">
        {stats.map((s) => (
          <div key={s.label} className="surface p-6 flex flex-col items-center text-center group hover:border-earth-200/50 transition-all border-earth-100/30">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${variantStyles[s.variant]}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-earth-900 dark:text-earth-50 font-body">{s.value}</p>
            <p className="text-[11px] font-bold text-earth-600/60 dark:text-earth-400/60 uppercase tracking-widest mt-2">{s.label}</p>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">{s.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Charts + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 anim-enter anim-enter-delay-2">
        {/* Area chart */}
        <div className="lg:col-span-2 surface p-8 border-earth-100/30">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-heading text-xl text-earth-900 dark:text-earth-50 font-bold">Field Vitality Trends</h3>
              <p className="text-xs text-muted-foreground mt-1 italic">
                {scans.length > 0 && scans.length < 10 ? "Recent individual scan performance" : "Aggregated monthly health overview"}
              </p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-earth-600" /> Healthy</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-accent" /> Issues</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={displayAreaData}>
              <defs>
                <linearGradient id="fillHealthy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4d7c0f" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#4d7c0f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tick={{ fontWeight: 600 }} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', background: '#fff' }}
                itemStyle={{ color: '#1a2e05', fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="healthy" stroke="#4d7c0f" strokeWidth={3} fill="url(#fillHealthy)" animationBegin={300} dot={{ r: 4, fill: '#4d7c0f' }} />
              <Area type="monotone" dataKey="issues" stroke="#ef4444" strokeWidth={2} fill="transparent" strokeDasharray="6 6" animationBegin={500} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie + legend */}
        <div className="surface p-8 flex flex-col items-center justify-center text-center border-earth-100/30 font-white">
          <h3 className="font-heading text-xl text-earth-900 dark:text-earth-50 font-bold mb-1">Health Mix</h3>
          <p className="text-xs text-muted-foreground mb-8">Overall crop resilience</p>
          <div className="relative w-full aspect-square max-w-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" animationBegin={200}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold text-earth-900 dark:text-earth-50">{pieData[0].value}%</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase">Stable</p>
            </div>
          </div>
          <div className="space-y-3 mt-10 w-full">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between p-3 rounded-2xl bg-earth-50/50 dark:bg-earth-800/20 border border-earth-100/50 dark:border-earth-700/30">
                <span className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-xs font-bold text-earth-700 dark:text-earth-300 uppercase tracking-widest">{d.name}</span>
                </span>
                <span className="text-sm font-bold text-earth-900 dark:text-earth-50">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions + Recent scans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 anim-enter anim-enter-delay-3">
        <div className="surface p-6">
          <h3 className="font-heading text-lg text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Scan Crop", desc: "Upload & detect diseases", icon: Camera, path: "/crop-detection" },
              { label: "View Reports", desc: "Past analysis results", icon: FileText, path: "/reports" },
              { label: "Get Tips", desc: "Expert farming advice", icon: Lightbulb, path: "/farming-tips" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className="surface-hover p-4 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                  <a.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-sm text-foreground">{a.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{a.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg text-foreground">Recent Activity</h3>
            <button onClick={() => navigate("/reports")} className="text-xs text-primary font-medium hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {recentScans.map((scan, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{scan.crop}</p>
                  <p className="text-[11px] text-muted-foreground">{scan.time}</p>
                </div>
                <span className={scan.result === "Healthy" ? "chip-success" : "chip-danger"}>
                  {scan.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
