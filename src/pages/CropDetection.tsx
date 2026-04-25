import { useState, useEffect } from "react";
import { Upload, Loader2, AlertTriangle, CheckCircle2, Leaf, Shield, Beaker, ArrowRight, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

const CropDetection = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [results, setResults] = useState<null | any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [hasAPIKey, setHasAPIKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      const dbKey = await getFirebaseGeminiKey();
      const apiKey = dbKey || import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === "your_gemini_api_key_here") {
        setHasAPIKey(false);
      } else {
        setHasAPIKey(true);
      }
    };
    checkKey();
  }, []);

  const getFirebaseGeminiKey = async () => {
    if (auth.currentUser) {
      try {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid, "config"));
        if (snap.exists()) return snap.data().geminiKey;
      } catch (err) { console.error(err); }
    }
    return null;
  };

  const mockResults = {
    disease: "Late Blight (Phytophthora infestans)",
    confidence: 96.4,
    severity: "high" as const,
    description: "A devastating disease caused by a water mold. It appears as large, dark-brown or black lesions on leaves and stems, often with a 'greasy' appearance.",
    treatment: [
      "Immediate application of systemic fungicides (e.g., Metalaxyl-M or Fluopicolide)",
      "Destroy all infected plant debris by burning or deep burial",
      "Ensure foliage remains dry; pivot to drip irrigation if possible",
      "Monitor surrounding areas as spores can travel miles in the wind",
    ],
    fertilizer: "Avoid high-nitrogen fertilizers which promote lush, vulnerable growth. Use phosphorus-rich blends.",
    prevention: "Use certified disease-free seeds. Avoid planting in fields where blight occurred in the last 2 years.",
  };

  const steps = [
    "Preparing image for AI analysis...",
    "Scanning leaf topography & lesion patterns...",
    "Querying AgriSense Intelligence Cloud...",
    "Finalizing diagnostic report...",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      setResults(null);
      setAnalysisStep(0);
    }
  };

  const fileToGenerativePart = async (file: File) => {
    const base64Promise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.readAsDataURL(file);
    });
    return {
      inline_data: { data: await base64Promise, mime_type: file.type },
    };
  };

  const compressImage = (imageFile: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = (e) => {
        const img = new window.Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxW = 400;
          const maxH = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxW) { height *= maxW / width; width = maxW; }
          } else {
            if (height > maxH) { width *= maxH / height; height = maxH; }
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.6));
        };
      };
    });
  };

  const persistScan = async (scanResults: any, isSimulated: boolean = false) => {
    if (!auth.currentUser) return;

    let finalImage = "";
    if (file) {
      finalImage = await compressImage(file);
    }

    const newScan = {
      id: `SCAN-${Math.floor(Math.random() * 9000) + 1000}`,
      crop: isSimulated ? "Sample Crop" : "Detected Crop",
      disease: scanResults.disease,
      status: scanResults.severity === "none" ? "Healthy" : "Detected",
      confidence: scanResults.confidence,
      severity: scanResults.severity.charAt(0).toUpperCase() + scanResults.severity.slice(1),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      image: finalImage,
      treatment: scanResults.treatment[0]
    };

    try {
      await addDoc(collection(db, "users", auth.currentUser.uid, "scans"), newScan);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    const dbKey = await getFirebaseGeminiKey();
    const apiKey = dbKey || import.meta.env.VITE_GEMINI_API_KEY;

    setAnalyzing(true);
    setAnalysisStep(0);

    // If no API key, use simulation
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      setHasAPIKey(false);
      let step = 0;
      const interval = setInterval(async () => {
        step++;
        if (step < steps.length) {
          setAnalysisStep(step);
        } else {
          clearInterval(interval);
          setAnalyzing(false);
          setResults(mockResults);
          await persistScan(mockResults, true);
        }
      }, 1000);
      return;
    }

    setHasAPIKey(true);

    // Real AI Analysis
    try {
      setAnalysisStep(1);
      const generativePart = await fileToGenerativePart(file!);
      setAnalysisStep(2);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: "Analyze this agricultural photo. Identify the specific crop disease. Respond ONLY with a JSON object containing: disease, confidence (number), severity (none/low/moderate/high), description (max 2 sentences), treatment (array of 4 strings), fertilizer (max 1 sentence), prevention (max 1 sentence). Ensure valid JSON." },
                  generativePart,
                ],
              },
            ],
          }),
        }
      );

      setAnalysisStep(3);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || `AI sync failed with status ${response.status}`);
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const cleanJson = textResponse.replace(/```json|```/g, "").trim();
      const parsedResults = JSON.parse(cleanJson);

      // Fix confidence scaling (e.g. 0.95 -> 95, 1 -> 100)
      let conf = Number(parsedResults.confidence);
      if (conf <= 1) conf = conf * 100;
      parsedResults.confidence = Math.round(conf);

      await persistScan(parsedResults, false);
      setResults(parsedResults);
    } catch (error: any) {
      console.error("AI Analysis failed:", error);
      setResults({
        ...mockResults,
        disease: `Analysis Error: ${error.message.includes('API key') ? 'Invalid Key' : 'Network/System Error'}`,
        description: error.message || "The AI Intelligence Cloud was unable to process your request. Please verify your API key in the Profile settings and try again."
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const severityMap: Record<string, { label: string, class: string }> = {
    none: { label: "Healthy", class: "chip-success" },
    low: { label: "Low Severity", class: "chip-success" },
    moderate: { label: "Moderate Severity", class: "chip-warning" },
    high: { label: "High Severity", class: "chip-danger" },
  };

  return (
    <div className="space-y-6">
      {!hasAPIKey && (
        <div className="bg-warning/10 border border-warning/20 p-4 rounded-2xl flex items-center gap-4 anim-enter">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-warning">Simulation Mode Active</p>
            <p className="text-xs text-warning/80">No API key detected. Results are currently simulated for demonstration. Enter your Gemini API key in the Profile settings to enable real diagnostic scanning.</p>
          </div>
        </div>
      )}
      <div className="anim-enter">
        <p className="text-muted-foreground text-sm max-w-lg font-body">
          Upload a clear photo of your crop leaf to detect diseases using our advanced AI-powered neural networks.
          Smarter detection, faster treatment, better harvests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Upload panel */}
        <div className="lg:col-span-2 surface p-6 anim-enter anim-enter-delay-1">
          <h3 className="font-heading text-lg text-foreground mb-4">Upload Image</h3>

          {!image ? (
            <label className="upload-zone flex flex-col items-center min-h-[320px] justify-center scale-up">
              <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mb-4 ring-8 ring-primary/5">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-base font-semibold text-foreground mb-1">Drag & drop your image</p>
              <p className="text-xs text-muted-foreground mb-5 px-6 text-center">or select a file from your device</p>
              <span className="chip-neutral text-[11px] font-medium tracking-wide">AI-OPTIMIZED · JPG, PNG · MAX 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-border aspect-[4/3] relative group shadow-lg">
                <img src={image} alt="Uploaded crop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 h-12 rounded-xl gradient-earth text-primary-foreground font-semibold shadow-md border-b-4 border-primary/20 hover:translate-y-px active:border-b-0 transition-all"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing AI…</>
                  ) : (
                    <><Shield className="w-4 h-4 mr-2" /> Start Analysis</>
                  )}
                </Button>
                <Button variant="outline" className="h-12 rounded-xl px-6 border-border/80 hover:bg-muted" onClick={() => { setImage(null); setResults(null); setAnalysisStep(0); }}>
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results panel */}
        <div className="lg:col-span-3 surface p-6 anim-enter anim-enter-delay-2 min-h-[400px] flex flex-col">
          <h3 className="font-heading text-lg text-foreground mb-4">Detection Results</h3>

          {analyzing && (
            <div className="flex flex-col items-center justify-center flex-1 gap-6 p-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-[6px] border-primary/10 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanLine className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-base font-semibold text-foreground">{steps[analysisStep]}</p>
                <p className="text-xs text-muted-foreground max-w-xs animate-pulse">Our AI is scanning millions of data points to ensure the highest accuracy</p>
              </div>
              <div className="w-full max-w-xs h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${((analysisStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {!analyzing && !results && (
            <div className="flex flex-col items-center justify-center flex-1 gap-5 text-center p-8 opacity-60">
              <div className="w-20 h-20 rounded-3xl bg-muted/60 flex items-center justify-center ring-8 ring-muted/20">
                <Leaf className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">Waiting for analysis...</p>
                <p className="text-xs text-muted-foreground mt-2 max-w-[240px] leading-relaxed">Please upload an image and click "Start Analysis" to see detailed AI insights here.</p>
              </div>
            </div>
          )}

          {results && !analyzing && (
            <div className="space-y-6 flex-1" style={{ animation: 'scaleIn 0.4s ease-out' }}>
              {/* Disease header */}
              <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border ${results.severity === 'high' ? 'bg-destructive/5 border-destructive/20' : 'bg-warning/5 border-warning/20'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${results.severity === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-heading text-xl text-foreground">{results.disease}</p>
                    <span className={severityMap[results.severity?.toLowerCase() || 'none']?.class}>
                      {severityMap[results.severity?.toLowerCase() || 'none']?.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{results.description}</p>
                </div>
              </div>

              {/* Confidence & Comparison Hint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl surface-inset">
                  <div className="flex justify-between text-sm mb-2.5">
                    <span className="font-semibold text-foreground/80">AI Confidence Score</span>
                    <span className="font-bold text-primary">{results.confidence}%</span>
                  </div>
                  <div className="relative h-2.5 bg-background rounded-full overflow-hidden border border-border/40">
                    <div
                      className="absolute top-0 left-0 h-full bg-primary rounded-full"
                      style={{ width: `${results.confidence}%` }}
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl surface-inset border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ScanLine className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Visual Comparison</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Healthy vs. Infected</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className={`flex-1 h-3 rounded-full ${results.severity === 'none' ? 'bg-success' : 'bg-success/20'}`} />
                    <div className={`flex-1 h-3 rounded-full ${results.severity !== 'none' ? 'bg-destructive' : 'bg-destructive/20'}`} />
                  </div>
                </div>
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
