const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Add state variables
const stateTarget = "const [isExportingPdf, setIsExportingPdf] = useState(false);";
const stateReplacement = "const [isExportingPdf, setIsExportingPdf] = useState(false);\n  const [pdfExportProgress, setPdfExportProgress] = useState(0);\n  const [pdfExportStage, setPdfExportStage] = useState('');";
if (code.includes(stateTarget) && !code.includes('pdfExportProgress')) {
    code = code.replace(stateTarget, stateReplacement);
}

// 2. Update handleGeneratePdfWithStyling
const handlePdfTarget = `  const handleGeneratePdfWithStyling = async (options: {
    fontTheme: "sans" | "serif" | "mono";
    watermark?: string;
    density: "standard" | "compact";
    includeToc: boolean;
  }) => {
    try {
      setIsExportingPdf(true);`;
const handlePdfReplacement = `  const handleGeneratePdfWithStyling = async (options: {
    fontTheme: "sans" | "serif" | "mono";
    watermark?: string;
    density: "standard" | "compact";
    includeToc: boolean;
  }) => {
    try {
      setIsExportingPdf(true);
      setPdfExportProgress(0);
      setPdfExportStage('Preparing document');`;
if (code.includes(handlePdfTarget) && !code.includes('setPdfExportProgress(0)')) {
    code = code.replace(handlePdfTarget, handlePdfReplacement);
}

const handlePdfOptTarget = `fontTheme: options.fontTheme,
        density: options.density,
        includeToc: options.includeToc,
      });`;
const handlePdfOptReplacement = `fontTheme: options.fontTheme,
        density: options.density,
        includeToc: options.includeToc,
        onProgress: (stage, progress) => {
          setPdfExportStage(stage);
          setPdfExportProgress(progress);
        }
      });`;
if (code.includes(handlePdfOptTarget)) {
    code = code.replace(handlePdfOptTarget, handlePdfOptReplacement);
}

const finallyTarget = `} finally {
      setIsExportingPdf(false);
    }`;
const finallyReplacement = `} finally {
      setIsExportingPdf(false);
      setPdfExportStage('');
      setPdfExportProgress(0);
    }`;
if (code.includes(finallyTarget)) {
    code = code.replace(finallyTarget, finallyReplacement);
}

// 3. Insert the overlay JSX before <Navbar />
const overlayJSX = `      {isExportingPdf && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1A1A1A] border border-black/20 dark:border-white/20 shadow-2xl p-6 w-full max-w-md">
            <h3 className="font-serif text-xl font-bold mb-4 text-[#1A1A1A] dark:text-[#F4F1EE]">Generating High-Fidelity PDF</h3>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-2">
              <span>{pdfExportStage || "Initializing..."}</span>
              <span>{Math.round(pdfExportProgress)}%</span>
            </div>
            <div className="h-2 w-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-black dark:bg-white transition-all duration-300 ease-out"
                style={{ width: \`\${pdfExportProgress}%\` }}
              />
            </div>
            <p className="text-xs text-black/40 dark:text-white/40 mt-4 text-center">
              Please wait, this may take a few moments...
            </p>
          </div>
        </div>
      )}

      <Navbar`;
      
if (code.includes('<Navbar') && !code.includes('Generating High-Fidelity PDF')) {
    code = code.replace('<Navbar', overlayJSX);
}

fs.writeFileSync('app/page.tsx', code);
console.log('Patched app/page.tsx');
