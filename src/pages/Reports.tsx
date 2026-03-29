import { useState } from "react";
import { Search, Download, Eye, Filter, Calendar, ScanLine, Leaf, Bug, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import wheatImg from "@/assets/wheat-report.jpg";
import tomatoImg from "@/assets/tomato-report.jpg";
import riceImg from "@/assets/rice-report.jpg";
import cornImg from "@/assets/corn-report.jpg";
import cottonImg from "@/assets/cotton-report.jpg";
import sugarcaneImg from "@/assets/sugarcane-report.jpg";

interface Report {
  id: string;
  crop: string;
  disease: string;
  status: "Healthy" | "Detected";
  confidence: number;
  severity: "Low" | "Moderate" | "High";
  date: string;
  image: string;
  treatment?: string;
}

const reports: Report[] = [
  { id: "RPT-001", crop: "Wheat", disease: "None detected", status: "Healthy", confidence: 96, severity: "Low", date: "March 28, 2026", image: wheatImg },
  { id: "RPT-002", crop: "Tomato", disease: "Early Blight", status: "Detected", confidence: 94, severity: "Moderate", date: "March 27, 2026", image: tomatoImg, treatment: "Copper fungicide spray" },
  { id: "RPT-003", crop: "Rice", disease: "None detected", status: "Healthy", confidence: 98, severity: "Low", date: "March 26, 2026", image: riceImg },
  { id: "RPT-004", crop: "Corn", disease: "Gray Leaf Spot", status: "Detected", confidence: 89, severity: "Moderate", date: "March 25, 2026", image: cornImg, treatment: "Foliar fungicide application" },
  { id: "RPT-005", crop: "Cotton", disease: "Boll Rot", status: "Detected", confidence: 82, severity: "High", date: "March 24, 2026", image: cottonImg, treatment: "Remove infected bolls, apply fungicide" },
  { id: "RPT-006", crop: "Sugarcane", disease: "None detected", status: "Healthy", confidence: 97, severity: "Low", date: "March 23, 2026", image: sugarcaneImg },
];

const Reports = () => {
  const [search, setSearch] = useState("");
  const filtered = reports.filter(
    (r) => r.crop.toLowerCase().includes(search.toLowerCase()) || r.disease.toLowerCase().includes(search.toLowerCase())
  );

  const totalReports = reports.length;
  const healthyCount = reports.filter((r) => r.status === "Healthy").length;
  const diseasedCount = reports.filter((r) => r.status === "Detected").length;
  const avgConfidence = Math.round(reports.reduce((sum, r) => sum + r.confidence, 0) / reports.length);

  const summaryStats = [
    { label: "Total Reports", value: totalReports, icon: ScanLine, variant: "bg-primary/8 text-primary" },
    { label: "Healthy", value: healthyCount, icon: Leaf, variant: "bg-success/8 text-success" },
    { label: "Issues Found", value: diseasedCount, icon: Bug, variant: "bg-destructive/8 text-destructive" },
    { label: "Avg. Confidence", value: `${avgConfidence}%`, icon: BarChart3, variant: "bg-info/8 text-info" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 anim-enter">
        <p className="text-muted-foreground text-sm max-w-md">
          Browse all your crop scan results. Filter by crop type, date, or health status.
        </p>
        <Button className="gradient-earth text-primary-foreground rounded-xl h-10 self-start">
          <Download className="w-4 h-4 mr-2" /> Export Reports
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 anim-enter anim-enter-delay-1">
        {summaryStats.map((s) => (
          <div key={s.label} className="surface p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.variant}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3 anim-enter anim-enter-delay-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by crop or disease…"
            className="pl-11 h-11 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 rounded-xl"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        <Button variant="outline" className="h-11 rounded-xl"><Calendar className="w-4 h-4 mr-2" /> Date Range</Button>
      </div>

      {/* Report cards */}
      <div className="space-y-4 anim-enter anim-enter-delay-3">
        {filtered.map((r) => (
          <div key={r.id} className="surface-hover p-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="sm:w-44 h-36 sm:h-auto flex-shrink-0">
                <img src={r.image} alt={r.crop} className="w-full h-full object-cover" loading="lazy" />
              </div>

              {/* Content */}
              <div className="flex-1 p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground text-base">{r.crop}</h4>
                      <span className={r.status === "Healthy" ? "chip-success" : "chip-danger"}>
                        {r.status === "Healthy" ? "Healthy" : r.disease}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.date}</span>
                      <span>Report ID: {r.id}</span>
                      <span>Severity: {r.severity}</span>
                    </div>
                    {r.treatment && (
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-primary" /> Treatment: {r.treatment}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <Button variant="outline" size="sm" className="rounded-lg text-xs h-8">
                      <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-lg h-8">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={r.confidence} className="h-2 flex-1 rounded-full" />
                  <span className="text-xs font-semibold text-primary">{r.confidence}% confidence</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
