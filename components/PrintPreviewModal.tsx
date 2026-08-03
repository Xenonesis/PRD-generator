import React, { useEffect } from 'react';
import { X, Printer, Download } from 'lucide-react';
import { DocumentView } from './DocumentView';
import { PRDData } from '@/types/prd';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  prdData: PRDData;
  fontTheme: 'sans' | 'serif' | 'mono';
  density: 'standard' | 'compact';
  printMode: 'full' | 'agreement';
  setPrintMode: (mode: 'full' | 'agreement') => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  onExport,
  prdData,
  fontTheme,
  density,
  printMode,
  setPrintMode
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const wasDark = document.documentElement.classList.contains('dark');
      if (wasDark) {
        document.documentElement.classList.remove('dark');
        return () => {
          document.body.style.overflow = '';
          document.documentElement.classList.add('dark');
        };
      }
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  let wrapperClasses = 'print-preview-mode bg-white text-black min-h-screen w-full mx-auto';
  if (fontTheme === 'serif') {
    wrapperClasses += ' font-serif';
  } else if (fontTheme === 'mono') {
    wrapperClasses += ' font-mono';
  } else {
    wrapperClasses += ' font-sans';
  }

  if (density === 'compact') {
    wrapperClasses += ' pdf-compact-density';
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#121212]/95 backdrop-blur-md overflow-hidden animate-fade-in">
      {/* Toolbar */}
      <div className="h-14 bg-[#1A1A1A] border-b border-white/20 flex items-center justify-between px-4 sm:px-6 shrink-0 text-white shadow-xl">
        <h2 className="font-bold flex items-center gap-2 uppercase tracking-wider text-sm">
          <Printer className="w-4 h-4" />
          Print Preview
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 opacity-70">
            <span className="uppercase font-mono">{fontTheme} Theme</span>
            <span>•</span>
            <span className="uppercase font-mono">{density} Density</span>
          </div>

          <div className="flex items-center space-x-1 border border-white/20 bg-black p-0.5 ml-1 mr-1">
            <button
              type="button"
              onClick={() => setPrintMode('full')}
              className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider transition ${
                printMode === 'full' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              Full PRD
            </button>
            <button
              type="button"
              onClick={() => setPrintMode('agreement')}
              className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider transition ${
                printMode === 'agreement' ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              Agreement Only
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onExport}
              className="bg-white text-black px-3 py-1.5 font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-white/80 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Generate PDF
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 transition border border-white/20 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Scrollable Preview Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <div className="bg-white max-w-[850px] mx-auto shadow-2xl border border-black/10">
          <div className={wrapperClasses}>
            <DocumentView data={prdData} printMode={printMode} />
          </div>
        </div>
      </div>
    </div>
  );
};
