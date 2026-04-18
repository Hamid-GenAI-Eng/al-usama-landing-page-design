import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, FileText, Sparkles, CheckCircle, X, Loader2, ChevronLeft, Brain, FileCheck } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

type Stage = "idle" | "uploading" | "scanning" | "complete";

const UploadDocument = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [docType, setDocType] = useState("Commercial Invoice");
  const [shipmentId, setShipmentId] = useState("SHP-8829-DXB");

  // Mock AI extraction result
  const extracted = {
    vendor: "Shanghai Heavy Industries Co. Ltd",
    invoiceNo: "SHI-2026-0871",
    invoiceDate: "2026-10-18",
    items: [
      { desc: "Architectural Steel Beams Type A4", qty: 450, unit: "Units", hs: "7308.90", value: 124500 },
      { desc: "Reinforced Glass Paneling UV-Filtered", qty: 120, unit: "Crates", hs: "7007.21", value: 89200 },
    ],
    total: 213700,
    currency: "USD",
  };

  const handleFile = (f: File) => {
    setFile(f);
    setStage("uploading");
    setTimeout(() => setStage("scanning"), 800);
    setTimeout(() => setStage("complete"), 2600);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const reset = () => {
    setFile(null);
    setStage("idle");
  };

  const handleSave = () => {
    toast.success("Document saved to vault with AI-extracted metadata");
    navigate("/documents");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link to="/documents" className="flex items-center gap-1 text-muted-foreground hover:text-foreground uppercase text-[11px] font-bold tracking-wider">
            <ChevronLeft className="w-3.5 h-3.5" />
            Documents
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-primary font-semibold text-[11px] uppercase tracking-wider">Upload</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-headline text-foreground">Upload Trade Document</h1>
          <p className="text-sm text-muted-foreground mt-1">Drag a file to auto-extract invoice details, HS codes, and shipment metadata using AI.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Upload zone */}
          <div className="lg:col-span-2 space-y-6">
            {stage === "idle" && (
              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => inputRef.current?.click()}
                className="bg-white rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer p-12 text-center"
              >
                <input ref={inputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={onSelect} />
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold font-headline text-foreground">Drop your document here</h3>
                <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
                <p className="text-xs text-muted-foreground mt-4">Supports PDF, JPG, PNG • Max 20 MB per file</p>
              </div>
            )}

            {stage !== "idle" && file && (
              <div className="bg-white rounded-xl p-6 border border-border">
                {/* File preview */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={reset} className="text-muted-foreground hover:text-foreground p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Stage indicator */}
                <div className="space-y-3 mb-6">
                  {[
                    { id: "uploading", label: "Uploading file to secure vault", icon: Upload },
                    { id: "scanning", label: "AI extracting fields (vendor, items, HS codes...)", icon: Brain },
                    { id: "complete", label: "Verification complete — ready to save", icon: FileCheck },
                  ].map((s) => {
                    const order = ["uploading", "scanning", "complete"];
                    const current = order.indexOf(stage);
                    const idx = order.indexOf(s.id);
                    const done = idx < current;
                    const active = idx === current;
                    return (
                      <div key={s.id} className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          done ? "bg-green-500 text-white" : active ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        }`}>
                          {done ? <CheckCircle className="w-4 h-4" /> : active ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <s.icon className="w-3.5 h-3.5" />}
                        </div>
                        <p className={`text-sm ${active ? "font-bold text-foreground" : done ? "text-muted-foreground line-through" : "text-muted-foreground"}`}>{s.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* AI Extracted preview */}
                {stage === "complete" && (
                  <div className="border-t border-border pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-primary">AI-Extracted Fields</h3>
                      <span className="ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-200">98% Confidence</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Vendor</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">{extracted.vendor}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Invoice No.</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">{extracted.invoiceNo}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Invoice Date</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">{extracted.invoiceDate}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total Value</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">${extracted.total.toLocaleString()} {extracted.currency}</p>
                      </div>
                    </div>

                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">Line Items ({extracted.items.length})</p>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <th className="text-left px-3 py-2">Description</th>
                            <th className="text-left px-3 py-2">Qty</th>
                            <th className="text-left px-3 py-2">HS Code</th>
                            <th className="text-right px-3 py-2">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extracted.items.map((it) => (
                            <tr key={it.hs} className="border-t border-border">
                              <td className="px-3 py-2 text-sm text-foreground">{it.desc}</td>
                              <td className="px-3 py-2 text-sm text-muted-foreground">{it.qty} {it.unit}</td>
                              <td className="px-3 py-2 text-sm text-muted-foreground">{it.hs}</td>
                              <td className="px-3 py-2 text-sm font-bold text-foreground text-right">${it.value.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6">
                      <button onClick={reset} className="px-5 py-2.5 border border-border rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted">
                        Cancel
                      </button>
                      <button onClick={handleSave} className="gradient-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90">
                        <CheckCircle className="w-4 h-4" />
                        Save to Vault
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Metadata sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-border space-y-4">
              <h3 className="text-sm font-bold font-headline text-foreground">Document Metadata</h3>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Document Type</label>
                <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm border-none">
                  <option>Commercial Invoice</option>
                  <option>Bill of Lading</option>
                  <option>Packing List</option>
                  <option>Certificate of Origin</option>
                  <option>Customs Declaration</option>
                  <option>Insurance Certificate</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Linked Shipment</label>
                <select value={shipmentId} onChange={(e) => setShipmentId(e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm border-none">
                  <option>SHP-8829-DXB</option>
                  <option>SHP-9012-SHA</option>
                  <option>SHP-4431-LHR</option>
                  <option>SHP-1120-KHI</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Notes</label>
                <textarea rows={3} placeholder="Optional notes..." className="w-full px-3 py-2.5 bg-muted rounded-lg text-sm border-none resize-y" />
              </div>
            </div>

            <div className="gradient-primary rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/70">AI Engine</p>
              </div>
              <p className="text-sm font-bold">Trade Flow Vision v2</p>
              <p className="text-xs text-white/80 mt-2 leading-relaxed">
                Trained on 4M+ trade documents. Extracts vendor, items, HS codes, totals, and dates with high accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadDocument;
