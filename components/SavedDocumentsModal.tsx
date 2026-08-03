'use client';

import React, { useState, useEffect } from 'react';
import { X, FolderOpen, Trash2, FileText, Calendar, Plus, Save } from 'lucide-react';
import { PRDData } from '@/types/prd';

interface SavedDocItem {
  id: string;
  title: string;
  clientName: string;
  savedAt: string;
  data: PRDData;
}

interface SavedDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDoc: (prd: PRDData) => void;
  currentPRD: PRDData;
}

export const SavedDocumentsModal: React.FC<SavedDocumentsModalProps> = ({
  isOpen,
  onClose,
  onLoadDoc,
  currentPRD
}) => {
  const [docs, setDocs] = useState<SavedDocItem[]>([]);
  const [newTitle, setNewTitle] = useState(currentPRD.projectName || 'My Project PRD');

  useEffect(() => {
    if (isOpen) {
      const handle = requestAnimationFrame(() => {
        try {
          const stored = localStorage.getItem('prdforge_saved_docs');
          if (stored) {
            setDocs(JSON.parse(stored));
          }
        } catch (e) {
          console.error('Failed to load saved docs', e);
        }
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [isOpen]);




  const handleSaveCurrent = () => {
    const titleToUse = newTitle.trim() || currentPRD.projectName || 'Untitled PRD';
    const newDocItem: SavedDocItem = {
      id: Date.now().toString(),
      title: titleToUse,
      clientName: currentPRD.clientName || 'N/A',
      savedAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: currentPRD
    };

    const updated = [newDocItem, ...docs];
    setDocs(updated);
    localStorage.setItem('prdforge_saved_docs', JSON.stringify(updated));
    alert('PRD saved successfully to browser storage!');
  };

  const handleDelete = (id: string) => {
    const updated = docs.filter(d => d.id !== id);
    setDocs(updated);
    localStorage.setItem('prdforge_saved_docs', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-white/60 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-[#F4F1EE] dark:bg-[#121212] border border-black dark:border-white/30 text-[#1A1A1A] dark:text-[#F4F1EE] max-w-xl w-full p-4 sm:p-6 shadow-2xl relative overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black dark:border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-[#121212] flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1A1A1A] dark:text-[#F4F1EE]">Saved PRD Library</h3>
              <p className="text-xs text-black/60 dark:text-white/60">Manage and load saved project requirements</p>
            </div>
          </div>

          <button onClick={onClose} className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white p-1.5 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Current Section */}
        <div className="my-4 p-3 bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-1">Save Current PRD Draft</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Document Title"
              className="flex-1 bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 px-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F1EE] outline-none"
            />
            <button
              onClick={handleSaveCurrent}
              className="bg-black dark:bg-white hover:bg-black dark:hover:bg-white/80 text-white dark:text-[#121212] px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Document</span>
            </button>
          </div>
        </div>

        {/* Saved List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {docs.length === 0 ? (
            <div className="text-center py-8 text-xs text-black/40 dark:text-white/40">
              No saved PRDs found in local storage. Click &quot;Save Document&quot; to save your current work!
            </div>
          ) : (
            docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 hover:border-black dark:hover:border-white/30 p-3 flex items-center justify-between transition text-xs"
              >
                <div className="space-y-0.5">
                  <h4 className="font-bold text-[#1A1A1A] dark:text-[#F4F1EE]">{doc.title}</h4>
                  <div className="flex items-center space-x-3 text-[11px] text-black/60 dark:text-white/60">
                    <span>Client: {doc.clientName}</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-black/40 dark:text-white/40" />
                      <span>{doc.savedAt}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      onLoadDoc(doc.data);
                      onClose();
                    }}
                    className="bg-[#EFECE7] dark:bg-[#1E1E1E] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] text-black dark:text-white px-3 py-1 text-xs font-bold uppercase tracking-wider border border-black dark:border-white/10 transition"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-black/40 dark:text-white/40 hover:text-red-600 p-1 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-black dark:border-white/10 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
