const fs = require('fs');
let code = fs.readFileSync('components/Navbar.tsx', 'utf8');

code = code.replace(
  "viewMode: 'editor' | 'split' | 'preview' | 'markdown';",
  "viewMode: 'editor' | 'split' | 'preview' | 'markdown' | 'insights';"
);

code = code.replace(
  "setViewMode: (mode: 'editor' | 'split' | 'preview' | 'markdown') => void;",
  "setViewMode: (mode: 'editor' | 'split' | 'preview' | 'markdown' | 'insights') => void;"
);

const desktopInsightsBtn = `            <button
              onClick={() => setViewMode('insights')}
              className={\`flex items-center space-x-1 px-3 py-1.5 transition-all \${
                viewMode === 'insights' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black dark:hover:bg-white/5'
              }\`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span>Insights</span>
            </button>
`;

code = code.replace(
  '{/* Center: Desktop View Switcher */}\n          <div className="hidden md:flex items-center bg-[#EFECE7] dark:bg-[#1E1E1E] p-1 border border-black dark:border-white/10 text-[10px] font-bold uppercase tracking-wider">',
  '{/* Center: Desktop View Switcher */}\n          <div className="hidden lg:flex items-center bg-[#EFECE7] dark:bg-[#1E1E1E] p-1 border border-black dark:border-white/10 text-[10px] font-bold uppercase tracking-wider">'
);

code = code.replace(
  '<Code2 className="w-3.5 h-3.5" />\n              <span>Markdown</span>\n            </button>',
  '<Code2 className="w-3.5 h-3.5" />\n              <span>Markdown</span>\n            </button>\n' + desktopInsightsBtn
);

const mobileInsightsBtn = `
        <button
          onClick={() => setViewMode('insights')}
          className={\`flex flex-col items-center space-y-0.5 px-2 py-1 transition-all \${
            viewMode === 'insights' ? 'bg-black dark:bg-white text-white dark:text-[#121212]' : 'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white'
          }\`}
        >
          <PieChartIcon className="w-3.5 h-3.5" />
          <span className="text-[9px]">Insights</span>
        </button>`;

code = code.replace(
  '<Code2 className="w-3.5 h-3.5" />\n          <span>Markdown</span>\n        </button>',
  '<Code2 className="w-3.5 h-3.5" />\n          <span className="text-[9px]">Markdown</span>\n        </button>' + mobileInsightsBtn
);

// We need to import PieChartIcon from lucide-react. Also change markdown text size in mobile
code = code.replace(
  'Code2,',
  'Code2, PieChart as PieChartIcon,'
);
// Make sure PieChartIcon is imported
if (!code.includes('PieChartIcon')) {
  code = code.replace('Code2, ', 'Code2, PieChart as PieChartIcon, ');
}

// Ensure the mobile view text are slightly smaller since we have 5 buttons now
code = code.replace(/<span>Editor<\/span>/g, '<span className="text-[9px]">Editor</span>');
code = code.replace(/<span>Split<\/span>/g, '<span className="text-[9px]">Split</span>');
code = code.replace(/<span>Preview<\/span>/g, '<span className="text-[9px]">Preview</span>');

fs.writeFileSync('components/Navbar.tsx', code);
console.log('Patched Navbar.tsx');
