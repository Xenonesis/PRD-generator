const fs = require('fs');
let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');
code = code.replace('bg-[#FAF9F6]', 'bg-[#FAF9F6] dark:bg-[#121212]');
fs.writeFileSync('components/DocumentView.tsx', code);
console.log('Fixed cover page background');
