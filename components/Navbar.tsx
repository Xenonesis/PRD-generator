'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Languages, 
  FileText, 
  Eye, 
  Code2, 
  PieChart as PieChartIcon, 
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
  Wand2,
  Menu,
  X,
  ChevronDown,
  SlidersHorizontal,
  FileSpreadsheet
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
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showTemplateSubmenu, setShowTemplateSubmenu] = useState(false);
  
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

  const closeAllMenus = () => {
    setShowExportMenu(false);
    setShowToolsMenu(false);
    setShowMobileMenu(false);
    setShowTemplateSubmenu(false);
  };

  return (
    <header className="no-print bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b border-black/10 dark:border-white/10 text-[#1A1A1A] dark:text-[#F4F1EE] sticky top-0 z-40 shadow-xs">
      {/* Backdrop overlay for menus */}
      {(showExportMenu || showToolsMenu || showMobileMenu) && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={closeAllMenus} />
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          
          {/* LEFT: Brand Logo & Title */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 bg-black dark:bg-white flex items-center justify-center text-white dark:text-[#121212] font-black text-xs tracking-wider shrink-0 rounded-xs shadow-xs">
              P/A
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-xs sm:text-sm uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1EE] truncate">
                  PRD ARCHITECT
                </span>
                <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-widest bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 border border-black/10 dark:border-white/20 px-1.5 py-0.5 rounded-xs">
                  33 SECTIONS
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-black/50 dark:text-white/50">
                <span className="font-medium truncate max-w-[120px] sm:max-w-[200px]">
                  {prdData.projectName || 'Untitled Project'}
                </span>
                {lastSaved && (
                  <span className="hidden md:inline-flex items-center gap-1 font-mono text-[9px] text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Saved {lastSaved}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CENTER: Desktop View Switcher Segmented Control */}
          <div className="hidden lg:flex items-center bg-neutral-100 dark:bg-black/40 p-1 border border-black/10 dark:border-white/15 rounded-md text-xs font-bold uppercase tracking-wider">
            {[
              { id: 'editor', label: 'Editor', icon: FileText },
              { id: 'split', label: 'Split View', icon: Columns },
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'markdown', label: 'Markdown', icon: Code2 },
              { id: 'insights', label: 'Insights', icon: PieChartIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-sm transition-all text-[10px] ${
                    isActive 
                      ? 'bg-black dark:bg-white text-white dark:text-[#121212] shadow-xs' 
                      : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Action Group */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* AI Generator CTA Button */}
            <button
              onClick={onOpenAIMagic}
              className="flex items-center space-x-1.5 bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-[#121212] px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition active:scale-95 border border-black dark:border-white/30 rounded-xs shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" />
              <span className="hidden sm:inline">Prompt AI</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Export Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  const newState = !showExportMenu;
                  closeAllMenus();
                  setShowExportMenu(newState);
                }}
                disabled={isExportingPdf}
                className="flex items-center space-x-1.5 bg-neutral-100 dark:bg-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black/20 dark:border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition rounded-xs text-black dark:text-white disabled:opacity-50"
              >
                {isExportingPdf ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </>
                )}
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-[#1C1C1C] border border-black/20 dark:border-white/20 shadow-2xl rounded-sm py-2 z-[60]">
                  <div className="px-3 py-1 text-[9px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest border-b border-black/10 dark:border-white/10">
                    Export Options
                  </div>

                  {/* Watermark Section inside Export Menu */}
                  <div className="p-3 bg-neutral-50 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-black dark:text-white flex items-center space-x-1.5">
                        <span>Watermark Overlay</span>
                        {isWatermarkEnabled && (
                          <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-1 py-0.2 text-[8px] font-mono font-bold rounded-xs">
                            ACTIVE
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsWatermarkEnabled(!isWatermarkEnabled)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          isWatermarkEnabled ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-white/20'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-[#1C1C1C] shadow-md transition duration-200 ease-in-out ${
                            isWatermarkEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {isWatermarkEnabled && (
                      <div className="space-y-1.5 mt-2">
                        <input
                          type="text"
                          value={watermark}
                          onChange={(e) => setWatermark(e.target.value)}
                          placeholder="WATERMARK TEXT..."
                          className="w-full bg-white dark:bg-[#121212] border border-black/20 dark:border-white/20 px-2 py-1 text-xs text-black dark:text-white outline-none font-mono uppercase tracking-wider"
                        />
                        <div className="flex flex-wrap gap-1">
                          {['DRAFT', 'CONFIDENTIAL', 'FOR REVIEW'].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setWatermark(preset)}
                              className={`text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-wider border ${
                                watermark === preset
                                  ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                  : 'bg-white dark:bg-black/30 border-black/10 dark:border-white/20'
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      closeAllMenus();
                      onExportHighFidelityPDF(activeWatermark);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-neutral-100 dark:hover:bg-white/5 transition flex flex-col border-b border-black/5 dark:border-white/5"
                  >
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE] text-xs flex items-center justify-between">
                      High-Fidelity PDF
                      <span className="text-[9px] bg-black dark:bg-white text-white dark:text-black px-1.5 py-0.5 uppercase tracking-wider font-mono">HTML2PDF</span>
                    </span>
                    <span className="text-[10px] text-black/60 dark:text-white/60 mt-0.5">
                      Full 33-section formatted document PDF
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      closeAllMenus();
                      onExportSummaryPDF(activeWatermark);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-neutral-100 dark:hover:bg-white/5 transition flex flex-col border-b border-black/5 dark:border-white/5"
                  >
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE] text-xs flex items-center justify-between">
                      Executive Summary PDF
                      <span className="text-[9px] bg-neutral-200 dark:bg-white/20 text-black dark:text-white px-1.5 py-0.5 uppercase tracking-wider font-mono">jsPDF</span>
                    </span>
                    <span className="text-[10px] text-black/60 dark:text-white/60 mt-0.5">
                      Compact summary PDF file
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      closeAllMenus();
                      onExportWord(activeWatermark);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-neutral-100 dark:hover:bg-white/5 transition flex flex-col border-b border-black/5 dark:border-white/5"
                  >
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE] text-xs flex items-center justify-between">
                      Export Word (.docx)
                      <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 uppercase tracking-wider font-mono">Word</span>
                    </span>
                    <span className="text-[10px] text-black/60 dark:text-white/60 mt-0.5">
                      Editable Microsoft Word file
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      closeAllMenus();
                      onDownloadMarkdown();
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-neutral-100 dark:hover:bg-white/5 transition flex flex-col border-b border-black/5 dark:border-white/5"
                  >
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE] text-xs flex items-center justify-between">
                      Download Markdown (.md)
                      <span className="text-[9px] bg-neutral-200 dark:bg-white/20 text-black dark:text-white px-1.5 py-0.5 uppercase tracking-wider font-mono">MD</span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      closeAllMenus();
                      onCopyMarkdown();
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-neutral-100 dark:hover:bg-white/5 transition flex items-center justify-between border-b border-black/5 dark:border-white/5 text-xs font-bold text-black dark:text-white"
                  >
                    <span>Copy Markdown Text</span>
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      closeAllMenus();
                      onPrintPDF();
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-neutral-100 dark:hover:bg-white/5 transition flex items-center justify-between text-xs font-bold text-black dark:text-white"
                  >
                    <span>System Print / Save PDF</span>
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Tools Menu Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => {
                  const newState = !showToolsMenu;
                  closeAllMenus();
                  setShowToolsMenu(newState);
                }}
                className="flex items-center space-x-1.5 bg-neutral-100 dark:bg-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black/20 dark:border-white/20 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider transition rounded-xs text-black dark:text-white"
                title="Tools & Settings"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showToolsMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1C1C1C] border border-black/20 dark:border-white/20 shadow-2xl rounded-sm py-2 z-[60]">
                  <div className="px-3 py-1 text-[9px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest border-b border-black/10 dark:border-white/10">
                    Document Tools
                  </div>

                  <button
                    onClick={() => {
                      closeAllMenus();
                      onOpenTranslate();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-white/5 flex items-center space-x-2 text-black dark:text-white border-b border-black/5 dark:border-white/5"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>Translate Document</span>
                  </button>

                  {/* Templates Submenu Toggle */}
                  <div className="border-b border-black/5 dark:border-white/5">
                    <button
                      onClick={() => setShowTemplateSubmenu(!showTemplateSubmenu)}
                      className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-white/5 flex items-center justify-between text-black dark:text-white"
                    >
                      <span className="flex items-center space-x-2">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Load Sample Template</span>
                      </span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${showTemplateSubmenu ? 'rotate-180' : ''}`} />
                    </button>
                    {showTemplateSubmenu && (
                      <div className="bg-neutral-50 dark:bg-black/40 py-1 border-t border-black/5 dark:border-white/5">
                        {PRD_TEMPLATES.map((tmpl) => (
                          <button
                            key={tmpl.id}
                            onClick={() => {
                              onSelectTemplate(tmpl.id);
                              closeAllMenus();
                            }}
                            className="w-full text-left px-4 py-1.5 text-xs hover:bg-black/5 dark:hover:bg-white/10 flex flex-col"
                          >
                            <span className="font-bold text-black dark:text-white text-[11px]">{tmpl.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      closeAllMenus();
                      onOpenBranding();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-white/5 flex items-center space-x-2 text-black dark:text-white border-b border-black/5 dark:border-white/5"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Document Branding</span>
                  </button>

                  <button
                    onClick={() => {
                      closeAllMenus();
                      onOpenHistory();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-white/5 flex items-center space-x-2 text-black dark:text-white border-b border-black/5 dark:border-white/5"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Version History</span>
                  </button>

                  <button
                    onClick={() => {
                      closeAllMenus();
                      onOpenSavedDocs();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-white/5 flex items-center space-x-2 text-black dark:text-white border-b border-black/5 dark:border-white/5"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Saved Library</span>
                  </button>

                  <button
                    onClick={() => {
                      closeAllMenus();
                      onCleanupFormat();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-white/5 flex items-center space-x-2 text-black dark:text-white border-b border-black/5 dark:border-white/5"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Cleanup Formatting</span>
                  </button>

                  {/* Print Scope Segmented Switch */}
                  <div className="px-3 py-2 border-b border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-black dark:text-white">
                    <span className="font-bold text-[10px] uppercase tracking-wider">Print Scope</span>
                    <div className="flex bg-neutral-200 dark:bg-black/50 p-0.5 rounded-xs">
                      <button
                        onClick={() => setPrintMode('full')}
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase ${printMode === 'full' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/70 dark:text-white/70'}`}
                      >
                        Full
                      </button>
                      <button
                        onClick={() => setPrintMode('agreement')}
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase ${printMode === 'agreement' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/70 dark:text-white/70'}`}
                      >
                        Agreement
                      </button>
                    </div>
                  </div>

                  <div className="px-3 py-2 flex items-center justify-between text-xs text-black dark:text-white">
                    <span className="font-bold text-[10px] uppercase tracking-wider">Theme</span>
                    <ThemeToggle />
                  </div>

                  {onToggleFullscreen && (
                    <button
                      onClick={() => {
                        closeAllMenus();
                        onToggleFullscreen();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-white/5 flex items-center space-x-2 text-black dark:text-white border-t border-black/5 dark:border-white/5"
                    >
                      {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                      <span>{isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Drawer Button */}
            <div className="lg:hidden">
              <button
                onClick={() => {
                  const newState = !showMobileMenu;
                  closeAllMenus();
                  setShowMobileMenu(newState);
                }}
                className="bg-neutral-100 dark:bg-white/10 text-black dark:text-white p-2 rounded-xs border border-black/20 dark:border-white/20"
              >
                {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1A1A] px-4 py-3 space-y-3 max-h-[85vh] overflow-y-auto">
          {/* Mobile View Switcher */}
          <div>
            <div className="text-[9px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest mb-1.5">
              View Mode
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 bg-neutral-100 dark:bg-black/40 p-1 border border-black/10 dark:border-white/10 rounded-sm">
              {[
                { id: 'editor', label: 'Editor', icon: FileText },
                { id: 'split', label: 'Split', icon: Columns },
                { id: 'preview', label: 'Preview', icon: Eye },
                { id: 'markdown', label: 'MD', icon: Code2 },
                { id: 'insights', label: 'Insights', icon: PieChartIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = viewMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setViewMode(tab.id as any);
                      setShowMobileMenu(false);
                    }}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-xs text-[9px] font-bold uppercase ${
                      isActive ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/70 dark:text-white/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mb-0.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Tools */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/10 dark:border-white/10">
            <button
              onClick={() => { setShowMobileMenu(false); onOpenTranslate(); }}
              className="flex items-center space-x-2 p-2 bg-neutral-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold text-black dark:text-white"
            >
              <Languages className="w-4 h-4" />
              <span>Translate</span>
            </button>
            <button
              onClick={() => { setShowMobileMenu(false); onOpenBranding(); }}
              className="flex items-center space-x-2 p-2 bg-neutral-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold text-black dark:text-white"
            >
              <Palette className="w-4 h-4" />
              <span>Branding</span>
            </button>
            <button
              onClick={() => { setShowMobileMenu(false); onOpenHistory(); }}
              className="flex items-center space-x-2 p-2 bg-neutral-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold text-black dark:text-white"
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </button>
            <button
              onClick={() => { setShowMobileMenu(false); onOpenSavedDocs(); }}
              className="flex items-center space-x-2 p-2 bg-neutral-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold text-black dark:text-white"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Saved Docs</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10 text-xs text-black dark:text-white">
            <span className="font-bold uppercase tracking-wider text-[10px]">Theme Mode</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
};
