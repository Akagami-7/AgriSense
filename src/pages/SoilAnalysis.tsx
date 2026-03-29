import { useState } from "react";
import { Upload, Droplets, FlaskConical, Layers, Sprout, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const soilResults = {
  type: "Loamy",
  typeDesc: "Well-balanced mix of sand, silt, and clay — ideal for most crops. Retains moisture while allowing drainage.",
  ph: 6.5,
  phStatus: "Slightly Acidic — Optimal Range",
  moisture: 45,
  moistureStatus: "Good moisture retention",
  nitrogen: "Medium",
  phosphorus: "High",
  potassium: "Medium",
  organicMatter: "3.2%",
  crops: [
    { name: "Rice (Paddy)", match: 96, reason: "Ideal pH & moisture for lowland cultivation" },
    { name: "Wheat", match: 88, reason: "Good soil structure for winter crops" },
    { name: "Tomato", match: 84, reason: "Nutrient-rich loamy soil supports fruiting" },
    { name: "Sugarcane", match: 78, reason: "Adequate moisture and organic matter" },
    { name: "Corn (Maize)", match: 72, reason: "Sufficient drainage for root development" },
  ],
};

const SoilAnalysis = () => {
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="space-y-6">
      <div className="anim-enter">
        <p className="text-muted-foreground text-sm max-w-lg">
          Upload a soil image or enter manual readings to receive detailed soil composition analysis and personalized crop recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input */}
        <div className="lg:col-span-2 space-y-4 anim-enter anim-enter-delay-1">
          <div className="surface p-6">
            <h3 className="font-body font-semibold text-foreground mb-4">Soil Image Upload</h3>
            <label className="upload-zone flex flex-col items-center py-8">
              <Upload className="w-8 h-8 text-primary/50 mb-3" />
              <p className="text-sm font-medium text-foreground">Upload soil sample photo</p>
              <p className="text-xs text-muted-foreground mt-1">AI will classify soil type visually</p>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          <div className="surface p-6">
            <h3 className="font-body font-semibold text-foreground mb-1">Manual Input</h3>
            <p className="text-xs text-muted-foreground mb-4">Enter lab readings if available</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">pH Level</label>
                  <Input type="number" placeholder="e.g., 6.5" step="0.1" className="h-10 rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Moisture (%)</label>
                  <Input type="number" placeholder="e.g., 45" className="h-10 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Nitrogen</label>
                  <Input placeholder="ppm" className="h-10 rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Phosphorus</label>
                  <Input placeholder="ppm" className="h-10 rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Potassium</label>
                  <Input placeholder="ppm" className="h-10 rounded-xl" />
                </div>
              </div>
            </div>
            <Button className="w-full mt-4 h-11 rounded-xl gradient-earth text-primary-foreground" onClick={() => setShowResults(true)}>
              <BarChart3 className="w-4 h-4 mr-2" /> Analyze Soil
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 anim-enter anim-enter-delay-2">
          {!showResults ? (
            <div className="surface p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Layers className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-foreground">Awaiting soil data</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">Upload a soil image or enter manual values to get comprehensive analysis</p>
            </div>
          ) : (
            <div className="space-y-4" style={{ animation: 'scaleIn 0.4s ease-out' }}>
              {/* Soil type */}
              <div className="surface p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl gradient-earth flex items-center justify-center">
                    <Layers className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-foreground">{soilResults.type} Soil</h3>
                    <p className="text-xs text-muted-foreground">{soilResults.typeDesc}</p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: FlaskConical, label: "pH Level", value: soilResults.ph.toString(), sub: soilResults.phStatus, color: "text-accent" },
                  { icon: Droplets, label: "Moisture", value: `${soilResults.moisture}%`, sub: soilResults.moistureStatus, color: "text-info" },
                  { icon: Sprout, label: "Organic Matter", value: soilResults.organicMatter, sub: "Good level", color: "text-primary" },
                  { icon: BarChart3, label: "Nitrogen", value: soilResults.nitrogen, sub: "Needs supplement", color: "text-warning" },
                ].map((m) => (
                  <div key={m.label} className="surface p-4 text-center">
                    <m.icon className={`w-5 h-5 mx-auto mb-2 ${m.color}`} />
                    <p className="text-lg font-bold text-foreground">{m.value}</p>
                    <p className="text-[11px] font-medium text-foreground/80">{m.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Recommended crops */}
              <div className="surface p-6">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-primary" /> Recommended Crops
                </h4>
                <div className="space-y-4">
                  {soilResults.crops.map((crop) => (
                    <div key={crop.name} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground w-28 flex-shrink-0">{crop.name}</span>
                      <div className="flex-1">
                        <Progress value={crop.match} className="h-2 rounded-full" />
                      </div>
                      <span className="text-xs font-bold text-primary w-10 text-right">{crop.match}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilAnalysis;
