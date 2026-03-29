import { useState } from "react";
import { Pencil, ScanLine, Calendar, Leaf, FileText, MapPin, Phone, Mail, Shield, Globe, Loader2, CheckCircle2, XCircle, Database, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [geminiKey, setGeminiKey] = useState(sessionStorage.getItem("agrisense_gemini_key") || "");
  const [weatherKey, setWeatherKey] = useState(sessionStorage.getItem("agrisense_weather_key") || "");
  const [testingGemini, setTestingGemini] = useState(false);
  const [testingWeather, setTestingWeather] = useState(false);

  const handleSaveApiKeys = () => {
    sessionStorage.setItem("agrisense_gemini_key", geminiKey.trim());
    sessionStorage.setItem("agrisense_weather_key", weatherKey.trim());
    toast.success("Configurations saved to session storage.", {
      description: "Keys will be automatically purged when you close this tab."
    });
    // We don't necessarily need window.location.reload() if we update states or if other pages read on mount
    // but a reload ensures everything re-syncs.
    setTimeout(() => window.location.reload(), 1500);
  };

  const testGeminiConnection = async () => {
    if (!geminiKey.trim()) return toast.error("Please enter a Gemini key first.");
    setTestingGemini(true);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "ping" }] }] })
      });
      const data = await res.json();
      if (res.ok) toast.success("Gemini API Connected!", { description: "Your AI Intelligence Cloud is active." });
      else throw new Error(data.error?.message || "Invalid Key");
    } catch (err: any) {
      toast.error("Gemini Connection Failed", { description: err.message });
    } finally {
      setTestingGemini(false);
    }
  };

  const testWeatherConnection = async () => {
    if (!weatherKey.trim()) return toast.error("Please enter an OpenWeather key first.");
    setTestingWeather(true);
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=12.8230&lon=80.0440&appid=${weatherKey.trim()}`);
      const data = await res.json();
      if (res.ok) toast.success("Weather API Connected!", { description: "Local meteorological data is synced." });
      else throw new Error(data.message || "Invalid Key");
    } catch (err: any) {
      toast.error("Weather Connection Failed", { description: err.message });
    } finally {
      setTestingWeather(false);
    }
  };

  const stats = [
    { icon: ScanLine, value: "—", label: "Total Scans", sub: "No scans yet" },
    { icon: Calendar, value: "Mar 2026", label: "Member Since", sub: "Active account" },
    { icon: Leaf, value: "—", label: "Healthy Crops", sub: "Start scanning" },
    { icon: FileText, value: "—", label: "Reports", sub: "No reports yet" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between anim-enter">
        <p className="text-muted-foreground text-sm">Manage your account information, preferences, and farming profile</p>
        <Button
          variant={editing ? "default" : "outline"}
          onClick={() => setEditing(!editing)}
          className={`rounded-xl ${editing ? "gradient-earth text-primary-foreground" : ""}`}
        >
          <Pencil className="w-4 h-4 mr-2" /> {editing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile header */}
      <div className="surface p-6 anim-enter anim-enter-delay-1">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-2xl gradient-earth flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-primary-foreground">F</span>
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-2xl text-foreground">Farmer</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Professional Farmer · Active Field Location</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Wheat", "Rice", "Tomato", "Corn"].map((crop) => (
                <span key={crop} className="chip-neutral">{crop}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 anim-enter anim-enter-delay-2">
        {stats.map((s) => (
          <div key={s.label} className="surface p-4 text-center">
            <s.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-[11px] font-medium text-foreground/80">{s.label}</p>
            <p className="text-[10px] text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Personal info */}
      <div className="surface p-6 anim-enter anim-enter-delay-3 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-5 bg-primary rounded-full" />
          <h4 className="font-heading text-xl text-foreground font-semibold">Profile Details</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Full Name", value: "Farmer K.", icon: Shield },
            { label: "Email Address", value: "farmer@agrisense.ai", icon: Mail },
            { label: "Phone Number", value: "+91 98765 43210", icon: Phone },
            { label: "Farm Location", value: "GPS Detected", icon: MapPin },
            { label: "Land Ownership", value: "12.5 Hectares", icon: Globe },
            { label: "Crop Specialization", value: "Rice & Sugarcane", icon: Leaf },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">{field.label}</label>
              <div className="relative group">
                <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  defaultValue={field.value}
                  disabled={!editing}
                  className="pl-12 h-12 rounded-2xl bg-muted/20 border-muted focus:bg-background focus:ring-primary/20 transition-all font-body text-foreground"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-10 border-t border-border/50">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-5 bg-info rounded-full" />
            <h4 className="font-heading text-xl text-foreground font-semibold">Eco-Notification Preferences</h4>
          </div>
          <div className="space-y-4">
            {[
              { title: "Blight & Disease Alerts", desc: "Get instant AI notifications when high-risk weather for blight is detected.", active: true },
              { title: "Soil Moisture Reminders", desc: "Receive alerts when your field nodes report moisture below 20%.", active: true },
              { title: "Market Price Updates", desc: "Weekly summaries of wholesale prices for your primary crops.", active: false },
              { title: "Expert Farming Tips", desc: "Periodic seasonal advice from our agricultural science team.", active: true },
            ].map((pref) => (
              <div key={pref.title} className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 border border-transparent hover:border-muted/50 transition-all group">
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{pref.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{pref.desc}</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${pref.active ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${pref.active ? 'right-1' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-border/50">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-5 bg-primary rounded-full" />
            <h4 className="font-heading text-xl text-foreground font-semibold">API Cloud Configuration</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Google Gemini API Key</label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                <Input
                  type="password"
                  placeholder="Paste your Gemini key here"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="pl-12 h-12 rounded-2xl bg-muted/20 border-muted focus:bg-background focus:ring-primary/20 transition-all font-body text-foreground"
                />
              </div>
              <div className="flex items-center justify-between px-1">
                <p className="text-[9px] text-muted-foreground">Used for AI disease detection scans.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={testGeminiConnection}
                  disabled={testingGemini}
                  className="h-7 px-3 text-[10px] font-bold rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                >
                  {testingGemini ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Database className="w-3 h-3 mr-1.5" />}
                  {testingGemini ? "Ping..." : "Test Connection"}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">OpenWeather API Key</label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                <Input
                  type="password"
                  placeholder="Paste your OpenWeather key here"
                  value={weatherKey}
                  onChange={(e) => setWeatherKey(e.target.value)}
                  className="pl-12 h-12 rounded-2xl bg-muted/20 border-muted focus:bg-background focus:ring-primary/20 transition-all font-body text-foreground"
                />
              </div>
              <div className="flex items-center justify-between px-1">
                <p className="text-[9px] text-muted-foreground">Used for local weather dashboard.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={testWeatherConnection}
                  disabled={testingWeather}
                  className="h-7 px-3 text-[10px] font-bold rounded-lg hover:bg-info/10 hover:text-info transition-all"
                >
                  {testingWeather ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Database className="w-3 h-3 mr-1.5" />}
                  {testingWeather ? "Ping..." : "Test Connection"}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="rounded-xl h-11 px-8 gradient-earth text-primary-foreground font-bold text-xs"
              onClick={handleSaveApiKeys}
            >
              Apply & Save for this Session
            </Button>
            <Button
              variant="outline"
              className="rounded-xl h-11 px-6 font-bold text-xs border-muted text-muted-foreground hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all"
              onClick={() => {
                sessionStorage.clear();
                setGeminiKey("");
                setWeatherKey("");
                toast.warning("Session cleared. All keys deleted.");
                setTimeout(() => window.location.reload(), 1000);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Clear All Session Keys
            </Button>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-border/50">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-5 bg-warning rounded-full" />
            <h4 className="font-heading text-xl text-foreground font-semibold">Account Security</h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="rounded-xl h-11 px-6 font-bold text-xs shadow-none border-muted">
              Update Password
            </Button>
            <Button variant="outline" className="rounded-xl h-11 px-6 font-bold text-xs shadow-none border-muted text-destructive hover:bg-destructive/5 hover:text-destructive">
              Deactivate Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
