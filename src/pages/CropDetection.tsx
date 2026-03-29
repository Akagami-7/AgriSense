import { useState } from "react";
import { Upload, Loader2, AlertTriangle, CheckCircle2, Leaf, Shield, Beaker, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const CropDetection = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<null | typeof mockResults>(null);

  const mockResults = {
    disease: "Early Blight (Alternaria solani)",
    confidence: 94,
    severity: "moderate" as const,
    description: "A common fungal disease that causes dark, concentric rings on lower leaves. It typically affects older leaves first and can spread rapidly in warm, humid conditions.",
    treatment: [
      "Apply chlorothalonil or copper-based fungicide at 2g/L concentration",
      "Remove and safely destroy infected leaf material",
      "Improve air circulation between plants by proper spacing",
      "Avoid overhead irrigation — water at the base instead",
    ],
    fertilizer: "Apply potassium-rich fertilizer (K₂O) to strengthen cell walls and boost natural resistance",
    prevention: "Practice 3-year crop rotation. Mulch around plants to prevent soil splash.",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setResults(null);
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResults(mockResults);
    }, 3000);
  };

  const severityMap = {
    low: { label: "Low Severity", class: "chip-success" },
    moderate: { label: "Moderate Severity", class: "chip-warning" },
    high: { label: "High Severity", class: "chip-danger" },
  };

  return (
    <div className="space-y-6">
      <div className="anim-enter">
        <p className="text-muted-foreground text-sm max-w-lg">
          Upload a clear photo of your crop leaf to detect diseases using AI-powered image analysis. 
          Supports JPG and PNG formats up to 5MB.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Upload panel */}
        <div className="lg:col-span-2 surface p-6 anim-enter anim-enter-delay-1">
          <h3 className="font-body font-semibold text-foreground text-base mb-4">Upload Image</h3>

          {!image ? (
            <label className="upload-zone flex flex-col items-center min-h-[280px] justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mb-4">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Drag & drop your image</p>
              <p className="text-xs text-muted-foreground mb-4">or click to browse files</p>
              <span className="chip-neutral text-[11px]">JPG, PNG · Max 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-border aspect-[4/3]">
                <img src={image} alt="Uploaded crop" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1 h-11 rounded-xl gradient-earth text-primary-foreground"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing…</>
                  ) : (
                    <><Shield className="w-4 h-4 mr-2" /> Analyze</>
                  )}
                </Button>
                <Button variant="outline" className="h-11 rounded-xl" onClick={() => { setImage(null); setResults(null); }}>
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results panel */}
        <div className="lg:col-span-3 surface p-6 anim-enter anim-enter-delay-2">
          <h3 className="font-body font-semibold text-foreground text-base mb-4">Detection Results</h3>

          {analyzing && (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Shield className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Analyzing your crop image…</p>
                <p className="text-xs text-muted-foreground mt-1">AI model is processing the leaf pattern</p>
              </div>
            </div>
          )}

          {!analyzing && !results && (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <Leaf className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">No analysis yet</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">Upload a crop leaf image and click Analyze to get AI-powered disease detection results</p>
              </div>
            </div>
          )}

          {results && !analyzing && (
            <div className="space-y-5" style={{ animation: 'scaleIn 0.4s ease-out' }}>
              {/* Disease header */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/15">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{results.disease}</p>
                  <p className="text-xs text-muted-foreground mt-1">{results.description}</p>
                </div>
                <span className={severityMap[results.severity].class}>{severityMap[results.severity].label}</span>
              </div>

              {/* Confidence */}
              <div className="p-4 rounded-xl surface-inset">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-foreground">AI Confidence Score</span>
                  <span className="font-bold text-primary">{results.confidence}%</span>
                </div>
                <Progress value={results.confidence} className="h-2.5 rounded-full" />
              </div>

              {/* Treatment */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Recommended Treatment</span>
                </div>
                <ul className="space-y-2">
                  {results.treatment.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fertilizer + Prevention */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-accent/8 border border-accent/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Beaker className="w-4 h-4 text-accent" />
                    <span className="font-semibold text-sm text-foreground">Fertilizer</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{results.fertilizer}</p>
                </div>
                <div className="p-4 rounded-xl bg-info/8 border border-info/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-info" />
                    <span className="font-semibold text-sm text-foreground">Prevention</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{results.prevention}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropDetection;
