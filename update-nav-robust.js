const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

// 1. Add imports
code = code.replace('  Wand2\n} from', '  Wand2,\n  Menu,\n  X\n} from');
code = code.replace('  Wand2\r\n} from', '  Wand2,\n  Menu,\n  X\n} from');

// 2. Add showMobileMenu state
code = code.replace('const [showExportMenu, setShowExportMenu] = useState(false);', 'const [showExportMenu, setShowExportMenu] = useState(false);\n  const [showMobileMenu, setShowMobileMenu] = useState(false);');

// 3. Update fixed backdrop to close mobile menu
code = code.replace('{(showExportMenu || showTemplateMenu) &&', '{(showExportMenu || showTemplateMenu || showMobileMenu) &&');
code = code.replace('setShowTemplateMenu(false);', 'setShowTemplateMenu(false);\n            setShowMobileMenu(false);');

// 4. Update the "Right Actions" container wrapper
// Change `overflow-x-auto no-scrollbar` to `shrink-0`
code = code.replace(/className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-1"/, 'className="flex items-center space-x-1 sm:space-x-2 shrink-0 py-1"');

// 5. Hide secondary buttons on mobile
code = code.replace(
  /className="flex items-center space-x-1 sm:space-x-1\.5 bg-\[#F4F1EE\]/g, 
  'className="hidden sm:flex items-center space-x-1 sm:space-x-1.5 bg-[#F4F1EE]'
);
code = code.replace(
  /\{\/\* Template Dropdown \*\/\}\s*<div className="relative">/,
  '{/* Template Dropdown */}\n            <div className="hidden sm:block relative">'
);
code = code.replace(
  /className="bg-white dark:bg-\[#2A2A2A\] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-\[#121212\] border border-black dark:border-white\/20 text-\[#1A1A1A\] dark:text-\[#F4F1EE\] px-2 sm:px-2\.5 py-1\.5 text-\[10px\] uppercase font-bold tracking-wider transition flex items-center space-x-1"/g,
  'className="hidden sm:flex bg-white dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] px-2 sm:px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider transition items-center space-x-1"'
);
code = code.replace(
  /className=\{`px-2 sm:px-2\.5 py-1\.5 text-\[10px\] font-mono font-bold uppercase tracking-wider border transition flex items-center space-x-1 sm:space-x-1\.5 \$\{/g,
  'className={`hidden sm:flex px-2 sm:px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border transition items-center space-x-1 sm:space-x-1.5 ${'
);
code = code.replace(/<ThemeToggle \/>/, '<div className="hidden sm:block"><ThemeToggle /></div>');

// 6. Inject the Hamburger Menu at the end of the Right Actions block
// Using regex to match the exact end of the block regardless of \r or \n
const menuCode = `
            {/* Mobile Hamburger Menu */}
            <div className="sm:hidden relative">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="bg-black dark:bg-white hover:bg-black/80 text-white dark:text-[#121212] p-1.5 transition border border-black dark:border-white/30"
              >
                {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

              {showMobileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#F4F1EE] dark:bg-[#2A2A2A] border border-black dark:border-white/30 shadow-2xl py-1 z-[60] flex flex-col">
                  <button onClick={onOpenTranslate} className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-[#1E1E1E] flex items-center gap-2 text-black dark:text-white">
                    <Languages className="w-4 h-4" /> Translate
                  </button>
                  <button onClick={() => { setShowMobileMenu(false); setShowTemplateMenu(true); }} className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-[#1E1E1E] flex items-center gap-2 text-black dark:text-white">
                    <BookOpen className="w-4 h-4" /> Templates
                  </button>
                  <button onClick={onCopyMarkdown} className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-[#1E1E1E] flex items-center gap-2 text-black dark:text-white">
                    <Copy className="w-4 h-4" /> Copy Markdown
                  </button>
                  <button onClick={onDownloadMarkdown} className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-[#1E1E1E] flex items-center gap-2 text-black dark:text-white">
                    <Download className="w-4 h-4" /> Download .md
                  </button>
                  <button onClick={onCleanupFormat} className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-[#1E1E1E] flex items-center gap-2 text-black dark:text-white">
                    <Wand2 className="w-4 h-4" /> Cleanup Format
                  </button>
                  <button onClick={onOpenHistory} className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-[#1E1E1E] flex items-center gap-2 text-black dark:text-white">
                    <History className="w-4 h-4" /> History
                  </button>
                  <button onClick={onOpenSavedDocs} className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-[#1E1E1E] flex items-center gap-2 text-black dark:text-white">
                    <FolderOpen className="w-4 h-4" /> Saved Docs
                  </button>
                  <button onClick={() => setIsWatermarkEnabled(!isWatermarkEnabled)} className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b border-black/10 dark:border-white/10 hover:bg-white dark:hover:bg-[#1E1E1E] flex items-center gap-2 text-black dark:text-white">
                    <Palette className="w-4 h-4" /> Toggle Watermark
                  </button>
                  <div className="px-4 py-2.5 flex items-center justify-between text-black dark:text-white">
                    <span className="text-xs font-bold uppercase tracking-wider">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>`;

code = code.replace(
  /\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Mobile View Switcher Sub-bar \*\/\}/g,
  menuCode + '\n\n      {/* Mobile View Switcher Sub-bar */}'
);

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Update Complete');
