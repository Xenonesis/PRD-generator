const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

// 1. Revert container
code = code.replace('className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-1"', 'className="flex items-center space-x-1 sm:space-x-2 shrink-0 py-1"');

// 2. Hide Translate
code = code.replace(
  'className="flex items-center space-x-1 sm:space-x-1.5 bg-[#F4F1EE]', 
  'className="hidden sm:flex items-center space-x-1 sm:space-x-1.5 bg-[#F4F1EE]'
);

// 3. Hide Template Dropdown wrapper
code = code.replace(
  '{/* Template Dropdown */}\n            <div className="relative">',
  '{/* Template Dropdown */}\n            <div className="hidden sm:block relative">'
);

// 4. Hide Copy Markdown
code = code.replace(
  'className="bg-white dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] px-2 sm:px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider transition flex items-center space-x-1"',
  'className="hidden sm:flex bg-white dark:bg-[#2A2A2A] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-[#121212] border border-black dark:border-white/20 text-[#1A1A1A] dark:text-[#F4F1EE] px-2 sm:px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider transition items-center space-x-1"'
);

// 5. Hide Watermark Toggle
code = code.replace(
  'className={`px-2 sm:px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border transition flex items-center space-x-1 sm:space-x-1.5 ${',
  'className={`hidden sm:flex px-2 sm:px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border transition items-center space-x-1 sm:space-x-1.5 ${'
);

// 6. Hide ThemeToggle
code = code.replace('<ThemeToggle />', '<div className="hidden sm:block"><ThemeToggle /></div>');

// 7. Inject Mobile Menu
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
      </div>
`;

code = code.replace(
  '            </div>\n          </div>\n        </div>\n      </div>',
  menuCode
);

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Success');
