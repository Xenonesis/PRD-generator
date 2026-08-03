const fs = require('fs');

let code = fs.readFileSync('components/DocumentView.tsx', 'utf8');
code = code.replace(/\(d: any, prdSectionClass: string, index: number/g, '(d: PRDData, prdSectionClass: string, index: number');

fs.writeFileSync('components/DocumentView.tsx', code);
console.log('Fixed d: PRDData type');
