const fs = require('fs');
let code = fs.readFileSync('components/InteractiveForm.tsx', 'utf8');

const target = `{isFocusMode && (
        <div className="sticky top-0 z-[210] flex justify-end p-4 bg-[#EFECE7]/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border-b border-black/10 dark:border-white/10">
          <button onClick={() => setIsFocusMode(false)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors bg-white dark:bg-[#2A2A2A] px-3 py-1.5 border border-black/20 dark:border-white/20">
            <Minimize2 className="w-4 h-4" /> Exit Focus Mode
          </button>
        </div>
      )}`;

const replacement = `{isFocusMode && (
        <div className="sticky top-0 z-[210] flex justify-between items-center p-4 bg-[#EFECE7]/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-4">
            <h2 className="font-serif font-bold text-lg text-[#1A1A1A] dark:text-[#F4F1EE]">Focus Mode</h2>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="bg-white dark:bg-[#2A2A2A] border border-black/20 dark:border-white/20 text-xs font-bold text-black/80 dark:text-white/80 p-1.5 outline-none"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
          <button onClick={() => setIsFocusMode(false)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors bg-white dark:bg-[#2A2A2A] px-3 py-1.5 border border-black/20 dark:border-white/20">
            <Minimize2 className="w-4 h-4" /> Exit
          </button>
        </div>
      )}`;

if (code.includes('Exit Focus Mode')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('components/InteractiveForm.tsx', code);
  console.log('Patched focus mode header');
} else {
  console.log('Could not find target');
}
