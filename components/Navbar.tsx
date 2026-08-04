'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Languages, 
  FileText, 
  Eye, 
  Code2, PieChart as PieChartIcon, 
  Columns, 
  Copy, 
  Download, 
  Printer, 
  Save, 
  FolderOpen, 
  Check, 
  BookOpen,
  History,
  Palette,
  Maximize,
  Minimize,
  Wand2
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PRD_TEMPLATES } from '@/lib/templates';
import { PRDData } from '@/types/prd';

interface NavbarProps {
  viewMode: 'editor' | 'split' | 'preview' | 'markdown' | 'insights';
  setViewMode: (mode: 'editor' | 'split' | 'preview' | 'markdown' | 'insights') => void;
  printMode: 'full' | 'agreement';
  setPrintMode: (mode: 'full' | 'agreement') => void;
  onOpenAIMagic: () => void;
  onOpenTranslate: () => void;
  onSelectTemplate: (templateId: string) => void;
  onCopyMarkdown: () => void;
  onDownloadMarkdown: () => void;
  onExportHighFidelityPDF: (watermark?: string) => void;
  onExportSummaryPDF: (watermark?: string) => void;
  onExportWord: (watermark?: string) => void;
  onPrintPDF: () => void;
  onSaveDoc: () => void;
  onOpenSavedDocs: () => void;
  onOpenHistory: () => void;
  onOpenBranding: () => void;
  onCleanupFormat: () => void;
  copied: boolean;
  prdData: PRDData;
  isExportingPdf?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  printMode,
  setPrintMode,
  onOpenAIMagic,
  onOpenTranslate,
  onSelectTemplate,
  onCopyMarkdown,
  onDownloadMarkdown,
  onExportHighFidelityPDF,
  onExportSummaryPDF,
  onExportWord,
  onPrintPDF,
  onSaveDoc,
  onOpenSavedDocs,
  onOpenHistory,
  onOpenBranding,
  onCleanupFormat,
  copied,
  prdData,
  isExportingPdf = false,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isWatermarkEnabled, setIsWatermarkEnabled] = useState<boolean>(true);
  const [watermark, setWatermark] = useState<string>('DRAFT');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLastSaved(new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true }));
    }, 0);
    return () => clearTimeout(timer);
  }, [prdData]);

  const activeWatermark = isWatermarkEnabled ? (watermark.trim() || 'DRAFT') : undefined;

  return (
    <header className="no-print bg-white dark:bg-[#2A2A2A] border-b border-black dark:border-white/10 text-[#1A1A1A] dark:text-[#F4F1EE] sticky top-0 z-40 shadow-xs overflow-visible">
      {(showExportMenu || showTemplateMenu) && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => {
            setShowExportMenu(false);
            setShowTemplateMenu(false);
          }}
        />
      )}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative overflow-visible">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo & Project Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black dark:bg-white flex items-center justify-center text-white dark:text-[#121212] font-bold text-[10px] sm:text-xs tracking-wider shrink-0">
              P/A
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs sm:text-sm uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1EE] truncate">
                  PRD ARCHITECT <span className="text-black/40 dark:text-white/40 text-[10px] sm:text-xs hidden sm:inline">v1.0</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-widest bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 border border-black dark:border-white/10 px-1.5 py-0.5">
                  33 SECTIONS
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-black/50 dark:text-white/50 font-medium truncate max-w-[120px] sm:max-w-xs">
                {prdData.projectName || 'Untitled Project'}
              </p>
            </div>
          </div>

          {/* Center: Desktop View Switcher */}
          <div className="hidden lg:flex items-center bg-[#EFECE7] dark:bg-[#1E1E1E] p-1 border border-black dark:border-white/10 text-[10px] font-bold uppercase tracking-wider">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center space-x-1 px-3 py-1.5 transition-all ${
                viewMode === 'editor' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black dark:hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-[9px]">Editor</span>
            </button>

            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center space-x-1 px-3 py-1.5 transition-all ${
                viewMode === 'split' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black dark:hover:bg-white/5'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>

            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center space-x-1 px-3 py-1.5 transition-all ${
                viewMode === 'preview' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black dark:hover:bg-white/5'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[9px]">Preview</span>
            </button>

            <button
              onClick={() => setViewMode('markdown')}
              className={`flex items-center space-x-1 px-3 py-1.5 transition-all ${
                viewMode === 'markdown' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black dark:hover:bg-white/5'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
            <button
              onClick={() => setViewMode('insights')}
              className={`flex items-center space-x-1 px-3 py-1.5 transition-all ${
                viewMode === 'insights' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black dark:hover:bg-white/5'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span>Insights</span>
            </button>

          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-1">
            {/* Translate Button */}
            <button
              onClick={onOpenTranslate}
              className="flex items-center space-x-1 sm:space-x-1.5 bg-[#F4F1EE] dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] px-2.5 sm:px-3.5 py-1.5 text-[10px] uppercase font-bold tracking-wider transition active:scale-95"
              title="Translate Document"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Translate</span>
            </button>

            {/* AI Generator Button */}
            <button
              onClick={onOpenAIMagic}
              className="flex items-center space-x-1 sm:space-x-1.5 bg-black dark:bg-white hover:bg-neutral-800 text-white dark:text-[#121212] px-2.5 sm:px-3.5 py-1.5 text-[10px] uppercase font-bold tracking-wider transition active:scale-95 border border-black dark:border-white/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">AI Generator</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Template Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                className="flex items-center space-x-1 bg-white dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] px-2 sm:px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Templates</span>
              </button>

              {showTemplateMenu && (
                <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] max-h-[85vh] overflow-y-auto custom-scrollbar bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/30 shadow-2xl py-2 z-[60]">
                  <div className="px-3 py-1.5 text-[9px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest border-b border-black dark:border-white/10">
                    Sample Templates
                  </div>
                  {PRD_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        onSelectTemplate(tmpl.id);
                        setShowTemplateMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-[#F4F1EE] dark:hover:bg-[#2A2A2A] transition flex flex-col"
                    >
                      <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE]">{tmpl.name}</span>
                      <span className="text-[11px] text-black/50 dark:text-white/50 line-clamp-1">{tmpl.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Save & Load Modal Buttons */}
            {lastSaved && (
              <span className="hidden md:inline-block text-[10px] text-black/50 dark:text-white/50 font-mono tracking-wide px-2">
                Draft saved at {lastSaved}
              </span>
            )}
            <button
              onClick={onSaveDoc}
              title="Save document locally"
              className="bg-white dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] p-1.5 text-[10px] transition"
            >
              <Save className="w-3.5 h-3.5" />
            </button>



            <button
              onClick={onCleanupFormat}
              title="Cleanup Formatting"
              className="bg-white dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] p-1.5 text-[10px] transition hidden sm:inline-block"
            >
              <Wand2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenHistory}
              title="Version History"
              className="bg-white dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] p-1.5 text-[10px] transition hidden sm:inline-block"
            >
              <History className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenSavedDocs}
              title="Saved documents library"
              className="bg-white dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] p-1.5 text-[10px] transition hidden sm:inline-block"
            >
              <FolderOpen className="w-3.5 h-3.5" />
            </button>

            {/* Copy / Export / Print */}
            <button
              onClick={onCopyMarkdown}
              title="Copy Markdown"
              className="bg-white dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] px-2 sm:px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider transition flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden xl:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={onDownloadMarkdown}
              title="Download .md file"
              className="bg-white dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] p-1.5 text-[10px] transition hidden sm:inline-block"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Print Mode Toggle */}
            <div className="hidden md:flex items-center space-x-1 border border-black dark:border-white/20 bg-white dark:bg-[#2A2A2A] p-0.5">
              <button
                type="button"
                onClick={() => setPrintMode('full')}
                className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider transition ${
                  printMode === 'full' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black dark:hover:bg-white/5'
                }`}
              >
                Full PRD
              </button>
              <button
                type="button"
                onClick={() => setPrintMode('agreement')}
                className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider transition ${
                  printMode === 'agreement' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black dark:hover:bg-white/5'
                }`}
              >
                Agreement Only
              </button>
            </div>

            {/* Quick Watermark Toolbar Toggle */}
            <button
              type="button"
              onClick={() => setIsWatermarkEnabled(!isWatermarkEnabled)}
              title={isWatermarkEnabled ? `PDF Watermark Active: "${watermark || 'DRAFT'}" (Click to toggle)` : 'PDF Watermark Disabled (Click to enable)'}
              className={`px-2 sm:px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border transition flex items-center space-x-1 sm:space-x-1.5 ${
                isWatermarkEnabled
                  ? 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-200'
                  : 'bg-white dark:bg-[#2A2A2A] text-black/40 dark:text-white/40 border-black dark:border-white/20 hover:border-black dark:border-white/50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isWatermarkEnabled ? 'bg-amber-600 animate-pulse' : 'bg-black dark:bg-white/30'}`} />
              <span className="hidden md:inline">WM:</span>
              <span className="max-w-[50px] sm:max-w-[70px] truncate">{isWatermarkEnabled ? (watermark || 'DRAFT') : 'OFF'}</span>
            </button>

            <ThemeToggle />

            {/* Fullscreen Toggle */}
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              className="bg-white dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] p-1.5 text-[10px] transition hidden sm:flex items-center justify-center"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            </button>

            {/* Export PDF Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExportingPdf}
                title="Export or Print Document"
                className="px-2.5 sm:px-3.5 py-1.5 border border-black dark:border-white/30 text-[10px] uppercase font-bold tracking-wider bg-black dark:bg-white text-white dark:text-[#121212] hover:bg-black dark:hover:bg-white/80 transition-colors flex items-center space-x-1 sm:space-x-1.5 disabled:opacity-60"
              >
                {isExportingPdf ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                    <span className="hidden sm:inline">Rendering...</span>
                  </>
                ) : (
                  <>
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export PDF</span>
                  </>
                )}
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] max-h-[85vh] overflow-y-auto custom-scrollbar bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/30 shadow-2xl py-2 z-[60]">
                  <div className="px-3 py-1.5 text-[9px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest border-b border-black dark:border-white/10">
                    PDF Export Options
                  </div>

                  {/* Watermark Branding Section with Toggle */}
                  <div className="p-3 bg-[#F4F1EE] dark:bg-[#121212] border-b border-black dark:border-white/10 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-black dark:text-white flex items-center space-x-1.5">
                        <span>Watermark Overlay</span>
                        {isWatermarkEnabled && (
                          <span className="bg-amber-200 text-amber-900 px-1 py-0.2 text-[8px] font-mono font-bold rounded-xs">
                            ACTIVE
                          </span>
                        )}
                      </span>

                      {/* Toggle switch UI */}
                      <button
                        type="button"
                        onClick={() => setIsWatermarkEnabled(!isWatermarkEnabled)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isWatermarkEnabled ? 'bg-black dark:bg-white' : 'bg-black dark:bg-white/20'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-[#2A2A2A] shadow-lg ring-0 transition duration-200 ease-in-out ${
                            isWatermarkEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {isWatermarkEnabled ? (
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] text-black/60 dark:text-white/60 font-mono">Custom Text:</label>
                          {watermark && (
                            <button
                              onClick={() => setWatermark('')}
                              className="text-[9px] text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white uppercase tracking-wider underline font-mono"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={watermark}
                          onChange={(e) => setWatermark(e.target.value)}
                          placeholder="e.g. DRAFT, CONFIDENTIAL, ACME CORP..."
                          className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/20 focus:border-black dark:border-white/30 px-2.5 py-1 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none font-mono uppercase tracking-wider"
                        />
                        <div className="flex flex-wrap gap-1 pt-1">
                          {['DRAFT', 'CONFIDENTIAL', 'FOR REVIEW', prdData.clientName ? prdData.clientName.toUpperCase() : null].filter(Boolean).map((preset) => {
                            const val = preset as string;
                            const isSelected = watermark === val;
                            return (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setWatermark(val)}
                                className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider border transition ${
                                  isSelected
                                    ? 'bg-black dark:bg-white text-white dark:text-[#121212] border-black dark:border-white/30'
                                    : 'bg-white dark:bg-[#2A2A2A] text-black/70 dark:text-white/70 border-black dark:border-white/20 hover:border-black dark:hover:border-white/30'
                                }`}
                              >
                                {preset}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-black/50 dark:text-white/50 italic mt-1 font-sans">
                        Watermark is disabled. PDFs will render clean without background text overlays.
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onExportHighFidelityPDF(activeWatermark);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#F4F1EE] dark:hover:bg-[#2A2A2A] transition flex flex-col border-b border-black dark:border-white/10"
                  >
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE] text-xs flex items-center justify-between">
                      High-Fidelity PDF
                      <span className="text-[9px] bg-black dark:bg-white text-white dark:text-[#121212] px-1.5 py-0.5 uppercase tracking-wider font-mono">html2pdf + jsPDF</span>
                    </span>
                    <span className="text-[11px] text-black/60 dark:text-white/60 mt-0.5">
                      Preserves 33-section structure, exact fonts, tables, borders, cover page &amp; {isWatermarkEnabled ? `watermark ("${watermark || 'DRAFT'}")` : 'no watermark'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onExportSummaryPDF(activeWatermark);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#F4F1EE] dark:hover:bg-[#2A2A2A] transition flex flex-col border-b border-black dark:border-white/10"
                  >
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE] text-xs flex items-center justify-between">
                      Executive Summary PDF
                      <span className="text-[9px] bg-black/10 dark:bg-white/10 text-black dark:text-white px-1.5 py-0.5 uppercase tracking-wider font-mono">jsPDF Engine</span>
                    </span>
                    <span className="text-[11px] text-black/60 dark:text-white/60 mt-0.5">
                      Compact vector PDF summary containing key project parameters &amp; watermark
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onExportWord(activeWatermark);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#F4F1EE] dark:hover:bg-[#2A2A2A] transition flex flex-col border-b border-black dark:border-white/10"
                  >
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE] text-xs flex items-center justify-between">
                      Export to Word
                      <span className="text-[9px] bg-[#2b579a] text-white dark:text-[#121212] px-1.5 py-0.5 uppercase tracking-wider font-mono">.docx</span>
                    </span>
                    <span className="text-[11px] text-black/60 dark:text-white/60 mt-0.5">
                      Formatted Microsoft Word document preserving PRD structure
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onPrintPDF();
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#F4F1EE] dark:hover:bg-[#2A2A2A] transition flex flex-col"
                  >
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE] text-xs flex items-center justify-between">
                      System Print / Save PDF
                      <span className="text-[9px] text-black/40 dark:text-white/40 uppercase tracking-wider font-mono">Ctrl+P</span>
                    </span>
                    <span className="text-[11px] text-black/60 dark:text-white/60 mt-0.5">
                      Use browser standard print dialog to save PDF or print directly
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View Switcher Sub-bar */}
      <div className="md:hidden flex items-center justify-around bg-[#EFECE7] dark:bg-[#1E1E1E] border-t border-black dark:border-white/10 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider">
        <button
          onClick={() => setViewMode('editor')}
          className={`flex items-center space-x-1 px-2.5 py-1 transition-all ${
            viewMode === 'editor' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="text-[9px]">Editor</span>
        </button>

        <button
          onClick={() => setViewMode('split')}
          className={`flex items-center space-x-1 px-2.5 py-1 transition-all ${
            viewMode === 'split' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span className="text-[9px]">Split</span>
        </button>

        <button
          onClick={() => setViewMode('preview')}
          className={`flex items-center space-x-1 px-2.5 py-1 transition-all ${
            viewMode === 'preview' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="text-[9px]">Preview</span>
        </button>

        <button
          onClick={() => setViewMode('markdown')}
          className={`flex items-center space-x-1 px-2.5 py-1 transition-all ${
            viewMode === 'markdown' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="text-[9px]">Markdown</span>
        </button>
        <button
          onClick={() => setViewMode('insights')}
          className={`flex flex-col items-center space-y-0.5 px-2 py-1 transition-all ${
            viewMode === 'insights' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
          }`}
        >
          <PieChartIcon className="w-3.5 h-3.5" />
          <span className="text-[9px]">Insights</span>
        </button>
      </div>
    </header>
  );
};
