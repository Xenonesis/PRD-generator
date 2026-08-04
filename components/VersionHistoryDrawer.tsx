import React, { useState } from 'react';
import { PRDData } from '@/types/prd';
import { X, Clock, RotateCcw, AlertTriangle } from 'lucide-react';

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: { timestamp: number; data: PRDData }[];
  onRevert: (data: PRDData) => void;
}

export const VersionHistoryDrawer: React.FC<VersionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onRevert
}) => {
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-80 max-w-sm bg-white dark:bg-[#1A1A1A] border-l border-black/10 dark:border-white/10 shadow-2xl flex flex-col transform transition-transform animate-fade-in text-[#1A1A1A] dark:text-[#F4F1EE]" style={{ overscrollBehavior: 'contain' }}>
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-[#F4F1EE] dark:bg-[#121212]">
          <h2 className="font-serif font-bold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Version History
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50 text-center mt-10">No history available yet.</p>
          ) : (
            [...history].reverse().map((item, index) => {
              const d = new Date(item.timestamp);
              const isLatest = index === 0;
              const isConfirming = confirmIndex === index;
              return (
                <div key={item.timestamp} className="p-3 border border-black/10 dark:border-white/10 bg-[#F4F1EE] dark:bg-[#121212] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60">
                      {d.toLocaleDateString()} {d.toLocaleTimeString()}
                    </span>
                    {isLatest && (
                      <span className="text-[9px] bg-black dark:bg-white text-white dark:text-[#121212] px-1.5 py-0.5 uppercase font-bold tracking-widest">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm font-serif">
                    {item.data.projectName || 'Untitled Project'}
                  </div>
                  
                  {!isLatest && !isConfirming && (
                    <button 
                      onClick={() => setConfirmIndex(index)}
                      className="mt-2 text-xs flex items-center justify-center gap-1.5 w-full py-1.5 border border-black/20 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore Version
                    </button>
                  )}

                  {!isLatest && isConfirming && (
                    <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-sm">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-800 dark:text-amber-300">
                          This will overwrite your current changes. Are you sure?
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            onRevert(item.data);
                            setConfirmIndex(null);
                            onClose();
                          }}
                          className="flex-1 py-1 text-[11px] font-bold bg-black dark:bg-white text-white dark:text-black transition"
                        >
                          Yes, Restore
                        </button>
                        <button
                          onClick={() => setConfirmIndex(null)}
                          className="flex-1 py-1 text-[11px] font-bold border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};
