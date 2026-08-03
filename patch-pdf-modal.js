const fs = require('fs');
let code = fs.readFileSync('components/PdfStylingModal.tsx', 'utf8');

code = code.replace(/onExport: \(options: \{[\s\S]*?\}\) => void;/, `onExport: (options: {
    fontTheme: "sans" | "serif" | "mono";
    density: "standard" | "compact";
    watermark?: string;
    includeToc: boolean;
  }) => void;`);

code = code.replace(/onPreview: \(options: \{[\s\S]*?\}\) => void;/, `onPreview: (options: {
    fontTheme: "sans" | "serif" | "mono";
    density: "standard" | "compact";
    watermark?: string;
    includeToc: boolean;
  }) => void;`);

code = code.replace(/const \[watermark, setWatermark\] = useState\(""\);/, `const [watermark, setWatermark] = useState("");
  const [includeToc, setIncludeToc] = useState(true);`);

code = code.replace(/import {([^}]*)Droplet,([^}]*)} from "lucide-react";/, `import {$1Droplet, ListOrdered,$2} from "lucide-react";`);

const tocSection = `
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
`;

code = code.replace(/\{\/\* Watermark \*\/\}/, tocSection + '\n          {/* Watermark */}');

code = code.replace(/onPreview\(\{ fontTheme, density, watermark \}\);/, `onPreview({ fontTheme, density, watermark, includeToc });`);
code = code.replace(/onExport\(\{ fontTheme, density, watermark \}\);/, `onExport({ fontTheme, density, watermark, includeToc });`);

fs.writeFileSync('components/PdfStylingModal.tsx', code);
console.log('Patched PdfStylingModal.tsx');
