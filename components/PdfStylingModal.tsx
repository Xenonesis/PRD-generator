import React, { useState } from "react";
import {
  FileText,
  Type,
  LayoutTemplate,
  X,
  Download,
  Eye,
  Droplet, ListOrdered,
} from "lucide-react";

interface PdfStylingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: {
    fontTheme: "sans" | "serif" | "mono";
    density: "standard" | "compact";
    watermark?: string;
    includeToc: boolean;
  }) => void;
  onPreview: (options: {
    fontTheme: "sans" | "serif" | "mono";
    density: "standard" | "compact";
    watermark?: string;
    includeToc: boolean;
  }) => void;
}

export const PdfStylingModal: React.FC<PdfStylingModalProps> = ({
  isOpen,
  onClose,
  onExport,
  onPreview,
}) => {
  const [fontTheme, setFontTheme] = useState<"sans" | "serif" | "mono">("sans");
  const [density, setDensity] = useState<"standard" | "compact">("standard");
  const [watermark, setWatermark] = useState("");
  const [includeToc, setIncludeToc] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-[#1A1A1A] text-black dark:text-white w-full max-w-md border border-black dark:border-white/20 shadow-2xl animate-fade-in relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-black dark:border-white/10">
          <h2 className="text-xl font-serif font-bold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            PDF Styling
          </h2>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">
            Configure the appearance of your generated document.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Font Theme */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Type className="w-4 h-4" />
              Font Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFontTheme("sans")}
                className={`p-3 border text-sm transition ${fontTheme === "sans" ? "border-black dark:border-white bg-black/5 dark:bg-white/10 font-bold" : "border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"}`}
              >
                <span className="font-sans">Standard</span>
              </button>
              <button
                onClick={() => setFontTheme("serif")}
                className={`p-3 border text-sm transition ${fontTheme === "serif" ? "border-black dark:border-white bg-black/5 dark:bg-white/10 font-bold" : "border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"}`}
              >
                <span className="font-serif">Classic</span>
              </button>
              <button
                onClick={() => setFontTheme("mono")}
                className={`p-3 border text-sm transition ${fontTheme === "mono" ? "border-black dark:border-white bg-black/5 dark:bg-white/10 font-bold" : "border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"}`}
              >
                <span className="font-mono">Technical</span>
              </button>
            </div>
          </div>

          {/* Density */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4" />
              Layout Density
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDensity("standard")}
                className={`p-3 border text-sm transition ${density === "standard" ? "border-black dark:border-white bg-black/5 dark:bg-white/10 font-bold" : "border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"}`}
              >
                Standard
              </button>
              <button
                onClick={() => setDensity("compact")}
                className={`p-3 border text-sm transition ${density === "compact" ? "border-black dark:border-white bg-black/5 dark:bg-white/10 font-bold" : "border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"}`}
              >
                Compact
              </button>
            </div>
          </div>

          
          {/* Table of Contents */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <ListOrdered className="w-4 h-4" />
              Table of Contents
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={includeToc} 
                  onChange={(e) => setIncludeToc(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-10 h-6 bg-black/20 dark:bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-white"></div>
              </div>
              <span className="text-sm text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white transition">
                Include automated Table of Contents
              </span>
            </label>
          </div>

          {/* Watermark */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Droplet className="w-4 h-4" />
              Custom Watermark (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. DRAFT, CONFIDENTIAL"
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
              className="w-full bg-transparent border-b-2 border-black/20 dark:border-white/20 text-black dark:text-white py-2 px-1 text-sm outline-none focus:border-black dark:focus:border-white transition placeholder:text-black/30 dark:placeholder:text-white/30"
            />
          </div>
        </div>

        <div className="p-6 bg-black/5 dark:bg-white/5 border-t border-black dark:border-white/10 flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold border border-black dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition order-last sm:order-first"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => {
                onPreview({ fontTheme, density, watermark, includeToc });
              }}
              className="px-4 py-2 text-sm font-bold border border-black dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 transition"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => {
                onExport({ fontTheme, density, watermark, includeToc });
                onClose();
              }}
              className="px-4 py-2 text-sm font-bold bg-black dark:bg-white text-white dark:text-[#121212] flex items-center gap-2 hover:opacity-80 transition"
            >
              <Download className="w-4 h-4" />
              Generate PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
