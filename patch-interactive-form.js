const fs = require('fs');
let code = fs.readFileSync('components/InteractiveForm.tsx', 'utf8');

if (!code.includes('Maximize2')) {
  code = code.replace(
    "} from 'lucide-react';",
    "  Maximize2,\n  Minimize2\n} from 'lucide-react';"
  );
}

if (!code.includes('isFocusMode')) {
  code = code.replace(
    'const [activeTab, setActiveTab] = useState<',
    'const [isFocusMode, setIsFocusMode] = useState(false);\n  const [activeTab, setActiveTab] = useState<'
  );

  const containerTarget = '<div id="prd-editor-top" className="bg-[#EFECE7] dark:bg-[#1E1E1E] border border-black dark:border-white/10 text-[#1A1A1A] dark:text-[#F4F1EE] shadow-sm overflow-hidden w-full min-w-0 no-print">';
  const containerReplacement = '<div id="prd-editor-top" className={`bg-[#EFECE7] dark:bg-[#1E1E1E] border border-black dark:border-white/10 text-[#1A1A1A] dark:text-[#F4F1EE] shadow-sm overflow-hidden w-full min-w-0 no-print ${isFocusMode ? "fixed inset-0 z-[200] overflow-y-auto" : ""}`}>\n      {isFocusMode && (\n        <div className="sticky top-0 z-[210] flex justify-end p-4 bg-[#EFECE7]/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm border-b border-black/10 dark:border-white/10">\n          <button onClick={() => setIsFocusMode(false)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors bg-white dark:bg-[#2A2A2A] px-3 py-1.5 border border-black/20 dark:border-white/20">\n            <Minimize2 className="w-4 h-4" /> Exit Focus Mode\n          </button>\n        </div>\n      )}';
  
  code = code.replace(containerTarget, containerReplacement);
  
  const tabsTarget = '{/* Category Tabs Header */}\n      <div className="bg-[#F4F1EE] dark:bg-[#121212] border-b border-black dark:border-white/10 p-2 flex overflow-x-auto gap-1 no-scrollbar w-full">';
  const tabsReplacement = '{/* Category Tabs Header */}\n      {!isFocusMode && (\n        <div className="bg-[#F4F1EE] dark:bg-[#121212] border-b border-black dark:border-white/10 p-2 flex overflow-x-auto gap-1 no-scrollbar w-full relative pr-12">\n          <div className="flex overflow-x-auto gap-1 no-scrollbar flex-grow">\n          {tabs.map((tab) => {\n            const Icon = tab.icon;\n            const isActive = activeTab === tab.id;\n            return (\n              <button\n                key={tab.id}\n                onClick={() => setActiveTab(tab.id as typeof activeTab)}\n                className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[90px] p-2 space-y-1 transition-colors ${isActive ? "bg-black text-white dark:bg-white dark:text-[#121212]" : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"}`}\n              >\n                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />\n                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center line-clamp-1">{tab.label}</span>\n              </button>\n            );\n          })}\n          </div>\n          <div className="absolute right-0 top-0 h-full flex items-center justify-center px-2 bg-gradient-to-l from-[#F4F1EE] via-[#F4F1EE] dark:from-[#121212] dark:via-[#121212] to-transparent">\n            <button onClick={() => setIsFocusMode(true)} className="p-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Focus Mode">\n              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />\n            </button>\n          </div>\n        </div>\n      )}';
  
  // Actually the original tabs logic:
  //      <div className="bg-[#F4F1EE] dark:bg-[#121212] border-b border-black dark:border-white/10 p-2 flex overflow-x-auto gap-1 no-scrollbar w-full">
  //        {tabs.map((tab) => {
  //           ...
  //        })}
  //      </div>
  // Let's replace the whole block using a regex.
  code = code.replace(
    /\{\/\* Category Tabs Header \*\/}\s*<div className="bg-\[#F4F1EE\] dark:bg-\[#121212\] border-b border-black dark:border-white\/10 p-2 flex overflow-x-auto gap-1 no-scrollbar w-full">\s*\{tabs\.map\(\(tab\) => \{[\s\S]*?\}\)\}\s*<\/div>/,
    `{/* Category Tabs Header */}
      {!isFocusMode && (
        <div className="bg-[#F4F1EE] dark:bg-[#121212] border-b border-black dark:border-white/10 p-2 flex relative w-full pr-12">
          <div className="flex overflow-x-auto gap-1 no-scrollbar flex-grow">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={\`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[90px] p-2 space-y-1 transition-colors \${
                    isActive 
                      ? 'bg-black text-white dark:bg-white dark:text-[#121212]' 
                      : 'text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10'
                  }\`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center line-clamp-1">{tab.label}</span>
                </button>
              );
            })}
          </div>
          <div className="absolute right-0 top-0 h-full flex items-center justify-center bg-gradient-to-l from-[#F4F1EE] dark:from-[#121212] to-transparent pl-4 pr-2">
            <button 
              onClick={() => setIsFocusMode(true)} 
              className="flex flex-col items-center justify-center p-2 space-y-1 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors" 
              title="Enter Focus Mode"
            >
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center">Focus</span>
            </button>
          </div>
        </div>
      )}`
  );
  
  // When in focus mode, we should also probably fix the max-height of the inner container so it scrolls well.
  //   <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-280px)] xl:max-h-none xl:flex-1">
  const contentContainerTarget = 'className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-280px)] xl:max-h-none xl:flex-1"';
  const contentContainerReplacement = 'className={`p-4 sm:p-6 overflow-y-auto ${isFocusMode ? "h-full max-w-4xl mx-auto xl:flex-none" : "max-h-[calc(100vh-280px)] xl:max-h-none xl:flex-1"}`}';
  
  code = code.replace(contentContainerTarget, contentContainerReplacement);
}

fs.writeFileSync('components/InteractiveForm.tsx', code);
console.log('Patched components/InteractiveForm.tsx');
