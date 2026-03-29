import { useNavigate } from "react-router-dom";
import { Camera, FileText, Lightbulb, Leaf, Bug, TrendingUp, ScanLine, ArrowUpRight, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const areaData = [
  { month: "Jan", healthy: 38, issues: 4 },
  { month: "Feb", healthy: 42, issues: 6 },
  { month: "Mar", healthy: 48, issues: 3 },
  { month: "Apr", healthy: 52, issues: 5 },
  { month: "May", healthy: 58, issues: 2 },
  { month: "Jun", healthy: 63, issues: 4 },
];

const pieData = [
  { name: "Healthy", value: 76, color: "hsl(152,55%,38%)" },
  { name: "At Risk", value: 14, color: "hsl(38,85%,52%)" },
  { name: "Diseased", value: 10, color: "hsl(4,72%,52%)" },
];

const recentScans = [
  { crop: "Wheat", result: "Healthy", time: "2 hours ago" },
  { crop: "Tomato", result: "Leaf Blight", time: "5 hours ago" },
  { crop: "Rice", result: "Healthy", time: "Yesterday" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Scans Completed", value: "—", sublabel: "Upload crops to begin", icon: ScanLine, variant: "primary" as const },
    { label: "Healthy Crops", value: "—", sublabel: "No data yet", icon: Leaf, variant: "success" as const },
    { label: "Issues Found", value: "—", sublabel: "No data yet", icon: Bug, variant: "danger" as const },
    { label: "Avg. Confidence", value: "—", sublabel: "Scan to calculate", icon: TrendingUp, variant: "info" as const },
  ];

  const variantStyles = {
    primary: "bg-primary/8 text-primary",
    success: "bg-success/8 text-success",
    danger: "bg-destructive/8 text-destructive",
    info: "bg-info/8 text-info",
  };

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="surface gradient-hero p-6 md:p-8 rounded-2xl anim-enter">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl text-primary-foreground mb-1">Good morning, Farmer 🌾</h2>
            <p className="text-primary-foreground/60 text-sm max-w-md">
              Your intelligent farming dashboard — scan crops, analyze soil, and get AI-powered insights to maximize your yield.
            </p>
          </div>
          <button
            onClick={() => navigate("/crop-detection")}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground text-sm font-medium transition-colors border border-primary-foreground/10 self-start"
          >
            <Camera className="w-4 h-4" />
            New Scan
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 anim-enter anim-enter-delay-1">
        {stats.map((s) => (
          <div key={s.label} className="surface p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${variantStyles[s.variant]}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground font-body">{s.value}</p>
              <p className="text-xs font-medium text-foreground/80 mt-0.5">{s.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.sublabel}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 anim-enter anim-enter-delay-2">
        {/* Area chart */}
        <div className="lg:col-span-2 surface p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading text-lg text-foreground">Crop Health Trends</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly scan results overview</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Healthy</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-accent" /> Issues</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="fillHealthy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(158,40%,28%)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(158,40%,28%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40,15%,90%)" />
              <XAxis dataKey="month" stroke="hsl(160,8%,48%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(160,8%,48%)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(40,15%,90%)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="healthy" stroke="hsl(158,40%,28%)" strokeWidth={2.5} fill="url(#fillHealthy)" />
              <Area type="monotone" dataKey="issues" stroke="hsl(32,65%,52%)" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie + legend */}
        <div className="surface p-6">
          <h3 className="font-heading text-lg text-foreground mb-1">Health Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Current crop status breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </span>
                <span className="font-semibold text-foreground">{d.value}%</span>
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
