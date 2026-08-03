const fs = require('fs');
const code = fs.readFileSync('components/DocumentView.tsx', 'utf8');

const startIndex = code.indexOf('const SectionControls = ');
const endIndex = code.indexOf('const sectionBlocks = ');
console.log(code.substring(startIndex, endIndex));
