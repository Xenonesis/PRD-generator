import React, { useState } from 'react';
import { Wand2, Loader2, X, Check } from 'lucide-react';
import { PRDData } from '@/types/prd';

interface AIQuickFillProps {
  field: string;
  schemaDescription: string;
  data: PRDData;
  onUpdate: (result: any) => void;
  title: string;
}

export const AIQuickFill: React.FC<AIQuickFillProps> = ({ field, schemaDescription, data, onUpdate, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/gemini/quick-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          contextData: data,
          instructions,
          schemaDescription
        }),
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to generate content');
      }

      onUpdate(resData.result);
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setInstructions('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error generating content');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block ml-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center bg-[#F4F1EE] dark:bg-[#121212] border border-black/20 dark:border-white/20 rounded p-1 hover:bg-black/5 dark:hover:bg-white/10 transition text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
        title={`AI Quick Fill for ${title}`}
      >
        <Wand2 className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-[#1A1A1A] border border-black dark:border-white/20 shadow-2xl z-50 p-3 rounded-none animate-fade-in text-[#1A1A1A] dark:text-[#F4F1EE]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Wand2 className="w-3 h-3" /> Quick Fill: {title}
            </span>
            <button onClick={() => setIsOpen(false)} className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-black/60 dark:text-white/60 mb-2">
            Leave blank for auto-generation based on project context, or provide specific instructions.
          </p>
          <textarea
            className="w-full bg-[#F4F1EE] dark:bg-[#121212] border border-black/20 dark:border-white/20 p-2 text-xs h-20 outline-none focus:border-black dark:focus:border-white transition resize-none mb-2"
            placeholder="e.g. Focus heavily on GDPR compliance..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
          {error && <p className="text-xs text-red-600 dark:text-red-400 mb-2">{error}</p>}
          <button
            onClick={handleGenerate}
            disabled={isLoading || success}
            className="w-full bg-black dark:bg-white text-white dark:text-[#121212] text-[10px] font-bold uppercase tracking-wider py-2 flex items-center justify-center hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 transition"
          >
            {isLoading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> Generating...</>
            ) : success ? (
              <><Check className="w-3.5 h-3.5 mr-2" /> Applied!</>
            ) : (
              'Generate Content'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
