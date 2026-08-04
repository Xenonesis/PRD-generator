'use client';

import React, { useState } from 'react';
import { Copy, Check, Code, FileText } from 'lucide-react';

interface MarkdownViewProps {
  markdownText: string;
  onMarkdownChange: (newMd: string) => void;
  onCopy: () => void;
  copied: boolean;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({
  markdownText,
  onMarkdownChange,
  onCopy,
  copied
}) => {
  const [isEditable, setIsEditable] = useState(false);

  return (
    <div className="bg-[#EFECE7] dark:bg-[#1A1A1A] border border-black dark:border-white/10 text-[#1A1A1A] dark:text-[#F4F1EE] shadow-xs overflow-hidden no-print my-4 rounded-md">
      {/* Header */}
      <div className="bg-[#F4F1EE] dark:bg-[#121212] border-b border-black dark:border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="w-4 h-4 text-black dark:text-white" />
          <span className="font-bold text-xs uppercase tracking-wider text-black dark:text-white">Raw Markdown Code (33 Standard Sections)</span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
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
      <div className="p-4 bg-white dark:bg-[#1A1A1A]">
        {isEditable ? (
          <textarea
            value={markdownText}
            onChange={(e) => onMarkdownChange(e.target.value)}
            rows={25}
            className="w-full font-mono text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-white dark:bg-[#121212] border border-black dark:border-white/10 p-4 leading-relaxed outline-none focus:border-black dark:focus:border-white/30 transition rounded-xs"
          />
        ) : (
          <pre className="font-mono text-xs text-[#1A1A1A] dark:text-[#F4F1EE] bg-[#F4F1EE] dark:bg-[#121212] border border-black dark:border-white/10 p-4 overflow-x-auto max-h-[600px] whitespace-pre-wrap leading-relaxed select-all rounded-xs">
            {markdownText}
          </pre>
        )}
      </div>
    </div>
  );
};
