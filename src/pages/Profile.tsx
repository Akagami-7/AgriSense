import { useState } from "react";
import { Pencil, ScanLine, Calendar, Leaf, FileText, MapPin, Phone, Mail, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const [editing, setEditing] = useState(false);

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
            <p className="text-sm text-muted-foreground mt-0.5">Professional Farmer · Kattankulathur, Tamil Nadu</p>
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
      <div className="surface p-6 anim-enter anim-enter-delay-3">
        <h4 className="font-semibold text-foreground mb-1">Personal Information</h4>
        <p className="text-xs text-muted-foreground mb-5">Update your personal details and contact information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Full Name", value: "Farmer", icon: Shield },
            { label: "Email Address", value: "farmer@example.com", icon: Mail },
            { label: "Phone Number", value: "+91 9876543210", icon: Phone },
            { label: "Location", value: "Kattankulathur, Tamil Nadu", icon: MapPin },
            { label: "Farm Size", value: "12 Acres", icon: Globe },
            { label: "Primary Language", value: "Tamil", icon: Globe },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs font-medium text-foreground mb-1.5 block">{field.label}</label>
              <div className="relative">
                <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  defaultValue={field.value}
                  disabled={!editing}
                  className="pl-11 h-11 rounded-xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
