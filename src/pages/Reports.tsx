import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";

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

const Reports = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("agrisense_scans") || "[]");
    setAllReports(saved);
  }, []);

  const filtered = allReports.filter((r) => {
    const matchesSearch = r.crop.toLowerCase().includes(search.toLowerCase()) ||
      r.disease.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    toast.success("Reports exported successfully!", {
      description: `${filtered.length} reports have been saved as CSV.`,
    });
  };

  const totalReports = allReports.length;
  const healthyCount = allReports.filter((r) => r.status === "Healthy").length;
  const diseasedCount = allReports.filter((r) => r.status === "Detected").length;
  const avgConfidence = Math.round(allReports.reduce((sum, r) => sum + r.confidence, 0) / (allReports.length || 1));

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
        <Button onClick={handleExport} className="gradient-earth text-primary-foreground rounded-xl h-10 self-start shadow-md hover:shadow-lg transition-all">
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
            className="pl-11 h-11 rounded-xl shadow-none focus-visible:ring-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-11 rounded-xl bg-card border-border/60">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Healthy">Healthy</SelectItem>
            <SelectItem value="Detected">Detected Issues</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="h-11 rounded-xl px-4 border-border/60 hover:bg-muted text-foreground/80 font-medium">
          <Calendar className="w-4 h-4 mr-2" /> Date Range
        </Button>
      </div>

      {/* Report cards */}
      <div className="space-y-4 anim-enter anim-enter-delay-3 pb-20">
        {filtered.length === 0 ? (
          <div className="surface p-20 text-center flex flex-col items-center gap-4 opacity-50 border-dashed border-2">
            <ScanLine className="w-12 h-12 text-muted-foreground/30" />
            <div>
              <p className="font-heading text-lg font-semibold text-foreground">No reports found</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">Perform a new crop scan to generate detailed AI diagnostic reports here.</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl mt-2" onClick={() => navigate("/crop-detection")}>
              Go to Scanner
            </Button>
          </div>
        ) : (
          filtered.map((r) => (
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
                        <span>ID: {r.id}</span>
                        <span>Severity: {r.severity}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-xs h-8"
                        onClick={() => setSelectedReport(r)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-lg h-8">
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="mt-4 flex items-center gap-3">
                    <Progress value={r.confidence} className="h-1.5 flex-1 rounded-full" />
                    <span className="text-[10px] font-bold text-primary tracking-tight whitespace-nowrap">{r.confidence}% confidence</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Details Sheet */}
      <Sheet open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <SheetContent className="sm:max-w-md w-[90%] surface-glass border-l border-white/10 p-0 overflow-y-auto">
          {selectedReport && (
            <div className="relative">
              <div className="h-64 relative overflow-hidden">
                <img src={selectedReport.image} className="w-full h-full object-cover" alt="Scan" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className={selectedReport.status === "Healthy" ? "chip-success border-none text-white bg-success px-3 mb-2 inline-block" : "chip-danger border-none text-white bg-destructive px-3 mb-2 inline-block"}>
                    {selectedReport.status}
                  </span>
                  <h2 className="font-heading text-2xl font-bold">{selectedReport.crop}</h2>
                  <p className="text-white/70 text-sm mt-1">{selectedReport.disease}</p>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="surface p-4 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Confidence</p>
                    <p className="text-2xl font-body font-bold text-primary">{selectedReport.confidence}%</p>
                  </div>
                  <div className="surface p-4 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Severity</p>
                    <p className="text-2xl font-body font-bold text-foreground">{selectedReport.severity}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-5 bg-primary rounded-full" />
                    <h3 className="font-heading text-lg font-semibold text-foreground">Diagnostic Report</h3>
                  </div>
                  <div className="surface p-5 border-l-4 border-primary">
                    <p className="text-sm font-medium text-foreground leading-relaxed italic opacity-80">
                      "A precise scan was performed on {selectedReport.date}. The AI model identified features consistent with {selectedReport.disease}.
                      Recommended actions should be taken immediately to ensure crop health."
                    </p>
                  </div>
                </div>

                {selectedReport.treatment && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-5 bg-accent rounded-full" />
                      <h3 className="font-heading text-lg font-semibold text-foreground">Actionable Steps</h3>
                    </div>
                    <div className="surface p-5 bg-accent/5 border border-accent/15">
                      <p className="text-sm text-foreground mb-3 font-semibold">Immediate Treatment Plan:</p>
                      <ul className="space-y-2.5">
                        <li className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                          <Leaf className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          {selectedReport.treatment}
                        </li>
                        <li className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                          <Leaf className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          Apply specialized fertilizers as per the localized nutrient requirements.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-border/50">
                  <div className="flex gap-3">
                    <Button className="flex-1 gradient-earth text-primary-foreground rounded-xl h-11 font-bold text-xs">
                      <Download className="w-3.5 h-3.5 mr-2" /> Download Full PDF
                    </Button>
                    <Button variant="outline" className="rounded-xl h-11 px-4 border-muted" onClick={() => setSelectedReport(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Reports;
