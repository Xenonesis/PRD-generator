import React, { useState } from 'react';
import { X, Palette, Image as ImageIcon, LayoutTemplate } from 'lucide-react';
import { PRDData } from '@/types/prd';

interface DocumentBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prdData: PRDData;
  onSave: (updates: Partial<PRDData>) => void;
}

export const DocumentBrandingModal: React.FC<DocumentBrandingModalProps> = ({
  isOpen,
  onClose,
  prdData,
  onSave
}) => {
  const [primaryColor, setPrimaryColor] = useState(prdData.brandingPrimaryColor || '#000000');
  const [logoUrl, setLogoUrl] = useState(prdData.brandingLogoUrl || '');
  const [headerStyle, setHeaderStyle] = useState<'standard' | 'minimal' | 'bold'>(
    prdData.brandingHeaderStyle || 'standard'
  );

  // Update local state if prdData changes
  React.useEffect(() => {
    if (isOpen) {
      setPrimaryColor(prdData.brandingPrimaryColor || '#000000');
      setLogoUrl(prdData.brandingLogoUrl || '');
      setHeaderStyle(prdData.brandingHeaderStyle || 'standard');
    }
  }, [isOpen, prdData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#F4F1EE] dark:bg-[#121212] border border-black dark:border-white/10 p-6 max-w-md w-full shadow-2xl animate-fade-in relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-serif font-black uppercase tracking-tight text-[#1A1A1A] dark:text-[#F4F1EE] mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Document Branding
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 mb-2 flex items-center gap-2">
              Primary Color
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 p-0 border-0 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 p-2 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none flex-grow uppercase font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Logo URL
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full bg-white dark:bg-[#2A2A2A] border border-black dark:border-white/10 p-2 text-sm text-[#1A1A1A] dark:text-[#F4F1EE] outline-none mb-2"
            />
            <p className="text-[10px] text-black/50 dark:text-white/50">
              Provide an image URL to be displayed on the cover page and headers.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black/80 dark:text-white/80 mb-2 flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4" />
              Page Header Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['standard', 'minimal', 'bold'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setHeaderStyle(style)}
                  className={`py-2 px-3 text-xs font-bold uppercase border transition ${
                    headerStyle === style
                      ? 'bg-black dark:bg-white text-white dark:text-[#121212] border-black dark:border-white'
                      : 'bg-white dark:bg-[#2A2A2A] text-black/70 dark:text-white/70 border-black dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold border border-black dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({
                brandingPrimaryColor: primaryColor,
                brandingLogoUrl: logoUrl,
                brandingHeaderStyle: headerStyle
              });
              onClose();
            }}
            className="px-4 py-2 text-sm font-bold bg-black dark:bg-white text-white dark:text-[#121212] hover:opacity-80 transition"
          >
            Apply Branding
          </button>
        </div>
      </div>
    </div>
  );
};
