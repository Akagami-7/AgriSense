import { useState, useEffect } from "react";
import { Pencil, ScanLine, Calendar, Leaf, FileText, MapPin, Phone, Mail, Shield, Globe, Loader2, Database, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Profile = () => {
  const { user, updateProfile, deactivateAccount, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [geminiKey, setGeminiKey] = useState("");
  const [weatherKey, setWeatherKey] = useState("");
  const [testingGemini, setTestingGemini] = useState(false);
  const [testingWeather, setTestingWeather] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");

      const fetchConfig = async () => {
        console.log("Fetching config for user:", user.uid);
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          console.log("Config snapshot exists:", docSnap.exists());
          if (docSnap.exists()) {
            setGeminiKey(docSnap.data().geminiKey || "");
            setWeatherKey(docSnap.data().weatherKey || "");
          }
        } catch (err) {
          console.error("Error fetching config:", err);
          toast.error("Error loading saved integrations");
        } finally {
          setIsLoading(false);
        }
      };

      fetchConfig();
    }
  }, [user]);

  const handleEditToggle = async () => {
    if (editing) {
      const ok = await updateProfile(name);
      if (ok) setEditing(false);
    } else {
      setEditing(true);
    }
  };

  const handleDeactivate = async () => {
    if (window.confirm("Are you sure you want to permanently delete your account?")) {
      await deactivateAccount();
    }
  };

  const handleSaveApiKeys = async () => {
    if (!user?.uid) return toast.error("Must be logged in to save keys.");
    console.log("Saving keys to doc: users/", user.uid);
    try {
      await setDoc(doc(db, "users", user.uid), {
        geminiKey: geminiKey.trim(),
        weatherKey: weatherKey.trim()
      }, { merge: true });
      console.log("Keys saved successfully");
      toast.success("Configurations saved to cloud storage.", {
        description: "Your keys are now securely linked to your account."
      });
    } catch (err) {
      console.error("Firestore Save Error:", err);
      toast.error("Failed to save integrations.");
    }
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
      if (res.ok) toast.success("Gemini API Connected!");
      else toast.error("Invalid Key");
    } catch (err: any) {
      console.error("Gemini Test Error:", err);
      toast.error("Gemini Connection Failed");
    } finally {
      setTestingGemini(false);
    }
  };

  const testWeatherConnection = async () => {
    if (!weatherKey.trim()) return toast.error("Please enter an OpenWeather key first.");
    setTestingWeather(true);
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=12.8230&lon=80.0440&appid=${weatherKey.trim()}`);
      if (res.ok) toast.success("Weather API Connected!");
      else toast.error("Invalid Key");
    } catch (err: any) {
      console.error("Weather Test Error:", err);
      toast.error("Weather Connection Failed");
    } finally {
      setTestingWeather(false);
    }
  };

  const stats = [
    { icon: ScanLine, value: "—", label: "Total Scans", sub: "No scans yet" },
    { icon: Calendar, value: "Today", label: "Member Since", sub: "Active account" },
    { icon: Leaf, value: "—", label: "Healthy Crops", sub: "Start scanning" },
    { icon: FileText, value: "—", label: "Reports", sub: "No reports yet" },
  ];

  if (isLoading && user) return <div className="p-20 text-center">Loading Profile...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full pb-20">
      <div className="flex items-center justify-between anim-enter">
        <p className="text-muted-foreground text-sm">Manage your account information, preferences, and farming profile</p>
        <Button
          variant={editing ? "default" : "outline"}
          onClick={handleEditToggle}
          className={`rounded-xl ${editing ? "gradient-earth text-primary-foreground" : ""}`}
        >
          <Pencil className="w-4 h-4 mr-2" /> {editing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile header */}
      <div className="surface p-6 anim-enter anim-enter-delay-1">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-2xl gradient-earth flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">
              {user?.displayName?.charAt(0).toUpperCase() || (user?.email?.charAt(0).toUpperCase()) || "F"}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-2xl text-foreground font-bold">{user?.displayName || "Farmer"}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{user?.email} · Active Field Location</p>
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
          <div>
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Full Name</label>
            <div className="relative group">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editing}
                className="pl-12 h-12 rounded-2xl bg-muted/20 border-muted focus:bg-background focus:ring-primary/20 transition-all font-body text-foreground"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Email Address (Read-only)</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={user?.email || ""}
                disabled
                className="pl-12 h-12 rounded-2xl bg-muted/20 border-muted text-muted-foreground cursor-not-allowed font-body"
              />
            </div>
          </div>

          {[
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
            <div className="w-1.5 h-5 bg-primary rounded-full" />
            <h4 className="font-heading text-xl text-foreground font-semibold">API Integrations</h4>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">OpenWeather API Key</label>
                <div className="relative group">
                  <Database className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    value={weatherKey}
                    onChange={(e) => setWeatherKey(e.target.value)}
                    placeholder="Enter your OpenWeather API Key"
                    className="pl-12 h-12 rounded-2xl bg-muted/20 border-muted focus:bg-background focus:ring-primary/20 transition-all font-body text-foreground"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={testWeatherConnection}
                  disabled={testingWeather || !weatherKey.trim()}
                  variant="outline"
                  className="h-12 rounded-2xl px-6 w-full sm:w-auto"
                >
                  {testingWeather ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Test Weather API
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Gemini API Key</label>
                <div className="relative group">
                  <Database className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="Enter your Gemini API Key"
                    className="pl-12 h-12 rounded-2xl bg-muted/20 border-muted focus:bg-background focus:ring-primary/20 transition-all font-body text-foreground"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={testGeminiConnection}
                  disabled={testingGemini || !geminiKey.trim()}
                  variant="outline"
                  className="h-12 rounded-2xl px-6 w-full sm:w-auto"
                >
                  {testingGemini ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Test Gemini API
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleSaveApiKeys} className="h-12 rounded-2xl gradient-earth px-8 text-primary-foreground font-semibold">
              Save Integrations
            </Button>
          </div>
        </div>

        <div className="mt-10 pt-10 border-t border-border/50">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-5 bg-destructive rounded-full" />
            <h4 className="font-heading text-xl text-foreground font-semibold">Account Security</h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => logout()} variant="outline" className="rounded-xl h-11 px-6 font-bold text-xs shadow-none border-muted hover:bg-muted/50">
              <LogOut className="w-4 h-4 mr-2" /> Log Out
            </Button>
            <Button onClick={handleDeactivate} className="rounded-xl h-11 px-6 font-bold text-xs shadow-none bg-destructive text-white hover:bg-destructive/90">
              <Trash2 className="w-4 h-4 mr-2" /> Deactivate Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
