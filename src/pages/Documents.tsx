import { Link } from "react-router-dom";
import { Upload, FileText, Filter, Download, MoreVertical, FileCheck, FileWarning, Clock, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const documents = [
  { id: "DOC-9821", name: "Commercial Invoice - SHP-8829", type: "Invoice", shipment: "SHP-8829-DXB", uploadedBy: "Salman Y.", date: "Oct 22, 2026", size: "1.2 MB", version: "v3", status: "VERIFIED" },
  { id: "DOC-9820", name: "Bill of Lading - Oceanic Voyager", type: "BOL", shipment: "SHP-8829-DXB", uploadedBy: "Usama F.", date: "Oct 21, 2026", size: "842 KB", version: "v1", status: "VERIFIED" },
  { id: "DOC-9819", name: "Packing List - Container TCKU48329", type: "Packing List", shipment: "SHP-9012-SHA", uploadedBy: "Salman Y.", date: "Oct 20, 2026", size: "512 KB", version: "v2", status: "PROCESSING" },
  { id: "DOC-9818", name: "Certificate of Origin - China", type: "Certificate", shipment: "SHP-9012-SHA", uploadedBy: "Auto-Sync", date: "Oct 18, 2026", size: "320 KB", version: "v1", status: "VERIFIED" },
  { id: "DOC-9817", name: "Customs Declaration - WEBOC", type: "Customs", shipment: "SHP-4431-LHR", uploadedBy: "Salman Y.", date: "Oct 17, 2026", size: "1.8 MB", version: "v1", status: "PENDING" },
  { id: "DOC-9816", name: "Insurance Certificate - Marine", type: "Insurance", shipment: "SHP-1120-KHI", uploadedBy: "Usama F.", date: "Oct 15, 2026", size: "640 KB", version: "v2", status: "VERIFIED" },
];

const statusColor: Record<string, string> = {
  VERIFIED: "bg-green-50 text-green-700 border border-green-200",
  PROCESSING: "bg-blue-50 text-blue-700 border border-blue-200",
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
};

const Documents = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline text-foreground">Document Vault</h1>
            <p className="text-sm text-muted-foreground mt-1">Centralized trade documentation with AI extraction & version control</p>
          </div>
          <Link to="/documents/upload" className="gradient-primary text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all">
            <Upload className="w-4 h-4" />
            Upload Document
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "TOTAL DOCUMENTS", value: "1,284", sub: "+42 this week", icon: FileText, color: "text-primary", bg: "bg-blue-50" },
            { label: "VERIFIED", value: "1,109", sub: "86% of total", icon: FileCheck, color: "text-green-600", bg: "bg-green-50" },
            { label: "PROCESSING", value: "23", sub: "AI extraction running", icon: Clock, color: "text-primary", bg: "bg-blue-50" },
            { label: "REQUIRES ACTION", value: "12", sub: "Pending verification", icon: FileWarning, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-5 border border-border/50`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-[11px] font-bold uppercase tracking-wider ${stat.color}`}>{stat.label}</p>
                  <p className="text-3xl font-bold font-headline text-foreground mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.color}`}>{stat.sub}</p>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color} opacity-20`} />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-5 border border-border">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search by name, shipment ID..." className="w-full pl-9 pr-4 py-2 bg-muted rounded-lg text-sm border-none outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Document Type</label>
              <select className="px-3 py-2 bg-muted rounded-lg text-sm border-none min-w-[160px]">
                <option>All Types</option>
                <option>Invoice</option>
                <option>Bill of Lading</option>
                <option>Packing List</option>
                <option>Certificate</option>
                <option>Customs</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Shipment</label>
              <select className="px-3 py-2 bg-muted rounded-lg text-sm border-none min-w-[160px]">
                <option>All Shipments</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Status</label>
              <select className="px-3 py-2 bg-muted rounded-lg text-sm border-none min-w-[140px]">
                <option>All Status</option>
              </select>
            </div>
            <button className="p-2 bg-muted rounded-lg hover:bg-muted/80">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Document", "Type", "Linked Shipment", "Uploaded By", "Date", "Version", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <Link to={`/documents/${doc.id}`} className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.id} • {doc.size}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-muted text-foreground">{doc.type}</span>
                  </td>
                  <td className="px-4 py-4">
                    <Link to={`/shipments/${doc.shipment}`} className="text-sm text-primary font-bold hover:underline">{doc.shipment}</Link>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{doc.uploadedBy}</td>
                  <td className="px-4 py-4 text-sm text-foreground">{doc.date}</td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold text-muted-foreground">{doc.version}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${statusColor[doc.status]}`}>{doc.status}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
