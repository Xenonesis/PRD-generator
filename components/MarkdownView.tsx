import React, { useState } from 'react';
import { Copy, Check, Code, FileText, Sparkles, Loader2, ArrowLeftRight } from 'lucide-react';
import { PRDData } from '@/types/prd';

interface MarkdownViewProps {
  markdownText: string;
  onMarkdownChange: (newMd: string) => void;
  onPRDUpdate: (data: PRDData) => void;
  onCopy: () => void;
  copied: boolean;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({
  markdownText,
  onMarkdownChange,
  onPRDUpdate,
  onCopy,
  copied
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [localMarkdown, setLocalMarkdown] = useState(markdownText);

  // Sync local markdown when external markdown changes (unless we are editing)
  React.useEffect(() => {
    if (!isEditable) {
      setLocalMarkdown(markdownText);
    }
  }, [markdownText, isEditable]);

  const handleSyncToPRD = async (promptText?: string) => {
    try {
      setIsProcessing(true);
      const res = await fetch('/api/groq/parse-markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: localMarkdown, prompt: promptText }),
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.prd) {
        onPRDUpdate(data.prd);
        if (promptText) {
          // If it was an AI prompt, we can exit edit mode and let the new markdown propagate
          setIsEditable(false);
        }
      }
    } catch (err) {
      console.error('Failed to parse markdown to PRD', err);
      alert('Failed to apply changes to PRD. Please check the format or try again.');
    } finally {
      setIsProcessing(false);
      setAiPrompt('');
    }
  };

  return (
    <div className="bg-[#EFECE7] dark:bg-[#1A1A1A] border border-black dark:border-white/10 text-[#1A1A1A] dark:text-[#F4F1EE] shadow-xs overflow-hidden no-print my-4 rounded-md">
      {/* AI Prompt Header */}
      <div className="bg-white dark:bg-[#121212] border-b border-black dark:border-white/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 flex items-center space-x-2 bg-[#F4F1EE] dark:bg-[#1A1A1A] border border-black/20 dark:border-white/20 p-1.5 rounded-sm">
          <Sparkles className="w-4 h-4 ml-1 text-black/60 dark:text-white/60" />
          <input
            type="text"
            placeholder="Ask AI to modify this document (e.g. 'Add a user profile section')"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            disabled={isProcessing}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && aiPrompt.trim()) handleSyncToPRD(aiPrompt);
            }}
            className="bg-transparent flex-1 outline-none text-xs text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40"
          />
          <button
            onClick={() => aiPrompt.trim() && handleSyncToPRD(aiPrompt)}
            disabled={!aiPrompt.trim() || isProcessing}
            className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 transition"
          >
            {isProcessing ? 'Generating...' : 'Apply AI'}
          </button>
        </div>
      </div>

      {/* Editor Header */}
      <div className="bg-[#F4F1EE] dark:bg-[#121212] border-b border-black dark:border-white/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-black dark:text-white" />
          <span className="font-bold text-xs uppercase tracking-wider text-black dark:text-white">Raw Markdown Code (33 Standard Sections)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {isEditable && (
            <button
              onClick={() => handleSyncToPRD()}
              disabled={isProcessing}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider border border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition rounded-xs"
            >
              {isProcessing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowLeftRight className="w-3.5 h-3.5" />
              )}
              <span>Sync to Form Data</span>
            </button>
          )}

          <button
            onClick={() => setIsEditable(!isEditable)}
            className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider border transition rounded-xs ${
              isEditable ? 'bg-black dark:bg-white text-white dark:text-[#121212] border-black dark:border-white/30' : 'bg-white dark:bg-[#252525] text-black dark:text-white border-black dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {isEditable ? 'Editing Raw Text' : 'Enable Direct Edit'}
          </button>

          <button
            onClick={onCopy}
            className="flex items-center space-x-1 bg-black dark:bg-white text-white dark:text-[#121212] hover:bg-black/80 dark:hover:bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wider transition rounded-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="relative bg-white dark:bg-[#1A1A1A]">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 text-black dark:text-white animate-spin mb-2" />
            <p className="text-xs font-bold uppercase tracking-wider text-black dark:text-white text-center">
              Processing Document &amp; Syncing State...
            </p>
          </div>
        )}
        
        {isEditable ? (
          <textarea
            value={localMarkdown}
            onChange={(e) => setLocalMarkdown(e.target.value)}
            rows={25}
            className="w-full font-mono text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-white dark:bg-[#121212] border-0 p-4 leading-relaxed outline-none transition"
          />
        ) : (
          <pre className="font-mono text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-[#F4F1EE] dark:bg-[#121212] border-0 p-4 overflow-x-auto max-h-[600px] whitespace-pre-wrap leading-relaxed select-all">
            {localMarkdown}
          </pre>
        )}
      </div>
    </div>
  );
};
