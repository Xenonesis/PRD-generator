"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { InteractiveForm } from "@/components/InteractiveForm";
import { DocumentView } from "@/components/DocumentView";
import { MiniMap } from "@/components/MiniMap";
import { WorkflowStepper } from "@/components/WorkflowStepper";
import { MarkdownView } from "@/components/MarkdownView";
import { InsightsDashboard } from "@/components/InsightsDashboard";
import { AIMagicModal } from "@/components/AIMagicModal";
import { TranslateModal } from "@/components/TranslateModal";
import { SavedDocumentsModal } from "@/components/SavedDocumentsModal";
import { PdfStylingModal } from "@/components/PdfStylingModal";
import { PrintPreviewModal } from "@/components/PrintPreviewModal";
import { VersionHistoryDrawer } from "@/components/VersionHistoryDrawer";
import { DocumentBrandingModal } from "@/components/DocumentBrandingModal";
import { PRDData, EMPTY_PRD, prdToMarkdown } from "@/types/prd";
import { PRD_TEMPLATES } from "@/lib/templates";
import {
  exportToHighFidelityPDF,
  exportTextSummaryWithJsPDF,
} from "@/lib/pdfExport";
import { exportToDocx } from "@/lib/exportDocx";
import { Sparkles, CheckCircle, FileText, ArrowRight } from "lucide-react";

export default function Home() {
  const [prdData, setPrdData] = useState<PRDData>(EMPTY_PRD);
  const [isHydrated, setIsHydrated] = useState(false);

  const [viewMode, setViewMode] = useState<
    "editor" | "split" | "preview" | "markdown" | "insights"
  >("split");
  const [printMode, setPrintMode] = useState<"full" | "agreement">("full");
  const [copied, setCopied] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isBrandingOpen, setIsBrandingOpen] = useState(false);
  const [prdHistory, setPrdHistory] = useState<
    { timestamp: number; data: PRDData }[]
  >([]);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfExportProgress, setPdfExportProgress] = useState(0);
  const [pdfExportStage, setPdfExportStage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPdfStylingModalOpen, setIsPdfStylingModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewOptions, setPreviewOptions] = useState<{
    fontTheme: "sans" | "serif" | "mono";
    watermark?: string;
    density: "standard" | "compact";
    includeToc: boolean;
  }>({ fontTheme: "sans", density: "standard", includeToc: true });
  const [pendingPdfWatermark, setPendingPdfWatermark] = useState<
    string | undefined
  >();

  // Load saved draft from localStorage after hydration (avoids SSR mismatch)
  useEffect(() => {
    try {
      const draft = localStorage.getItem("prdforge_current_draft");
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed && parsed.projectName) {
          setPrdData(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load draft from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setPrdHistory((prev) => {
        if (
          prev.length === 0 ||
          JSON.stringify(prev[prev.length - 1].data) !== JSON.stringify(prdData)
        ) {
          return [...prev, { timestamp: Date.now(), data: prdData }];
        }
        return prev;
      });
    }, 2000);
    return () => clearTimeout(t);
  }, [prdData]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (isFullscreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => setIsFullscreen(false));
      } else {
        setIsFullscreen(false);
      }
    } else {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
        // Fallback to fake fullscreen in restricted iframes
        setIsFullscreen(true);
      });
    }
  };

  // Save current draft to local storage on change
  const handlePRDChange = (updated: PRDData) => {
    setPrdData(updated);
    try {
      localStorage.setItem("prdforge_current_draft", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save draft", e);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    const tmpl = PRD_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setPrdData(tmpl.data);
    }
  };


  const handleCleanupFormat = () => {
    setPrdData((prev) => {
      const cleanString = (str: string) => {
        if (!str) return str;
        return str
          .replace(/\n{3,}/g, '\n\n')
          // Not replacing all spaces to avoid breaking markdown nested lists
          .trim();
      };
      
      const cleanObject = (obj: any): any => {
        if (typeof obj === 'string') return cleanString(obj);
        if (Array.isArray(obj)) return obj.map(cleanObject);
        if (obj !== null && typeof obj === 'object') {
          const newObj: any = {};
          for (const key in obj) {
            newObj[key] = cleanObject(obj[key]);
          }
          return newObj;
        }
        return obj;
      };

      return cleanObject(prev);
    });
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
    if (stepId === 0) {
      setViewMode("split");
    } else if (stepId === 1) {
      setViewMode("preview");
    } else if (stepId === 2) {
      setViewMode("split");
      window.dispatchEvent(new CustomEvent('SET_ACTIVE_TAB', { detail: 'signoff' }));
    } else if (stepId === 3) {
      setViewMode("preview");
      setIsPdfStylingModalOpen(true);
    }
  };

  const handleCopyMarkdown = () => {
    const md = prdToMarkdown(prdData);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const md = prdToMarkdown(prdData);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = (prdData.projectName || "PRD_Project").replace(
      /[^a-zA-Z0-9_-]/g,
      "_",
    );
    link.href = url;
    link.download = `${safeName}_PRD.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportHighFidelityPDF = (watermark?: string) => {
    setPendingPdfWatermark(watermark);
    setIsPdfStylingModalOpen(true);
  };

  const handleGeneratePdfWithStyling = async (options: {
    fontTheme: "sans" | "serif" | "mono";
    watermark?: string;
    density: "standard" | "compact";
    includeToc: boolean;
  }) => {
    try {
      setIsExportingPdf(true);
      setPdfExportProgress(0);
      setPdfExportStage('Preparing document');
      // Switch view mode if currently in editor or markdown mode so #prd-document-preview exists
      if (viewMode === "editor" || viewMode === "markdown") {
        setViewMode("split");
        await new Promise((r) => setTimeout(r, 200));
      }
      const safeName = (prdData.projectName || "PRD_Document").replace(
        /[^a-zA-Z0-9_-]/g,
        "_",
      );
      await exportToHighFidelityPDF("prd-document-preview", {
        filename: `${safeName}_PRD_Agreement.pdf`,
        watermark:
          options.watermark !== undefined
            ? options.watermark
            : pendingPdfWatermark,
        fontTheme: options.fontTheme,
        density: options.density,
        includeToc: options.includeToc,
        onProgress: (stage, progress) => {
          setPdfExportStage(stage);
          setPdfExportProgress(progress);
        }
      });
    } catch (err) {
      console.error("High-fidelity PDF Export error:", err);
      window.print();
    } finally {
      setIsExportingPdf(false);
      setPdfExportStage('');
      setPdfExportProgress(0);
    }
  };

  const handleExportSummaryPDF = (watermark?: string) => {
    const safeName = (prdData.projectName || "PRD_Document").replace(
      /[^a-zA-Z0-9_-]/g,
      "_",
    );
    const sections = [
      {
        title: "1. Project Description & Objectives",
        content:
          `${prdData.projectDescription}\n\nObjectives:\n` +
          prdData.projectObjectives.map((o) => `• ${o}`).join("\n"),
      },
      {
        title: "2. Commercial Valuation & Timeline",
        content: `Agreed Cost: ${prdData.currencySymbol}${prdData.projectCost}\nEstimated Timeline: ${prdData.estimatedTimeline}\nDocument Version: ${prdData.docVersion}`,
      },
      {
        title: "3. Technical Architecture",
        content: `Frontend: ${prdData.techStack.frontend}\nBackend: ${prdData.techStack.backend}\nDatabase: ${prdData.techStack.database}\nHosting: ${prdData.techStack.hosting}`,
      },
      {
        title: "4. Core Features",
        content: prdData.features
          .map((f) => `• [${f.priority}] ${f.feature}: ${f.description}`)
          .join("\n"),
      },
    ];
    exportTextSummaryWithJsPDF(
      "PRD Executive Summary",
      prdData.projectName || "Untitled Project",
      sections,
      `${safeName}_Executive_Summary.pdf`,
      watermark,
    );
  };

  const handleExportWord = async (watermark?: string) => {
    try {
      await exportToDocx(prdData, watermark);
    } catch (err) {
      console.error("Word export error:", err);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F4F1EE] dark:bg-[#121212] text-[#1A1A1A] dark:text-[#F4F1EE] flex flex-col font-sans selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-[#121212]">
      {/* Top Navigation */}
            {isExportingPdf && (
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
                style={{ width: `${pdfExportProgress}%` }}
              />
            </div>
            <p className="text-xs text-black/40 dark:text-white/40 mt-4 text-center">
              Please wait, this may take a few moments...
            </p>
          </div>
        </div>
      )}

      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        printMode={printMode}
        setPrintMode={setPrintMode}
        onOpenAIMagic={() => setIsAiModalOpen(true)}
          onOpenTranslate={() => setIsTranslateModalOpen(true)}
        onSelectTemplate={handleSelectTemplate}
        onCopyMarkdown={handleCopyMarkdown}
        onDownloadMarkdown={handleDownloadMarkdown}
        onExportHighFidelityPDF={handleExportHighFidelityPDF}
        onExportSummaryPDF={handleExportSummaryPDF}
        onExportWord={handleExportWord}
        onPrintPDF={handlePrintPDF}
        onSaveDoc={() => setIsSavedModalOpen(true)}
        onOpenSavedDocs={() => setIsSavedModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenBranding={() => setIsBrandingOpen(true)}
        onCleanupFormat={handleCleanupFormat}
        copied={copied}
        prdData={prdData}
        isExportingPdf={isExportingPdf}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-6">
        {/* Workflow Stepper */}
        {!isFullscreen && (
          <WorkflowStepper 
            data={prdData}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        )}

        {/* Banner callout for AI generation */}
        {!isFullscreen && (
          <div className="no-print mb-6 bg-[#EFECE7] dark:bg-[#1E1E1E] border border-black dark:border-white/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="w-9 h-9 bg-black dark:bg-white text-white dark:text-[#121212] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-serif font-bold text-[#1A1A1A] dark:text-[#F4F1EE] flex flex-wrap items-center gap-2">
                  Standard 33-Section PRD &amp; Agreement Generator
                  <span className="text-[9px] bg-black/5 dark:bg-white/5 text-black dark:text-white border border-black dark:border-white/20 px-2 py-0.5 uppercase tracking-widest font-sans font-bold">
                    Exact Format
                  </span>
                </h2>
                <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">
                  Generate tailored features, timelines, tech architecture,
                  payment milestones, and legal policies instantly.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="bg-black dark:bg-white hover:bg-black dark:hover:bg-white/80 text-white dark:text-[#121212] px-4 py-2 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center space-x-1.5 w-full sm:w-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Prompt AI to Draft</span>
              </button>
            </div>
          </div>
        )}

        {/* View Layouts */}
        {viewMode === "editor" && (
          <div className="animate-fade-in max-w-5xl mx-auto w-full min-w-0">
            <InteractiveForm data={prdData} onChange={handlePRDChange} />
          </div>
        )}

        {viewMode === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in w-full min-w-0">
            <div className="lg:col-span-5 no-print min-w-0">
              <div className="lg:sticky lg:top-20 min-w-0">
                <InteractiveForm data={prdData} onChange={handlePRDChange} />
              </div>
            </div>
            <div className="lg:col-span-7 min-w-0">
              <DocumentView data={prdData} printMode={printMode} />
            </div>
          </div>
        )}

        {viewMode === "preview" && (
          <div className="animate-fade-in w-full min-w-0 max-w-[1400px] mx-auto flex gap-6 px-4">
            <div className="hidden lg:block w-64 shrink-0 mt-4">
              <div className="sticky top-20 max-h-[85vh] overflow-y-auto no-scrollbar shadow-lg">
                <MiniMap data={prdData} onChange={handlePRDChange} />
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <DocumentView data={prdData} printMode={printMode} />
            </div>
          </div>
        )}

        
        {viewMode === "insights" && (
          <div className="animate-fade-in w-full min-w-0">
            <InsightsDashboard data={prdData} />
          </div>
        )}

        {viewMode === "markdown" && (
          <div className="animate-fade-in w-full min-w-0">
            <MarkdownView
              markdownText={prdToMarkdown(prdData)}
              onMarkdownChange={(newMd) => {
                // If user directly edits markdown
              }}
              onCopy={handleCopyMarkdown}
              copied={copied}
            />
          </div>
        )}
      </main>

      {/* Modals */}
            <AIMagicModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerated={handlePRDChange}
      />
      <TranslateModal
        isOpen={isTranslateModalOpen}
        onClose={() => setIsTranslateModalOpen(false)}
        currentData={prdData}
        onTranslated={(translated) => {
          handlePRDChange(translated);
          setIsTranslateModalOpen(false);
        }}
      />

      <PdfStylingModal
        isOpen={isPdfStylingModalOpen}
        onClose={() => setIsPdfStylingModalOpen(false)}
        onExport={handleGeneratePdfWithStyling}
        onPreview={(options) => {
          setPreviewOptions(options);
          setIsPreviewModalOpen(true);
        }}
      />

      <PrintPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onExport={() => {
          setIsPreviewModalOpen(false);
          setIsPdfStylingModalOpen(false);
          handleGeneratePdfWithStyling(previewOptions);
        }}
        prdData={prdData}
        fontTheme={previewOptions.fontTheme}
        density={previewOptions.density}
        printMode={printMode}
        setPrintMode={setPrintMode}
      />

      <SavedDocumentsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onLoadDoc={handlePRDChange}
        currentPRD={prdData}
      />

      <DocumentBrandingModal
        isOpen={isBrandingOpen}
        onClose={() => setIsBrandingOpen(false)}
        prdData={prdData}
        onSave={(updates) => {
          setPrdData(prev => ({ ...prev, ...updates }));
          // Add to history
          setPrdHistory(prev => [...prev, { timestamp: Date.now(), data: { ...prdData, ...updates } }]);
        }}
      />
      
      <VersionHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={prdHistory}
        onRevert={(data) => {
          setPrdData(data);
          // Save a snapshot of the revert action immediately
          setPrdHistory((prev) => [...prev, { timestamp: Date.now(), data }]);
        }}
      />

      {/* Footer */}
      {!isFullscreen && (
        <footer className="no-print border-t border-black dark:border-white/10 bg-[#F4F1EE] dark:bg-[#121212] py-6 text-center text-xs text-black/50 dark:text-white/50">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              PRDForge AI — Professional Product Requirements Document &amp;
              Project Agreement Builder
            </span>
            <span>
              Supports PDF Export, Markdown Download &amp; Server-Side Groq
              Llama 3.3 AI
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
