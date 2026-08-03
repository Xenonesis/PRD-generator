import React, { useEffect, useState } from 'react';
import { PRDData } from '@/types/prd';
import { getSectionAudits } from '@/components/InteractiveForm';
import { Check, XCircle, Eye, EyeOff, Settings } from 'lucide-react';

interface MiniMapProps {
  data: PRDData;
  onChange?: (updated: PRDData) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({ data, onChange }) => {
  const audits = getSectionAudits(data);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [availableIds, setAvailableIds] = useState<Set<number>>(new Set());
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Collect all existing section IDs after render
    const ids = new Set<number>();
    audits.forEach(a => {
      if (document.getElementById(`section-${a.id}`)) {
        ids.add(a.id);
      }
    });
    setAvailableIds(ids);

    const handleScroll = () => {
      const sections = audits.map(a => document.getElementById(`section-${a.id}`));
      let currentActive = null;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            currentActive = audits[i].id;
            break;
          }
        }
      }
      if (currentActive !== activeSection) {
        setActiveSection(currentActive);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data]);

  const toggleSection = (id: number) => {
    if (!onChange) return;
    const hidden = data.hiddenSections || [];
    const isHidden = hidden.includes(id);
    let newHidden;
    if (isHidden) {
      newHidden = hidden.filter(x => x !== id);
    } else {
      newHidden = [...hidden, id];
    }
    onChange({ ...data, hiddenSections: newHidden });
  };

  const hiddenSections = data.hiddenSections || [];

  return (
    <div className="bg-[#F4F1EE] dark:bg-[#121212] border border-black dark:border-white/10 shadow-sm flex flex-col h-full no-print">
      <div className="p-3 border-b border-black dark:border-white/10 bg-white dark:bg-[#1E1E1E] sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-[#F4F1EE]">
            Document Map
          </h3>
          {onChange && (
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition ${isEditMode ? 'text-black dark:text-white bg-black/5 dark:bg-white/5' : 'text-black/50 dark:text-white/50'}`}
              title="Toggle Sections View"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {!isEditMode && (
          <p className="text-[9px] text-black/50 dark:text-white/50 mt-1">
            {audits.filter(a => a.isComplete && !hiddenSections.includes(a.id)).length} / {audits.length - hiddenSections.length} Complete
          </p>
        )}
        {isEditMode && (
          <p className="text-[9px] text-black/50 dark:text-white/50 mt-1">
            Toggle visibility in exports
          </p>
        )}
      </div>
      <div className="overflow-y-auto p-2 space-y-0.5 max-h-[calc(100vh-120px)]">
        {audits.map((audit) => {
          const isHidden = hiddenSections.includes(audit.id);
          const exists = availableIds.has(audit.id);
          const canScroll = exists || audit.isComplete;
          
          if (isEditMode) {
            return (
              <button
                key={audit.id}
                onClick={() => toggleSection(audit.id)}
                className={`w-full text-left flex items-center justify-between p-1.5 text-[10px] transition hover:bg-black/5 dark:hover:bg-white/5 border-l-2 border-transparent ${isHidden ? 'opacity-50' : ''}`}
                title={isHidden ? "Show Section" : "Hide Section"}
              >
                <span className={`truncate pr-2 ${isHidden ? 'text-black/50 dark:text-white/50 line-through' : 'text-black/80 dark:text-white/80'}`}>
                  {audit.title}
                </span>
                {isHidden ? (
                  <EyeOff className="w-3.5 h-3.5 text-black/40 dark:text-white/40 shrink-0" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-black/80 dark:text-white/80 shrink-0" />
                )}
              </button>
            );
          }

          return (
            <button
              key={audit.id}
              onClick={() => {
                const el = document.getElementById(`section-${audit.id}`);
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              disabled={(!canScroll && !exists) || isHidden}
              className={`w-full text-left flex items-center justify-between p-1.5 text-[10px] transition ${
                activeSection === audit.id
                  ? 'bg-black/10 dark:bg-white/10 font-bold border-l-2 border-black dark:border-white'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 border-l-2 border-transparent'
              } ${(!exists && !audit.isComplete) || isHidden ? 'opacity-40 cursor-not-allowed' : ''}`}
              title={audit.title + (!audit.isComplete && audit.missingDetail ? ` - Missing: ${audit.missingDetail}` : '') + (isHidden ? ' (Hidden)' : '')}
            >
              <span className={`truncate pr-2 ${isHidden ? 'text-black/40 dark:text-white/40 line-through' : 'text-black/80 dark:text-white/80'}`}>
                {audit.title}
              </span>
              {isHidden ? (
                <EyeOff className="w-3 h-3 text-black/30 dark:text-white/30 shrink-0" />
              ) : audit.isComplete ? (
                <Check className="w-3 h-3 text-green-600 dark:text-green-400 shrink-0" />
              ) : (
                <XCircle className="w-3 h-3 text-red-500/70 dark:text-red-400/70 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
