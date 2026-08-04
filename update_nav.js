const fs = require('fs');
let content = fs.readFileSync('components/Navbar.tsx', 'utf8');

content = content.replace(/bg-white dark:bg-\[#2A2A2A\]/g, 'bg-white dark:bg-[#1A1A1A]');
content = content.replace(/bg-\[#EFECE7\] dark:bg-\[#1E1E1E\]/g, 'bg-white dark:bg-[#111111]');
content = content.replace(/text-black\/60 dark:text-white\/60/g, 'text-black/80 dark:text-white/80');

fs.writeFileSync('components/Navbar.tsx', content);
console.log('Updated Navbar.tsx');
