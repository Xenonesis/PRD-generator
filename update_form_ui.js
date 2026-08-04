const fs = require('fs');

let content = fs.readFileSync('components/InteractiveForm.tsx', 'utf8');

// 1. Container outer box
content = content.replace(
  /id="prd-editor-top" className={`bg-white dark:bg-\[#1A1A1A\] border border-black dark:border-white\/10 text-\[#1A1A1A\] dark:text-\[#F4F1EE\] shadow-sm overflow-hidden w-full min-w-0 no-print \${isFocusMode \? "fixed inset-0 z-\[200\] overflow-y-auto" : ""}`}/g,
  'id="prd-editor-top" className={`bg-white dark:bg-[#161616] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-neutral-100 shadow-md rounded-xl overflow-hidden w-full min-w-0 no-print ${isFocusMode ? "fixed inset-0 z-[200] overflow-y-auto" : ""}`}'
);

// 2. Tab Bar styling
content = content.replace(
  /className="bg-neutral-50 dark:bg-white\/5 border-b border-black dark:border-white\/10 p-2 flex relative w-full pr-12"/g,
  'className="bg-neutral-100/80 dark:bg-black/30 border-b border-neutral-200 dark:border-white/10 p-2.5 flex relative w-full pr-12 backdrop-blur-xs"'
);

// 3. Tab button styling
content = content.replace(
  /min-h-\[44px\] min-w-\[70px\] sm:min-w-\[90px\] p-2 space-y-1 transition-colors \${/g,
  'min-h-[44px] px-3 py-2 rounded-lg transition-all space-y-1 ${'
);

content = content.replace(
  /isActive \n\s*\? 'bg-black text-white dark:bg-white dark:text-\[#121212\]' \n\s*: 'text-black\/60 hover:bg-black\/5 dark:text-white\/60 dark:hover:bg-white\/10'/g,
  "isActive ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-white/10 font-medium'"
);

// 4. Input field styling upgrade
content = content.replace(
  /bg-white dark:bg-white\/5 border border-black dark:border-white\/10/g,
  'bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg'
);

content = content.replace(
  /bg-white dark:bg-[#2A2A2A] border border-black dark:border-white\/10/g,
  'bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white rounded-lg'
);

// 5. Textarea styling upgrade
content = content.replace(
  /rows={4}\n\s*className="w-full bg-white dark:bg-white\/5 border border-black dark:border-white\/10 focus:border-black dark:border-white\/30 p-3 text-sm text-\[#1A1A1A\] dark:text-\[#F4F1EE\] outline-none focus:ring-1 focus:ring-black\/20 dark:focus:ring-white\/20"/g,
  'rows={4}\n                className="w-full bg-neutral-50 dark:bg-[#121212] border border-neutral-300 dark:border-white/15 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 p-3 text-sm text-neutral-900 dark:text-neutral-100 outline-none rounded-lg transition-all shadow-2xs"'
);

fs.writeFileSync('components/InteractiveForm.tsx', content);
console.log('Updated InteractiveForm.tsx UI');
