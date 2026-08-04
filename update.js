const fs = require('fs');
let content = fs.readFileSync('components/DocumentView.tsx', 'utf8');

// 1. Fix wrapper container bg
content = content.replace(/className=\"bg-\[#D9D5CF\] p-1 sm:p-6 md:p-8 no-print-bg\"/g, 'className=\"bg-[#D9D5CF] dark:bg-transparent p-1 sm:p-6 md:p-8 no-print-bg\"');

// 2. Fix document card background and contrast
content = content.replace(/className=\"print-container bg-white dark:bg-\[#2A2A2A\] text-\[#1A1A1A\] dark:text-\[#F4F1EE\]/g, 'className=\"print-container bg-white dark:bg-[#1C1C1C] text-[#1A1A1A] dark:text-[#E0E0E0]');

// 3. Fix nested elements (like tables, lists, text blocks) that were blending in
content = content.replace(/bg-\[#F4F1EE\] dark:bg-\[#121212\]/g, 'bg-neutral-50 dark:bg-white/5');

// 4. Update specific text colors that were too dark
content = content.replace(/text-black\/70 dark:text-white\/70/g, 'text-black/90 dark:text-white/90');
content = content.replace(/text-black\/60 dark:text-white\/60/g, 'text-black/80 dark:text-white/80');
content = content.replace(/text-black\/50 dark:text-white\/50/g, 'text-black/70 dark:text-white/70');
content = content.replace(/text-black\/40 dark:text-white\/40/g, 'text-black/60 dark:text-white/60');

fs.writeFileSync('components/DocumentView.tsx', content);
console.log('Updated DocumentView.tsx');
