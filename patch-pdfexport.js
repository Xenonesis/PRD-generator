const fs = require('fs');
let code = fs.readFileSync('lib/pdfExport.ts', 'utf8');

// 1. Update PDFExportOptions to include onProgress
const interfaceTarget = "  includeToc?: boolean;\n}";
const interfaceReplacement = "  includeToc?: boolean;\n  onProgress?: (stage: string, progress: number) => void;\n}";
if (code.includes(interfaceTarget)) {
    code = code.replace(interfaceTarget, interfaceReplacement);
}

// 2. Add reportProgress helper at the beginning of exportToHighFidelityPDF
const funcTarget = "export async function exportToHighFidelityPDF(\n  elementId: string = 'prd-document-preview',\n  options: PDFExportOptions = {}\n): Promise<void> {\n  if (typeof window === 'undefined') return;";
const funcReplacement = "export async function exportToHighFidelityPDF(\n  elementId: string = 'prd-document-preview',\n  options: PDFExportOptions = {}\n): Promise<void> {\n  if (typeof window === 'undefined') return;\n\n  const reportProgress = (stage: string, progress: number) => {\n    if (options.onProgress) options.onProgress(stage, progress);\n  };\n\n  reportProgress('Initializing PDF engine', 5);";
if (code.includes("if (typeof window === 'undefined') return;")) {
    code = code.replace(funcTarget, funcReplacement);
}

// 3. Add styling progress
const stylingTarget = "// Force light mode for PDF rendering";
const stylingReplacement = "reportProgress('Styling content', 15);\n  // Force light mode for PDF rendering";
if (code.includes(stylingTarget)) {
    code = code.replace(stylingTarget, stylingReplacement);
}

// 4. Add TOC progress
const tocTarget = "if (options.includeToc) {";
const tocReplacement = "if (options.includeToc) {\n      reportProgress('Adding table of contents', 30);";
if (code.includes(tocTarget)) {
    code = code.replace(tocTarget, tocReplacement);
}

// 5. Add watermark progress
const watermarkTarget = "if (watermarkText) {";
const watermarkReplacement = "if (watermarkText) {\n      reportProgress('Applying watermark', 40);";
if (code.includes(watermarkTarget)) {
    code = code.replace(watermarkTarget, watermarkReplacement);
}

// 6. Rendering pages progress
const renderTarget = "const worker = html2pdfModule().set(opt).from(element);";
const renderReplacement = "reportProgress('Rendering pages (this may take a moment)', 50);\n    const worker = html2pdfModule().set(opt).from(element);";
if (code.includes(renderTarget)) {
    code = code.replace(renderTarget, renderReplacement);
}

// 7. Finalizing PDF progress
const finalizeTarget = ".then((pdf: any) => {";
const finalizeReplacement = ".then((pdf: any) => {\n        reportProgress('Finalizing PDF', 80);";
if (code.includes(finalizeTarget)) {
    code = code.replace(finalizeTarget, finalizeReplacement);
}

// 8. Done progress
const doneTarget = ".save();";
const doneReplacement = ".save();\n    reportProgress('Done', 100);";
if (code.includes(doneTarget)) {
    code = code.replace(doneTarget, doneReplacement);
}

fs.writeFileSync('lib/pdfExport.ts', code);
console.log('Patched lib/pdfExport.ts');
