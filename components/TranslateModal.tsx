'use client';

import React, { useState } from 'react';
import { Languages, X, Loader2, ArrowRight } from 'lucide-react';
import { PRDData } from '@/types/prd';

interface TranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: PRDData;
  onTranslated: (prd: PRDData) => void;
}

const LANGUAGES = [
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Korean',
  'Portuguese',
  'Italian',
  'Dutch',
  'Arabic',
  'Hindi',
  'Chinese (Simplified)',
  'Russian'
];

export const TranslateModal: React.FC<TranslateModalProps> = ({ isOpen, onClose, currentData, onTranslated }) => {
  const [targetLanguage, setTargetLanguage] = useState(LANGUAGES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTranslate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/translate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prdData: currentData, targetLanguage }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to translate PRD.');
      }
      
      if (data.prd) {
        onTranslated(data.prd);
      } else {
        throw new Error('Invalid response format.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during translation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#1E1E1E] border-2 border-black dark:border-white/20 w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-black dark:border-white/20">
          <div className="flex items-center space-x-2 text-[#1A1A1A] dark:text-[#F4F1EE]">
            <Languages className="w-5 h-5" />
            <h2 className="font-serif font-bold text-lg uppercase tracking-wider">Translate Document</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 hover:bg-[#F4F1EE] dark:hover:bg-[#2A2A2A] transition-colors disabled:opacity-50 text-black dark:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-[#FAFAFA] dark:bg-[#121212]">
          <div className="mb-6 bg-[#F4F1EE] dark:bg-[#2A2A2A] border border-black dark:border-white/20 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 mb-2">How it works</h3>
            <p className="text-[11px] text-black/60 dark:text-white/60 leading-relaxed">
              This will securely translate the entire 33-section structure of your current document into the selected language using AI, preserving the JSON structure and all exact technical formatting.
            </p>

            <p className="text-[11px] text-black/60 dark:text-white/60 leading-relaxed mt-2 italic">
              Note: Translating a large document may take 20-30 seconds.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-2">Target Language</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={loading}
                className="w-full bg-white dark:bg-[#1E1E1E] border-2 border-black dark:border-white/20 focus:border-black dark:focus:border-white px-3 py-2 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none transition-colors"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 p-3 text-xs flex items-start gap-2 mt-4">
                <X className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-black dark:border-white/20 bg-white dark:bg-[#1E1E1E] flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="bg-black dark:bg-white text-white dark:text-[#121212] px-6 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Translating...</span>
              </>
            ) : (
              <>
                <span>Translate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
